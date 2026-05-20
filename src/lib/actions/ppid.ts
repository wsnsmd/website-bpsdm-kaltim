// src/lib/actions/ppid.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq, and, desc, asc, sql, or, like } from "@/db";
import { ppidPermohonan, ppidInformasi, ppidPejabat } from "@/db/schema";
import { z } from "zod";
import { transporter, MAIL_FROM, ADMIN_EMAIL, SITE_URL } from "@/lib/mailer";
import {
  templateKonfirmasiPemohon,
  templateNotifAdmin,
} from "@/lib/email-templates/ppid";

// ── Helper ────────────────────────────────────
function generateNomor(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `PPID-${year}${month}-${random}`;
}

// ══════════════════════════════════════════════
// PERMOHONAN
// ══════════════════════════════════════════════
const PermohonanSchema = z.object({
  namaPemohon: z.string().min(3, "Nama minimal 3 karakter"),
  nik: z.string().optional(),
  email: z.string().email("Email tidak valid"),
  noHp: z.string().optional(),
  alamat: z.string().optional(),
  pekerjaan: z.string().optional(),
  subjekInfo: z.string().min(5, "Subjek minimal 5 karakter"),
  deskripsiInfo: z.string().min(20, "Deskripsi minimal 20 karakter"),
  tujuanInfo: z.string().optional(),
  caraMendapat: z.enum(["email", "ambil_langsung", "pos"]).default("email"),
  caraMedia: z.enum(["softcopy", "hardcopy", "keduanya"]).default("softcopy"),
});

export async function submitPermohonan(formData: FormData) {
  const raw = {
    namaPemohon: formData.get("namaPemohon"),
    nik: formData.get("nik"),
    email: formData.get("email"),
    noHp: formData.get("noHp"),
    alamat: formData.get("alamat"),
    pekerjaan: formData.get("pekerjaan"),
    subjekInfo: formData.get("subjekInfo"),
    deskripsiInfo: formData.get("deskripsiInfo"),
    tujuanInfo: formData.get("tujuanInfo"),
    caraMendapat: formData.get("caraMendapat"),
    caraMedia: formData.get("caraMedia"),
  };

  const parsed = PermohonanSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const nomor = generateNomor();

  try {
    await db.insert(ppidPermohonan).values({
      ...parsed.data,
      nomorPermohonan: nomor,
      status: "diterima",
    });
  } catch {
    return { error: "Gagal menyimpan permohonan. Coba lagi." };
  }

  try {
    const konfirmasi = templateKonfirmasiPemohon({
      nomor: nomor,
      nama: parsed.data.namaPemohon,
      subjek: parsed.data.subjekInfo,
      caraMendapat: parsed.data.caraMendapat,
      siteUrl: SITE_URL,
    });

    const notifAdmin = templateNotifAdmin({
      nomor: nomor,
      nama: parsed.data.namaPemohon,
      email: parsed.data.email,
      noHp: parsed.data.noHp ?? null,
      subjek: parsed.data.subjekInfo,
      deskripsi: parsed.data.deskripsiInfo,
      caraMendapat: parsed.data.caraMendapat,
      caraMedia: parsed.data.caraMedia,
      siteUrl: SITE_URL,
    });

    // Kirim paralel
    await Promise.allSettled([
      // Email ke pemohon
      transporter.sendMail({
        from: MAIL_FROM,
        to: parsed.data.email,
        subject: konfirmasi.subject,
        html: konfirmasi.html,
      }),
      // Email ke admin
      transporter.sendMail({
        from: MAIL_FROM,
        to: ADMIN_EMAIL,
        subject: notifAdmin.subject,
        html: notifAdmin.html,
      }),
    ]);
  } catch (emailError) {
    // Email gagal tidak block response
    console.error("Email error:", emailError);
  }

  revalidatePath("/admin/ppid");
  return { success: true, nomor };
}

export async function updateStatusPermohonan(
  id: number,
  status: "diterima" | "diproses" | "selesai" | "ditolak" | "banding",
  catatan?: string,
  jawabanUrl?: string,
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db
    .update(ppidPermohonan)
    .set({
      status,
      catatan: catatan ?? null,
      jawabanUrl: jawabanUrl ?? null,
      selesaiAt: status === "selesai" ? new Date() : null,
    })
    .where(eq(ppidPermohonan.id, id));

  // Ambil data permohonan untuk email
  try {
    const result = await db
      .select()
      .from(ppidPermohonan)
      .where(eq(ppidPermohonan.id, id))
      .limit(1);
    const p = result[0];

    if (p?.email) {
      const { templateUpdateStatus } =
        await import("@/lib/email-templates/ppid");
      const tmpl = templateUpdateStatus({
        nomor: p.nomorPermohonan ?? "",
        nama: p.namaPemohon,
        status,
        catatan: catatan ?? null,
        jawabanUrl: jawabanUrl ?? null,
        siteUrl: SITE_URL,
      });

      await transporter
        .sendMail({
          from: MAIL_FROM,
          to: p.email,
          subject: tmpl.subject,
          html: tmpl.html,
        })
        .catch((e) => console.error("Email status error:", e));
    }
  } catch (e) {
    console.error("Email update error:", e);
  }

  revalidatePath("/admin/ppid");
  revalidatePath(`/admin/ppid/${id}`);
}

// ══════════════════════════════════════════════
// INFORMASI PUBLIK
// ══════════════════════════════════════════════
const InformasiSchema = z.object({
  judul: z.string().min(3),
  deskripsi: z.string().optional(),
  tipe: z.enum(["berkala", "serta_merta", "setiap_saat", "dikecualikan"]),
  fileUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  fileType: z.string().optional(),
  fileSize: z.coerce.number().optional(),
  tahun: z.coerce.number().optional(),
  status: z.enum(["published", "draft"]).default("published"),
  sortOrder: z.coerce.number().default(0),
});

export async function createPpidInformasi(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = InformasiSchema.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    tipe: formData.get("tipe"),
    fileUrl: formData.get("fileUrl"),
    externalUrl: formData.get("externalUrl"),
    fileType: formData.get("fileType"),
    fileSize: formData.get("fileSize"),
    tahun: formData.get("tahun"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db.insert(ppidInformasi).values({
    ...parsed.data,
    deskripsi: parsed.data.deskripsi || null,
    fileUrl: parsed.data.fileUrl || null,
    externalUrl: parsed.data.externalUrl || null,
    fileType: parsed.data.fileType || null,
    createdBy: (session.user as any).username ?? session.user.email ?? null,
  });

  revalidatePath("/ppid");
  revalidatePath("/admin/ppid/informasi");
  redirect("/admin/ppid/informasi");
}

export async function updatePpidInformasi(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = InformasiSchema.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    tipe: formData.get("tipe"),
    fileUrl: formData.get("fileUrl"),
    externalUrl: formData.get("externalUrl"),
    fileType: formData.get("fileType"),
    fileSize: formData.get("fileSize"),
    tahun: formData.get("tahun"),
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db
    .update(ppidInformasi)
    .set({
      ...parsed.data,
      deskripsi: parsed.data.deskripsi || null,
      fileUrl: parsed.data.fileUrl || null,
      externalUrl: parsed.data.externalUrl || null,
      fileType: parsed.data.fileType || null,
    })
    .where(eq(ppidInformasi.id, id));

  revalidatePath("/ppid");
  revalidatePath("/admin/ppid/informasi");
  redirect("/admin/ppid/informasi");
}

export async function deletePpidInformasi(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(ppidInformasi).where(eq(ppidInformasi.id, id));
  revalidatePath("/ppid");
  revalidatePath("/admin/ppid/informasi");
}

// ══════════════════════════════════════════════
// PEJABAT PPID
// ══════════════════════════════════════════════
const PejabatSchema = z.object({
  nama: z.string().min(3),
  jabatan: z.string().min(3),
  foto: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  noHp: z.string().optional(),
  tipe: z.enum(["utama", "pembantu", "atasan"]),
  sortOrder: z.coerce.number().default(0),
  isActive: z.coerce.boolean().default(true),
});

export async function createPpidPejabat(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = PejabatSchema.safeParse({
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    foto: formData.get("foto"),
    email: formData.get("email"),
    noHp: formData.get("noHp"),
    tipe: formData.get("tipe"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;
  await db.insert(ppidPejabat).values({
    ...data,
    email: data.email || null,
    foto: data.foto || null,
    noHp: data.noHp || null,
  });

  revalidatePath("/ppid");
  revalidatePath("/admin/ppid/pejabat");
  redirect("/admin/ppid/pejabat");
}

export async function updatePpidPejabat(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const parsed = PejabatSchema.safeParse({
    nama: formData.get("nama"),
    jabatan: formData.get("jabatan"),
    foto: formData.get("foto"),
    email: formData.get("email"),
    noHp: formData.get("noHp"),
    tipe: formData.get("tipe"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "true",
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const data = parsed.data;
  await db
    .update(ppidPejabat)
    .set({
      ...data,
      email: data.email || null,
      foto: data.foto || null,
      noHp: data.noHp || null,
    })
    .where(eq(ppidPejabat.id, id));

  revalidatePath("/ppid");
  revalidatePath("/admin/ppid/pejabat");
  redirect("/admin/ppid/pejabat");
}

export async function deletePpidPejabat(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  await db.delete(ppidPejabat).where(eq(ppidPejabat.id, id));
  revalidatePath("/ppid");
  revalidatePath("/admin/ppid/pejabat");
}

export async function getPpidInformasi(
  options: {
    tipe?: string;
    search?: string;
    limit?: number;
    offset?: number;
    sort?: string;
  } = {},
) {
  const { tipe, search, limit = 12, offset = 0, sort = "terbaru" } = options;

  const conditions = [
    eq(ppidInformasi.status, "published"),
    tipe ? eq(ppidInformasi.tipe, tipe as any) : undefined,
    search
      ? or(
          like(ppidInformasi.judul, `%${search}%`),
          like(ppidInformasi.deskripsi, `%${search}%`),
        )
      : undefined,
  ].filter(Boolean) as any[];

  const orderBy =
    sort === "az"
      ? asc(ppidInformasi.judul)
      : sort === "za"
        ? desc(ppidInformasi.judul)
        : sort === "terlama"
          ? asc(ppidInformasi.createdAt)
          : desc(ppidInformasi.createdAt);

  return db
    .select()
    .from(ppidInformasi)
    .where(and(...conditions))
    .orderBy(asc(ppidInformasi.sortOrder), orderBy)
    .limit(limit)
    .offset(offset);
}

export async function countPpidInformasi(
  options: {
    tipe?: string;
    search?: string;
  } = {},
) {
  const { tipe, search } = options;

  const conditions = [
    eq(ppidInformasi.status, "published"),
    tipe ? eq(ppidInformasi.tipe, tipe as any) : undefined,
    search
      ? or(
          like(ppidInformasi.judul, `%${search}%`),
          like(ppidInformasi.deskripsi, `%${search}%`),
        )
      : undefined,
  ].filter(Boolean) as any[];

  const result = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(ppidInformasi)
    .where(and(...conditions));

  return result[0]?.total ?? 0;
}
