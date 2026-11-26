import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { once } from "node:events";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

export async function iniciarApi(t: TestContext) {
  const db = await PGlite.create();
  t.after(() => db.close());
  const migrationsDir = new URL("../prisma/migrations/", import.meta.url);
  const migrations = (await readdir(migrationsDir, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
  for (const migration of migrations) {
    const sql = await readFile(new URL(`${migration}/migration.sql`, migrationsDir), "utf8");
    await db.exec(sql);
  }
  const socket = new PGLiteSocketServer({ db, host: "127.0.0.1", port: 0 });
  await socket.start();
  t.after(() => socket.stop());
  process.env.DATABASE_URL = "postgresql://postgres:postgres@" + socket.getServerConn() + "/postgres";
  const { app } = await import("../src/app.js");
  const { prisma } = await import("../src/database/prisma.js");
  t.after(() => prisma.$disconnect());
  const servidor = app.listen(0, "127.0.0.1");
  await once(servidor, "listening");
  t.after(() => new Promise<void>((resolve, reject) => servidor.close(e => e ? reject(e) : resolve())));
  const endereco = servidor.address();
  assert(endereco && typeof endereco === "object");
  return "http://127.0.0.1:" + endereco.port;
}
