// drizzle.config.ts
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

// Fungsi untuk menentukan file env yang akan digunakan
function getEnvFile() {
  // Prioritas: NODE_ENV menentukan environment
  const nodeEnv = process.env.NODE_ENV || "development";

  if (nodeEnv === "production") {
    return ".env.production";
  }

  // Development: coba .env.local dulu, fallback ke .env
  if (fs.existsSync(path.resolve(process.cwd(), ".env.local"))) {
    return ".env.local";
  }

  return ".env";
}

// Load env file yang sesuai
const envFile = getEnvFile();
dotenv.config({ path: envFile });

console.log(`📦 Using environment file: ${envFile}`);

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
