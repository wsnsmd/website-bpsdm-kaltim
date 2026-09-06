// src/lib/actions/ppid.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db, eq, and, desc, asc, sql, or, like } from "@/db";
import {
  ppidPermohonan,
  ppidKeberatan,
  ppidInformasi,
  ppidPejabat,
} from "@/db/schema";
import { z } from "zod";
import { transporter, MAIL_FROM, ADMIN_EMAIL, SITE_URL } from "@/lib/mailer";
import {
  templateKonfirmasiPemohon,
  templateNotifAdmin,
  templateKonfirmasiKeberatan,
  templateNotifAdminKeberatan,
} from "@/lib/email-templates/ppid";

// ── Helper ────────────────────────────────────
function generateNomor(prefix: "PPID" | "PPID-KBR" = "PPID"): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}-${year}${month}-${random}`;
}

// ══════════════════════════════════════════════
// PERMOHONAN
// ══════════════════════════════════════════════
const PermohonanSchema = z.object({
  kategoriPemohon: z.enum(["perorangan", "badan_hukum"]).default("perorangan"),
  namaInstansi: z.string().optional(),
  namaPemohon: z.string().min(3, "Nama minimal 3 karakter"),
  nik: z.string().min(16, "NIK harus 16 digit").max(16, "NIK harus 16 digit"),
  ktpUrl: z.string().min(1, "KTP/identitas pribadi wajib diunggah"),
  email: z.string().email("Email tidak valid"),
  noHp: z.string().optional(),
  alamat: z.string().optional(),
  pekerjaan: z.string().optional(),
  subjekInfo: z.string().min(5, "Subjek minimal 5 karakter"),
  deskripsiInfo: z.string().min(10, "Rincian Informasi minimal 10 karakter"),
  tujuanInfo: z.string().optional(),
  caraMemperolehInfo: z
    .enum(["melihat", "membaca", "mendengarkan", "mencatat"])
    .optional(),
  caraMendapat: z
    .enum(["email", "ambil_langsung", "pos", "faksimili"])
    .default("email"),
  caraMedia: z.enum(["softcopy", "hardcopy", "keduanya"]).default("softcopy"),
});

export async function submitPermohonan(formData: FormData) {
  const raw = {
    kategoriPemohon: formData.get("kategoriPemohon") || "perorangan",
    namaInstansi: formData.get("namaInstansi") || undefined,
    namaPemohon: formData.get("namaPemohon"),
    nik: formData.get("nik"),
    ktpUrl: formData.get("ktpUrl") || "",
    email: formData.get("email"),
    noHp: formData.get("noHp") || undefined,
    alamat: formData.get("alamat") || undefined,
    pekerjaan: formData.get("pekerjaan") || undefined,
    subjekInfo: formData.get("subjekInfo"),
    deskripsiInfo: formData.get("deskripsiInfo"),
    tujuanInfo: formData.get("tujuanInfo") || undefined,
    caraMemperolehInfo: formData.get("caraMemperolehInfo") || undefined,
    caraMendapat: formData.get("caraMendapat"),
    caraMedia: formData.get("caraMedia"),
  };

  const parsed = PermohonanSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  if (
    parsed.data.kategoriPemohon === "badan_hukum" &&
    !parsed.data.namaInstansi?.trim()
  ) {
    return { error: "Nama badan hukum/organisasi wajib diisi" };
  }

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
      kategoriPemohon: parsed.data.kategoriPemohon,
      ktpUrl: parsed.data.ktpUrl ?? null,
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

export async function deletePermohonan(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.delete(ppidPermohonan).where(eq(ppidPermohonan.id, id));

  revalidatePath("/admin/ppid");
}

// ══════════════════════════════════════════════
// KEBERATAN (Pasal 35 UU KIP No.14/2008)
// ══════════════════════════════════════════════
const ALASAN_KEBERATAN_VALUES = [
  "penolakan_permohonan",
  "tidak_disediakan_berkala",
  "tidak_ditanggapi",
  "ditanggapi_tidak_sebagaimana_mestinya",
  "tidak_dipenuhi",
  "biaya_tidak_wajar",
  "melebihi_jangka_waktu",
] as const;

// Validasi permohonan sebelum keberatan bisa diajukan — mengikuti pola
// PPID DKI Jakarta: pemohon wajib memasukkan Kode Permohonan + NIK yang
// cocok dengan data permohonan yang sudah ada.
export async function validasiPermohonanKeberatan(
  kodePermohonan: string,
  nik: string,
) {
  if (!kodePermohonan?.trim() || !nik?.trim()) {
    return { error: "Kode permohonan dan NIK wajib diisi" };
  }

  const result = await db
    .select()
    .from(ppidPermohonan)
    .where(eq(ppidPermohonan.nomorPermohonan, kodePermohonan.trim()))
    .limit(1);

  const p = result[0];
  if (!p) {
    return { error: "Kode permohonan tidak ditemukan" };
  }
  if (!p.nik || p.nik !== nik.trim()) {
    return { error: "NIK tidak sesuai dengan data permohonan" };
  }

  return {
    success: true,
    permohonan: {
      id: p.id,
      nomorPermohonan: p.nomorPermohonan ?? "",
      namaPemohon: p.namaPemohon,
      nik: p.nik,
      email: p.email,
      noHp: p.noHp,
      alamat: p.alamat,
      subjekInfo: p.subjekInfo,
    },
  };
}

const KeberatanSchema = z.object({
  permohonanId: z.coerce.number().int().positive(),
  kodePermohonan: z.string().min(1),
  namaPemohon: z.string().min(3),
  nik: z.string().min(16).max(16),
  email: z.string().email(),
  noHp: z.string().optional(),
  alamat: z.string().optional(),
  alasanKeberatan: z
    .array(z.enum(ALASAN_KEBERATAN_VALUES))
    .min(1, "Pilih minimal 1 alasan keberatan"),
  dikuasakan: z.coerce.boolean().default(false),
  namaKuasa: z.string().optional(),
  uraianKeberatan: z.string().min(20, "Uraian minimal 20 karakter"),
  suratKeberatanUrl: z.string().min(1, "Surat keberatan wajib diunggah"),
});

export async function submitKeberatan(formData: FormData) {
  const raw = {
    permohonanId: formData.get("permohonanId"),
    kodePermohonan: formData.get("kodePermohonan"),
    namaPemohon: formData.get("namaPemohon"),
    nik: formData.get("nik"),
    email: formData.get("email"),
    noHp: formData.get("noHp"),
    alamat: formData.get("alamat"),
    alasanKeberatan: formData.getAll("alasanKeberatan"),
    dikuasakan: formData.get("dikuasakan"),
    namaKuasa: formData.get("namaKuasa"),
    uraianKeberatan: formData.get("uraianKeberatan"),
    suratKeberatanUrl: formData.get("suratKeberatanUrl"),
  };

  const parsed = KeberatanSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  if (parsed.data.dikuasakan && !parsed.data.namaKuasa?.trim()) {
    return { error: "Nama kuasa wajib diisi jika pengajuan dikuasakan" };
  }

  const nomor = generateNomor("PPID-KBR");

  try {
    await db.insert(ppidKeberatan).values({
      ...parsed.data,
      nomorKeberatan: nomor,
      status: "diterima",
    });
  } catch {
    return { error: "Gagal menyimpan keberatan. Coba lagi." };
  }

  try {
    const konfirmasi = templateKonfirmasiKeberatan({
      nomor,
      nama: parsed.data.namaPemohon,
      uraian: parsed.data.uraianKeberatan,
      siteUrl: SITE_URL,
    });

    const notifAdmin = templateNotifAdminKeberatan({
      nomor,
      nama: parsed.data.namaPemohon,
      email: parsed.data.email,
      noHp: parsed.data.noHp ?? null,
      alasanKeberatan: parsed.data.alasanKeberatan,
      uraian: parsed.data.uraianKeberatan,
      nomorPermohonanAsal: parsed.data.kodePermohonan,
      dikuasakan: parsed.data.dikuasakan,
      namaKuasa: parsed.data.namaKuasa ?? null,
      suratKeberatanUrl: parsed.data.suratKeberatanUrl,
      siteUrl: SITE_URL,
    });

    await Promise.allSettled([
      transporter.sendMail({
        from: MAIL_FROM,
        to: parsed.data.email,
        subject: konfirmasi.subject,
        html: konfirmasi.html,
      }),
      transporter.sendMail({
        from: MAIL_FROM,
        to: ADMIN_EMAIL,
        subject: notifAdmin.subject,
        html: notifAdmin.html,
      }),
    ]);
  } catch (emailError) {
    console.error("Email error:", emailError);
  }

  revalidatePath("/admin/ppid/keberatan");
  return { success: true, nomor };
}

export async function updateStatusKeberatan(
  id: number,
  status: "diterima" | "diproses" | "selesai" | "ditolak" | "diteruskan_ki",
  catatan?: string,
  jawabanUrl?: string,
) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db
    .update(ppidKeberatan)
    .set({
      status,
      catatan: catatan ?? null,
      jawabanUrl: jawabanUrl ?? null,
      selesaiAt: status === "selesai" ? new Date() : null,
    })
    .where(eq(ppidKeberatan.id, id));

  try {
    const result = await db
      .select()
      .from(ppidKeberatan)
      .where(eq(ppidKeberatan.id, id))
      .limit(1);
    const k = result[0];

    if (k?.email) {
      const { templateUpdateStatusKeberatan } =
        await import("@/lib/email-templates/ppid");
      const tmpl = templateUpdateStatusKeberatan({
        nomor: k.nomorKeberatan ?? "",
        nama: k.namaPemohon,
        status,
        catatan: catatan ?? null,
        jawabanUrl: jawabanUrl ?? null,
        siteUrl: SITE_URL,
      });

      await transporter
        .sendMail({
          from: MAIL_FROM,
          to: k.email,
          subject: tmpl.subject,
          html: tmpl.html,
        })
        .catch((e) => console.error("Email status keberatan error:", e));
    }
  } catch (e) {
    console.error("Email update keberatan error:", e);
  }

  revalidatePath("/admin/ppid/keberatan");
  revalidatePath(`/admin/ppid/keberatan/${id}`);
}

export async function deleteKeberatan(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await db.delete(ppidKeberatan).where(eq(ppidKeberatan.id, id));

  revalidatePath("/admin/ppid/keberatan");
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
