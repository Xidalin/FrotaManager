import { prisma } from "../database/prisma.js";
import type { Cadastro, Edicao } from "../dtos/motoristas.dto.js";
import { ErroApi } from "../errors/erroApi.js";
import { Prisma } from "../generated/prisma/client.js";

const funcionario = { select: { nome: true, cpf: true } } as const;
const ativos = { ativo: true, funcionario: { ativo: true } };

export function listar() {
  return prisma.motorista.findMany({ where: ativos, include: { funcionario }, orderBy: { id: "asc" } });
}

export async function cadastrar({ funcionarioId, cnh, categoriaCnh }: Cadastro) {
  try {
    return await prisma.motorista.create({
      data: { cnh, categoriaCnh, funcionario: { connect: { id: funcionarioId, ativo: true } } },
      include: { funcionario }
    });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2014")
      throw new ErroApi(409, "Funcionário já cadastrado como motorista.");
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025")
      throw new ErroApi(404, "Funcionário ativo não encontrado.");
    throw erro;
  }
}

export async function editar(id: string, data: Edicao) {
  try {
    return await prisma.motorista.update({ where: { id, ...ativos }, data, include: { funcionario } });
  } catch (erro) {
    if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2025")
      throw new ErroApi(404, "Motorista ativo não encontrado.");
    throw erro;
  }
}

export async function inativar(id: string) {
  const resultado = await prisma.motorista.updateMany({
    where: { id, ativo: true }, data: { ativo: false, status: "INATIVO" }
  });
  if (!resultado.count) throw new ErroApi(404, "Motorista ativo não encontrado.");
}
