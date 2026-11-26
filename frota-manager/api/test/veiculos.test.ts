import { test } from "node:test";
import assert from "node:assert/strict";
import { iniciarApi } from "./api.js";

test("RF-01: cadastro, duplicidade, edição e inativação de veículos via HTTP", async t => {
  const url = await iniciarApi(t) + "/veiculos";
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
