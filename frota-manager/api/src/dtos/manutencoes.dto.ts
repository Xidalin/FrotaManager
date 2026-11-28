import { ErroApi } from "../errors/erroApi.js";

export type CadastroManutencao = {
  placa: string;
  tipo: "PREVENTIVA" | "CORRETIVA";
  dataInicio: Date;
  previsaoTermino: Date;
  observacoes?: string;
};

function lerData(valor: unknown, campo: string): Date {
  if (typeof valor !== "string") {
    throw new ErroApi(400, `${campo} deve ser uma data válida.`);
  }

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    throw new ErroApi(400, `${campo} deve ser uma data válida.`);
  }

  return data;
}

export function validarCadastroManutencao(body: unknown): CadastroManutencao {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ErroApi(400, "Informe os dados da manutenção.");
  }

  const dados = body as Record<string, unknown>;
  const permitidos = new Set([
    "placa",
    "tipo",
    "dataInicio",
    "previsaoTermino",
    "observacoes",
  ]);

  for (const campo of Object.keys(dados)) {
    if (!permitidos.has(campo)) {
      throw new ErroApi(400, `Campo desconhecido: ${campo}`);
    }
  }

  const placaInformada =
    typeof dados.placa === "string" ? dados.placa.trim().toUpperCase() : "";

  if (!/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/.test(placaInformada)) {
    throw new ErroApi(400, "Placa inválida.");
  }

  if (dados.tipo !== "PREVENTIVA" && dados.tipo !== "CORRETIVA") {
    throw new ErroApi(400, "Tipo deve ser PREVENTIVA ou CORRETIVA.");
  }

  const dataInicio = lerData(dados.dataInicio, "Data de início");
  const previsaoTermino = lerData(
    dados.previsaoTermino,
    "Previsão de término",
  );

  if (previsaoTermino <= dataInicio) {
    throw new ErroApi(
      400,
      "A previsão de término deve ser posterior à data de início.",
    );
  }

  let observacoes: string | undefined;
  if (dados.observacoes !== undefined) {
    if (typeof dados.observacoes !== "string") {
      throw new ErroApi(400, "Observações devem ser um texto.");
    }
    observacoes = dados.observacoes.trim();
  }

  return {
    placa: placaInformada.replace("-", ""),
    tipo: dados.tipo,
    dataInicio,
    previsaoTermino,
    ...(observacoes === undefined ? {} : { observacoes }),
  };
}