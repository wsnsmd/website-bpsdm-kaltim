// src/lib/mailer.ts
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST ?? "sandbox.smtp.mailtrap.io",
  port: Number(process.env.MAILTRAP_PORT ?? 2525),
  auth: {
    user: process.env.MAILTRAP_USER ?? "",
    pass: process.env.MAILTRAP_PASS ?? "",
  },
});

export const MAIL_FROM =
  process.env.MAIL_FROM ?? "PPID BPSDM Kaltim <noreply@bpsdmkaltimprov.go.id>";
export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ?? "ppid@bpsdmkaltimprov.go.id";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
