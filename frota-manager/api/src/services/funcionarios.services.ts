import { prisma } from "../database/prisma.js";
import { ErroApi } from "../errors/erroApi.js";

type Cadastro = {
  nome: string;
  cpf: string;
  cargo: string;
  email?: string | null;
  inicioContrato: Date;
};

function paraResposta(funcionario: {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  email: string | null;
  inicioContrato: Date;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}) {
  return {
    id: funcionario.id,
    nome: funcionario.nome,
    cpf: funcionario.cpf,
    cargo: funcionario.cargo,
    email: funcionario.email,
    inicioContrato: funcionario.inicioContrato,
    ativo: funcionario.ativo,
    criadoEm: funcionario.criadoEm,
    atualizadoEm: funcionario.atualizadoEm
  };
}

export async function listar() {
  const funcionarios = await prisma.funcionario.findMany({
    where: { ativo: true },
    orderBy: { id: "asc" }
  });
  return funcionarios.map(paraResposta);
}

export async function cadastrar(data: Cadastro) {
  const funcionario = await prisma.funcionario.create({
    data: {
      nome: data.nome,
      cpf: data.cpf,
      cargo: data.cargo,
      ...(data.email === undefined ? {} : { email: data.email }),
      inicioContrato: data.inicioContrato
    }
  });
  return paraResposta(funcionario);
}

export async function editar(id: string, data: Partial<Cadastro>) {
  const [atualizado] = await prisma.funcionario.updateManyAndReturn({
    where: {
      id,
      ativo: true
    },
    data: {
      ...(data.nome === undefined ? {} : { nome: data.nome }),
      ...(data.cpf === undefined ? {} : { cpf: data.cpf }),
      ...(data.cargo === undefined ? {} : { cargo: data.cargo }),
      ...(data.email === undefined ? {} : { email: data.email }),
      ...(data.inicioContrato === undefined ? {} : { inicioContrato: data.inicioContrato })
    }
  });
  if (atualizado) return paraResposta(atualizado);
  throw new ErroApi(404, "Funcionário não encontrado.");
}

export async function inativar(id: string) {
  const resultado = await prisma.funcionario.updateMany({
    where: { id, ativo: true },
    data: { ativo: false }
  });
  if (!resultado.count) throw new ErroApi(404, "Funcionário não encontrado.");
}
