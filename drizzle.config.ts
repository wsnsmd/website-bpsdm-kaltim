// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Tentukan path .env secara dinamis berdasarkan environment saat ini
const envPath =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";

// Muat variabel lingkungan dari file yang terpilih
dotenv.config({ path: envPath });

export default {
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "mysql",
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
