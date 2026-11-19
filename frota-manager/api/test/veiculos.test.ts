import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { once } from "node:events";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";

test("RF-01: cadastro, duplicidade, edição e inativação de veículos via HTTP", async t => {
  const db = await PGlite.create();
  t.after(() => db.close());
  const sql = await readFile(new URL("../prisma/migrations/20261118_cadastro_veiculo/migration.sql", import.meta.url), "utf8");
  await db.exec(sql);
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
  const criado = await enviar("POST", "", dados);
  assert.equal(criado.status, 201);
  const veiculo = await criado.json();
  assert.equal(veiculo.placa, "ABC1D23");
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
