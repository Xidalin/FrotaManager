import { prisma } from "../database/prisma.js";
import { ErroApi, type Cadastro } from "../dtos/veiculos.dto.js";

export const listar = () => prisma.veiculo.findMany({ where: { ativo: true }, orderBy: { id: "asc" } });
export const cadastrar = (data: Cadastro) => prisma.veiculo.create({ data });

export async function editar(id: number, data: Partial<Cadastro>) {
  // A condição no próprio UPDATE impede regressão mesmo em edições simultâneas.
  const [atualizado] = await prisma.veiculo.updateManyAndReturn({
    where: { id, ativo: true, ...(data.quilometragem === undefined ? {} : {
      quilometragem: { lte: data.quilometragem }
    }) }, data
  });
  if (atualizado) return atualizado;
  if (await prisma.veiculo.count({ where: { id, ativo: true } }))
    throw new ErroApi(422, "A quilometragem não pode diminuir.");
  throw new ErroApi(404, "Veículo não encontrado.");
}

export async function inativar(id: number) {
  const resultado = await prisma.veiculo.updateMany({ where: { id, ativo: true }, data: { ativo: false } });
  if (!resultado.count) throw new ErroApi(404, "Veículo não encontrado.");
}
