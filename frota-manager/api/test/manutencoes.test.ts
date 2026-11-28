import { test } from "node:test";
import assert from "node:assert/strict";
import { iniciarApi } from "./api.js";

test("RF-02: cadastrar e concluir manutenção atualiza disponibilidade do veículo", async t => {
  const api = await iniciarApi(t);

  const veiculoResposta = await fetch(api + "/veiculos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placa: "ABC1D23",
      modelo: "Uno",
      marca: "Fiat",
      ano: 2020,
      quilometragem: 100,
    }),
  });
  assert.equal(veiculoResposta.status, 201);

  const manutencaoResposta = await fetch(api + "/manutencoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placa: "ABC1D23",
      tipo: "PREVENTIVA",
      dataInicio: "2026-11-27T13:00:00.000Z",
      previsaoTermino: "2026-11-28T13:00:00.000Z",
      observacoes: "Revisão programada",
    }),
  });
  assert.equal(manutencaoResposta.status, 201);

  const manutencao = await manutencaoResposta.json();
  assert.equal(manutencao.status, "AGENDADA");
  assert.equal(manutencao.veiculo.status, "EM_MANUTENCAO");

  const duplicada = await fetch(api + "/manutencoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      placa: "ABC1D23",
      tipo: "CORRETIVA",
      dataInicio: "2026-11-27T14:00:00.000Z",
      previsaoTermino: "2026-11-28T14:00:00.000Z",
    }),
  });
  assert.equal(duplicada.status, 409);

  const conclusao = await fetch(
    api + `/manutencoes/${manutencao.id}/concluir`,
    { method: "PATCH" },
  );
  assert.equal(conclusao.status, 200);

  const manutencaoConcluida = await conclusao.json();
  assert.equal(manutencaoConcluida.status, "CONCLUIDA");
  assert.equal(manutencaoConcluida.veiculo.status, "DISPONIVEL");
});