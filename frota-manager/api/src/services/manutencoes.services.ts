import { prisma } from "../database/prisma.js";
import type { CadastroManutencao } from "../dtos/manutencoes.dto.js";
import { ErroApi } from "../errors/erroApi.js";

const veiculoNaResposta = {
  select: {
    placa: true,
    modelo: true,
    marca: true,
    status: true,
  },
} as const;

export function listar() {
  return prisma.manutencao.findMany({
    where: { ativo: true },
    include: { veiculo: veiculoNaResposta },
    orderBy: { criadoEm: "desc" },
  });
}

export function cadastrar(dados: CadastroManutencao) {
  return prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({
      where: { placa: dados.placa },
      select: { id: true, ativo: true },
    });

    if (!veiculo || !veiculo.ativo) {
      throw new ErroApi(404, "Veículo ativo não encontrado.");
    }

    const bloqueado = await tx.veiculo.updateMany({
      where: {
        id: veiculo.id,
        ativo: true,
        status: "DISPONIVEL",
      },
      data: { status: "EM_MANUTENCAO" },
    });

    if (bloqueado.count === 0) {
      throw new ErroApi(409, "Veículo não está disponível para manutenção.");
    }

    return tx.manutencao.create({
      data: {
        veiculoId: veiculo.id,
        tipo: dados.tipo,
        dataInicio: dados.dataInicio,
        previsaoTermino: dados.previsaoTermino,
        ...(dados.observacoes === undefined
          ? {}
          : { observacoes: dados.observacoes }),
      },
      include: { veiculo: veiculoNaResposta },
    });
  });
}

export function concluir(id: string) {
  return prisma.$transaction(async (tx) => {
    const manutencao = await tx.manutencao.findFirst({
      where: { id, ativo: true },
    });

    if (!manutencao) {
      throw new ErroApi(404, "Manutenção ativa não encontrada.");
    }

    if (
      manutencao.status === "CONCLUIDA" ||
      manutencao.status === "CANCELADA"
    ) {
      throw new ErroApi(409, "Manutenção não pode ser concluída nesse status.");
    }

    await tx.manutencao.update({
      where: { id },
      data: {
        status: "CONCLUIDA",
        concluidaEm: new Date(),
      },
    });

    await tx.veiculo.updateMany({
      where: {
        id: manutencao.veiculoId,
        ativo: true,
        status: "EM_MANUTENCAO",
      },
      data: { status: "DISPONIVEL" },
    });

    return tx.manutencao.findUniqueOrThrow({
      where: { id },
      include: { veiculo: veiculoNaResposta },
    });
  });
}