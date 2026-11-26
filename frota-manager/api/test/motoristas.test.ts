import { test } from "node:test";
import assert from "node:assert/strict";
import { iniciarApi } from "./api.js";

test("RF-01: vínculo com funcionário, duplicidades e inativação de motorista", async t => {
  const api = await iniciarApi(t);
  const enviar = (path: string, method: string, body: unknown) => fetch(api + path, {
    method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  });
  async function criarFuncionario(cpf: string) {
    const resposta = await enviar("/funcionarios", "POST", {
      cpf, nome: "Pessoa de teste", cargo: "Motorista", inicioContrato: "2026-11-26"
    });
    assert.equal(resposta.status, 201);
    return (await resposta.json()).id as string;
  }
  const funcionarioId = await criarFuncionario("00000000001");
  const segundo = await criarFuncionario("00000000002");
  const dados = { funcionarioId, cnh: "00000000001", categoriaCnh: "b" };
  const criar = (body: unknown) => enviar("/motoristas", "POST", body);
  assert.equal((await criar({ ...dados, cnh: "123" })).status, 400);
  const criado = await criar(dados);
  assert.equal(criado.status, 201);
  const motorista = await criado.json();
  assert.equal(motorista.categoriaCnh, "B");
  assert.equal(motorista.funcionario.nome, "Pessoa de teste");
  assert.equal((await criar({ ...dados, funcionarioId: segundo })).status, 409);
  assert.equal((await criar({ ...dados, cnh: "00000000002" })).status, 409);
  const caminho = "/motoristas/" + motorista.id;
  assert.equal((await enviar(caminho, "PATCH", { categoriaCnh: "D" })).status, 200);
  const lista = await (await fetch(api + "/motoristas")).json();
  assert.equal(lista[0].categoriaCnh, "D");
  assert.equal((await fetch(api + caminho, { method: "DELETE" })).status, 204);
  assert.deepEqual(await (await fetch(api + "/motoristas")).json(), []);
  assert.equal((await enviar(caminho, "PATCH", { categoriaCnh: "C" })).status, 404);
  assert.equal((await fetch(api + "/funcionarios/" + segundo, { method: "DELETE" })).status, 204);
  assert.equal((await criar({ funcionarioId: segundo, cnh: "00000000003", categoriaCnh: "B" })).status, 404);
});
