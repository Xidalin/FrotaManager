import { prisma } from "../database/prisma.js";
import { ErroApi, type Cadastro } from "../dtos/veiculos.dto.js";

function paraResposta(veiculo: {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  anoFabricacao: number;
  odometroAtual: { toNumber(): number };
  status: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}) {
  return {
    id: veiculo.id,
    placa: veiculo.placa,
    modelo: veiculo.modelo,
    marca: veiculo.marca,
    ano: veiculo.anoFabricacao,
    quilometragem: veiculo.odometroAtual.toNumber(),
    status: veiculo.status,
    ativo: veiculo.ativo,
    criadoEm: veiculo.criadoEm,
    atualizadoEm: veiculo.atualizadoEm
  };
}

export async function listar() {
  const veiculos = await prisma.veiculo.findMany({ where: { ativo: true }, orderBy: { id: "asc" } });
  return veiculos.map(paraResposta);
}

export async function cadastrar(data: Cadastro) {
  const veiculo = await prisma.veiculo.create({
    data: {
      placa: data.placa,
      modelo: data.modelo,
      marca: data.marca,
      anoFabricacao: data.ano,
      odometroAtual: data.quilometragem
    }
  });
  return paraResposta(veiculo);
}

export async function editar(id: number, data: Partial<Cadastro>) {
  // A condição no próprio UPDATE impede regressão mesmo em edições simultâneas.
  const [atualizado] = await prisma.veiculo.updateManyAndReturn({
    where: {
      id,
      ativo: true,
      ...(data.quilometragem === undefined ? {} : {
        odometroAtual: { lte: data.quilometragem }
      })
    },
    data: {
      ...(data.placa === undefined ? {} : { placa: data.placa }),
      ...(data.modelo === undefined ? {} : { modelo: data.modelo }),
      ...(data.marca === undefined ? {} : { marca: data.marca }),
      ...(data.ano === undefined ? {} : { anoFabricacao: data.ano }),
      ...(data.quilometragem === undefined ? {} : { odometroAtual: data.quilometragem })
    }
  });
  if (atualizado) return paraResposta(atualizado);
  if (await prisma.veiculo.count({ where: { id, ativo: true } }))
    throw new ErroApi(422, "A quilometragem não pode diminuir.");
  throw new ErroApi(404, "Veículo não encontrado.");
}

export async function inativar(id: number) {
  const resultado = await prisma.veiculo.updateMany({
    where: { id, ativo: true },
    data: { ativo: false, status: "INATIVO" }
  });
  if (!resultado.count) throw new ErroApi(404, "Veículo não encontrado.");
}
