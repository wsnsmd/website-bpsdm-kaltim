// src/lib/actions/survey.ts
"use server";

import { db } from "@/db";
import { surveyResponses } from "@/db/schema";
import { headers } from "next/headers";
import { z } from "zod";

const SurveySchema = z.object({
  ratingTampilan: z.coerce.number().min(1).max(5),
  ratingKemudahan: z.coerce.number().min(1).max(5),
  ratingKonten: z.coerce.number().min(1).max(5),
  ratingKecepatan: z.coerce.number().min(1).max(5),
  ratingLayanan: z.coerce.number().min(1).max(5),
  komentar: z.string().max(1000).nullable().optional(),
  saran: z.string().max(1000).nullable().optional(),
});

export async function submitSurvey(formData: FormData) {
  const parsed = SurveySchema.safeParse({
    ratingTampilan: formData.get("ratingTampilan"),
    ratingKemudahan: formData.get("ratingKemudahan"),
    ratingKonten: formData.get("ratingKonten"),
    ratingKecepatan: formData.get("ratingKecepatan"),
    ratingLayanan: formData.get("ratingLayanan"),
    komentar: formData.get("komentar"),
    saran: formData.get("saran"),
  });

  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  const ratingRata = (
    (d.ratingTampilan +
      d.ratingKemudahan +
      d.ratingKonten +
      d.ratingKecepatan +
      d.ratingLayanan) /
    5
  ).toFixed(2);

  const hdrs = await headers();
  const ipAddress =
    hdrs.get("x-forwarded-for")?.split(",")[0] ??
    hdrs.get("x-real-ip") ??
    "unknown";
  const userAgent = hdrs.get("user-agent") ?? "";

  try {
    await db.insert(surveyResponses).values({
      ratingTampilan: d.ratingTampilan,
      ratingKemudahan: d.ratingKemudahan,
      ratingKonten: d.ratingKonten,
      ratingKecepatan: d.ratingKecepatan,
      ratingLayanan: d.ratingLayanan,
      ratingRata: ratingRata as any,
      komentar: d.komentar || null,
      saran: d.saran || null,
      ipAddress: ipAddress.slice(0, 45),
      userAgent: userAgent.slice(0, 500),
    });
  } catch {
    return { error: "Gagal menyimpan survei. Coba lagi." };
  }

  return { success: true, rata: Number(ratingRata) };
}
