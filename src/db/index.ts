// src/db/index.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

function getPool(): mysql.Pool {
  if (!global._mysqlPool) {
    global._mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectionLimit: 10,
      enableKeepAlive: true,
      charset: "utf8mb4",
      timezone: "+08:00",
    });
  }
  return global._mysqlPool;
}

export const db = drizzle(getPool(), { schema, mode: "default" });

export {
  eq,
  and,
  or,
  desc,
  asc,
  sql,
  like,
  gte,
  lte,
  inArray,
  isNull,
  isNotNull,
  count,
} from "drizzle-orm";
