// src/lib/email-templates/ppid.ts

const BRAND_COLOR = "#0e3d20";
const GOLD_COLOR = "#daa520";

function baseLayout(content: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${BRAND_COLOR};border-radius:12px 12px 0 0;padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:18px;font-weight:800;color:#fff;letter-spacing:-0.3px;">
                    PPID BPSDM Kaltim
                  </div>
                  <div style="font-size:12px;color:rgba(255,255,255,0.5);margin-top:2px;">
                    Pejabat Pengelola Informasi dan Dokumentasi
                  </div>
                </td>
                <td align="right">
                  <div style="width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.1);display:inline-flex;align-items:center;justify-content:center;">
                    <span style="font-size:20px;">🛡️</span>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#fff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
              Email ini dikirim otomatis oleh sistem PPID BPSDM Provinsi Kalimantan Timur.<br/>
              Jl. H.A.M.M. Rifaddin No. 88, Samarinda, Kalimantan Timur<br/>
              <a href="mailto:ppid@bpsdmkaltimprov.go.id" style="color:${BRAND_COLOR};text-decoration:none;">
                ppid@bpsdmkaltimprov.go.id
              </a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Email ke PEMOHON — konfirmasi terima ──────
export function templateKonfirmasiPemohon(data: {
  nomor: string;
  nama: string;
  subjek: string;
  caraMendapat: string;
  siteUrl: string;
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">
      Permohonan Diterima ✓
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
      Halo <strong>${data.nama}</strong>, permohonan informasi publik Anda telah kami terima.
    </p>

    <!-- Nomor permohonan -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#16a34a;margin-bottom:6px;">
        Nomor Permohonan Anda
      </div>
      <div style="font-size:28px;font-weight:900;color:${BRAND_COLOR};letter-spacing:2px;font-family:monospace;">
        ${data.nomor}
      </div>
      <div style="font-size:12px;color:#6b7280;margin-top:6px;">
        Simpan nomor ini untuk melacak status permohonan
      </div>
    </div>

    <!-- Detail -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Subjek Informasi</span><br/>
          <span style="font-size:14px;color:#111827;font-weight:500;">${data.subjek}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;">
          <span style="font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Cara Mendapatkan</span><br/>
          <span style="font-size:14px;color:#111827;font-weight:500;">${data.caraMendapat}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;">
          <span style="font-size:12px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.5px;">Estimasi Respons</span><br/>
          <span style="font-size:14px;color:#111827;font-weight:500;">Maksimal 10 hari kerja</span>
        </td>
      </tr>
    </table>

    <!-- CTA tracking -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="${data.siteUrl}/ppid/permohonan#tracking"
        style="display:inline-block;padding:12px 28px;background:${BRAND_COLOR};color:#fff;border-radius:9px;text-decoration:none;font-size:14px;font-weight:700;">
        Cek Status Permohonan
      </a>
    </div>

    <!-- Info tambahan -->
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;">
      <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
        <strong>ℹ️ Informasi:</strong> Jika permohonan memerlukan waktu lebih dari 10 hari kerja,
        PPID akan menghubungi Anda melalui email atau nomor yang didaftarkan.
        Anda berhak mengajukan keberatan jika tidak mendapat respons dalam waktu yang ditentukan.
      </p>
    </div>
  `;

  return {
    subject: `[PPID BPSDM] Permohonan ${data.nomor} Diterima`,
    html: baseLayout(content, "Konfirmasi Permohonan PPID"),
  };
}

// ── Email ke ADMIN — notifikasi masuk ─────────
export function templateNotifAdmin(data: {
  nomor: string;
  nama: string;
  email: string;
  noHp: string | null;
  subjek: string;
  deskripsi: string;
  caraMendapat: string;
  caraMedia: string;
  siteUrl: string;
}): { subject: string; html: string } {
  const content = `
    <div style="background:#fef9c3;border:1px solid #fde047;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
      <strong style="color:#854d0e;font-size:13px;">🔔 Permohonan Baru Masuk</strong>
    </div>

    <h2 style="margin:0 0 20px;font-size:20px;font-weight:800;color:#111827;">
      ${data.subjek}
    </h2>

    <!-- Nomor -->
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px 18px;margin-bottom:20px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:13px;color:#16a34a;font-weight:600;">Nomor:</span>
      <span style="font-size:16px;font-weight:900;color:${BRAND_COLOR};font-family:monospace;letter-spacing:1px;">
        ${data.nomor}
      </span>
    </div>

    <!-- Data pemohon -->
    <h3 style="margin:0 0 12px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;">
      Data Pemohon
    </h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
      ${[
        ["Nama", data.nama],
        ["Email", data.email],
        ["No. HP", data.noHp ?? "—"],
        ["Cara Dapat", data.caraMendapat],
        ["Format Media", data.caraMedia],
      ]
        .map(
          ([label, value], i, arr) => `
        <tr style="background:${i % 2 === 0 ? "#fff" : "#f9fafb"};">
          <td style="padding:10px 14px;font-size:12px;font-weight:600;color:#6b7280;width:130px;border-bottom:${i < arr.length - 1 ? "1px solid #f3f4f6" : "none"};">
            ${label}
          </td>
          <td style="padding:10px 14px;font-size:13px;color:#111827;border-bottom:${i < arr.length - 1 ? "1px solid #f3f4f6" : "none"};">
            ${value}
          </td>
        </tr>
      `,
        )
        .join("")}
    </table>

    <!-- Deskripsi -->
    <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#9ca3af;">
      Rincian Informasi yang Dimohon
    </h3>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;font-size:13px;color:#374151;line-height:1.7;margin-bottom:24px;">
      ${data.deskripsi}
    </div>

    <!-- CTA admin -->
    <div style="text-align:center;">
      <a href="${data.siteUrl}/admin/ppid"
        style="display:inline-block;padding:12px 28px;background:${BRAND_COLOR};color:#fff;border-radius:9px;text-decoration:none;font-size:14px;font-weight:700;margin-right:8px;">
        Buka Panel Admin
      </a>
    </div>
  `;

  return {
    subject: `[PPID] Permohonan Baru: ${data.nomor} — ${data.nama}`,
    html: baseLayout(content, "Notifikasi Permohonan PPID"),
  };
}

// ── Email update status ke pemohon ────────────
export function templateUpdateStatus(data: {
  nomor: string;
  nama: string;
  status: string;
  catatan: string | null;
  jawabanUrl: string | null;
  siteUrl: string;
}): { subject: string; html: string } {
  const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; bg: string; emoji: string }
  > = {
    diterima: {
      label: "Diterima",
      color: "#1d4ed8",
      bg: "#eff6ff",
      emoji: "📬",
    },
    diproses: {
      label: "Diproses",
      color: "#d97706",
      bg: "#fffbeb",
      emoji: "⚙️",
    },
    selesai: { label: "Selesai", color: "#16a34a", bg: "#f0fdf4", emoji: "✅" },
    ditolak: { label: "Ditolak", color: "#dc2626", bg: "#fef2f2", emoji: "❌" },
    banding: { label: "Banding", color: "#7e22ce", bg: "#fdf4ff", emoji: "⚖️" },
  };

  const cfg = STATUS_CONFIG[data.status] ?? STATUS_CONFIG.diproses;

  const content = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#111827;">
      Update Status Permohonan ${cfg.emoji}
    </h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Halo <strong>${data.nama}</strong>, ada pembaruan status untuk permohonan Anda.
    </p>

    <!-- Nomor -->
    <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">Nomor Permohonan:</div>
    <div style="font-size:20px;font-weight:900;color:${BRAND_COLOR};font-family:monospace;letter-spacing:1px;margin-bottom:20px;">
      ${data.nomor}
    </div>

    <!-- Status badge -->
    <div style="background:${cfg.bg};border:1px solid ${cfg.color}30;border-radius:10px;padding:16px 20px;margin-bottom:20px;display:inline-block;width:100%;box-sizing:border-box;">
      <div style="font-size:12px;color:${cfg.color};font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
        Status Terkini
      </div>
      <div style="font-size:22px;font-weight:900;color:${cfg.color};">
        ${cfg.emoji} ${cfg.label}
      </div>
    </div>

    ${
      data.catatan
        ? `
    <!-- Catatan -->
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px;margin-bottom:20px;">
      <div style="font-size:12px;font-weight:700;color:#9ca3af;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">
        Catatan dari PPID
      </div>
      <div style="font-size:13.5px;color:#374151;line-height:1.65;">
        ${data.catatan}
      </div>
    </div>
    `
        : ""
    }

    ${
      data.jawabanUrl
        ? `
    <!-- Unduh jawaban -->
    <div style="text-align:center;margin-bottom:20px;">
      <a href="${data.jawabanUrl}"
        style="display:inline-block;padding:12px 28px;background:#16a34a;color:#fff;border-radius:9px;text-decoration:none;font-size:14px;font-weight:700;">
        📎 Unduh Dokumen Jawaban
      </a>
    </div>
    `
        : ""
    }

    <!-- CTA tracking -->
    <div style="text-align:center;">
      <a href="${data.siteUrl}/ppid/permohonan#tracking"
        style="display:inline-block;padding:10px 22px;border:1px solid ${BRAND_COLOR};color:${BRAND_COLOR};border-radius:9px;text-decoration:none;font-size:13px;font-weight:700;">
        Cek Status Lengkap
      </a>
    </div>
  `;

  return {
    subject: `[PPID BPSDM] Status Permohonan ${data.nomor}: ${cfg.label}`,
    html: baseLayout(content, `Status Permohonan ${cfg.label}`),
  };
}
