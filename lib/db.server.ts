import { PrismaClient } from "@prisma/client";

declare global {
  var __db: PrismaClient | undefined;
}

function cretaPrismaDB() {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  }
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  return global.__db;
}

export const db = cretaPrismaDB();
