import { ErroApi } from "../errors/erroApi.js";

export interface Cadastro {
  nome: string;
  cpf: string;
  cargo: string;
  email?: string | null;
  inicioContrato: Date;
}

export function validarFuncionario(body: unknown, parcial: true): Partial<Cadastro>;
export function validarFuncionario(body: unknown, parcial: false): Cadastro;
export function validarFuncionario(body: unknown, parcial: boolean): Partial<Cadastro> {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new ErroApi(400, "Informe um objeto JSON.");
  const camposObrigatorios = ["nome", "cpf", "cargo"];
  const temInicioContrato =
    Object.hasOwn(body, "inicioContrato") || Object.hasOwn(body, "inicio_contrato");
  const dados: Partial<Cadastro> = {};
  const entradas = Object.entries(body);
  if (
    !entradas.length ||
    (!parcial && (!camposObrigatorios.every(c => Object.hasOwn(body, c)) || !temInicioContrato))
  )
    throw new ErroApi(400, "Confira os campos obrigatórios.");
  for (const [campo, valor] of entradas) {
    switch (campo) {
      case "nome":
        if (typeof valor !== "string" || !valor.trim() || valor.trim().length > 150)
          throw new ErroApi(400, "Nome deve conter de 1 a 150 caracteres.");
        dados.nome = valor.trim();
        break;
      case "cpf": {
        const cpf = typeof valor === "string" ? valor.trim() : "";
        if (!/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(cpf))
          throw new ErroApi(400, "CPF inválido.");
        dados.cpf = cpf.replace(/\D/g, "");
        break;
      }
      case "cargo":
        if (typeof valor !== "string" || !valor.trim() || valor.trim().length > 80)
          throw new ErroApi(400, "Cargo deve conter de 1 a 80 caracteres.");
        dados.cargo = valor.trim();
        break;
      case "email": {
        if (valor === null) {
          dados.email = null;
          break;
        }
        const email = typeof valor === "string" ? valor.trim() : "";
        if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          throw new ErroApi(400, "E-mail inválido.");
        dados.email = email;
        break;
      }
      case "inicioContrato":
      case "inicio_contrato": {
        if (valor instanceof Date) {
          if (Number.isNaN(valor.getTime()))
            throw new ErroApi(400, "Data de início de contrato inválida.");
          dados.inicioContrato = valor;
          break;
        }
        const texto = typeof valor === "string" ? valor.trim() : "";
        if (!/^\d{4}-\d{2}-\d{2}(T.*)?$/.test(texto))
          throw new ErroApi(400, "Data de início de contrato inválida.");
        const data = new Date(texto.length === 10 ? `${texto}T00:00:00.000Z` : texto);
        if (Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== texto.slice(0, 10))
          throw new ErroApi(400, "Data de início de contrato inválida.");
        dados.inicioContrato = data;
        break;
      }
      default:
        throw new ErroApi(400, "Campo desconhecido: " + campo);
    }
  }
  return dados;
}
