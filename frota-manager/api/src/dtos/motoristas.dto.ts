import { ErroApi } from "../errors/erroApi.js";
import { lerId } from "./uuid.js";

export interface Cadastro {
  funcionarioId: string;
  cnh: string;
  categoriaCnh: string;
}
export type Edicao = Partial<Omit<Cadastro, "funcionarioId">>;

export function validarMotorista(body: unknown, parcial: false): Cadastro;
export function validarMotorista(body: unknown, parcial: true): Edicao;
export function validarMotorista(body: unknown, parcial: boolean): Partial<Cadastro> {
  if (!body || typeof body !== "object" || Array.isArray(body) || !Object.keys(body).length)
    throw new ErroApi(400, "Informe os dados do motorista.");
  if (!parcial && !["funcionarioId", "cnh", "categoriaCnh"].every(campo => Object.hasOwn(body, campo)))
    throw new ErroApi(400, "Informe funcionário, CNH e categoria.");
  const dados: Partial<Cadastro> = {};
  for (const [campo, valor] of Object.entries(body)) {
    switch (campo) {
      case "funcionarioId":
        if (parcial) throw new ErroApi(400, "O vínculo com funcionário é definido no cadastro.");
        dados.funcionarioId = lerId(valor);
        break;
      case "cnh":
        if (typeof valor !== "string" || !/^\d{11}$/.test(valor.trim()))
          throw new ErroApi(400, "Informe a CNH com 11 dígitos.");
        dados.cnh = valor.trim();
        break;
      case "categoriaCnh": {
        const categoria = typeof valor === "string" ? valor.trim().toUpperCase() : "";
        if (!/^(?:A|A?[BCDE]|ACC)$/.test(categoria)) throw new ErroApi(400, "Categoria inválida.");
        dados.categoriaCnh = categoria;
        break;
      }
      default:
        throw new ErroApi(400, "Campo desconhecido: " + campo);
    }
  }
  return dados;
}
