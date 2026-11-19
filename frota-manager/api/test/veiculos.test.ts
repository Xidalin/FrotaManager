import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { once } from "node:events";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

test("RF-01: cadastro, duplicidade, edição e inativação de veículos via HTTP", async t => {
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
  const url = "http://127.0.0.1:" + endereco.port + "/veiculos";
  const enviar = (method: string, path: string, body: unknown) => fetch(url + path, {
    method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  const dados = { placa: "abc-1d23", modelo: "Uno", marca: "Fiat", ano: 2020, quilometragem: 100 };
  assert.equal((await enviar("POST", "", {})).status, 400);
  assert.equal((await enviar("POST", "", { ...dados, placa: "XYZ1D23", modelo: "x".repeat(101) })).status, 400);
  assert.equal((await enviar("POST", "", { ...dados, placa: "DEF1G23", quilometragem: 100000000 })).status, 400);
  const criado = await enviar("POST", "", dados);
  assert.equal(criado.status, 201);
  const veiculo = await criado.json();
  assert.equal(veiculo.placa, "ABC1D23");
  assert.equal(veiculo.ano, 2020);
  assert.equal(veiculo.quilometragem, 100);
  const caminho = "/" + veiculo.id;
  assert.equal((await enviar("POST", "", { ...dados, placa: veiculo.placa })).status, 409);
  assert.equal((await enviar("PATCH", caminho, { quilometragem: 120 })).status, 200);
  assert.equal((await enviar("PATCH", caminho, { quilometragem: 110 })).status, 422);
  const ativos = await (await fetch(url)).json();
  assert.equal(ativos[0].quilometragem, 120);
  assert.equal((await fetch(url + caminho, { method: "DELETE" })).status, 204);
  assert.deepEqual(await (await fetch(url)).json(), []);
  assert.equal((await enviar("PATCH", caminho, { modelo: "Novo" })).status, 404);
  assert.equal((await enviar("POST", "", dados)).status, 409);
});
