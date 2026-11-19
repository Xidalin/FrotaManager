export class ErroApi extends Error {
  constructor(public status: number, mensagem: string) { super(mensagem); }
}

export interface Cadastro {
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  quilometragem: number;
}

export function validarVeiculo(body: unknown, parcial: true): Partial<Cadastro>;
export function validarVeiculo(body: unknown, parcial: false): Cadastro;
export function validarVeiculo(body: unknown, parcial: boolean): Partial<Cadastro> {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new ErroApi(400, "Informe um objeto JSON.");
  const campos = ["placa", "modelo", "marca", "ano", "quilometragem"];
  const dados: Partial<Cadastro> = {};
  const entradas = Object.entries(body);
  if (!entradas.length || (!parcial && !campos.every(c => Object.hasOwn(body, c))))
    throw new ErroApi(400, "Confira os campos obrigatórios.");
  for (const [campo, valor] of entradas) {
    switch (campo) {
      case "placa": {
        const placa = typeof valor === "string" ? valor.trim().toUpperCase() : "";
        if (!/^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/.test(placa))
          throw new ErroApi(400, "Placa inválida.");
        dados.placa = placa.replace("-", "");
        break;
      }
      case "marca":
      case "modelo":
        if (typeof valor !== "string" || !valor.trim() || valor.trim().length > 100)
          throw new ErroApi(400, "Marca e modelo devem conter de 1 a 100 caracteres.");
        dados[campo] = valor.trim();
        break;
      case "ano":
        if (!Number.isInteger(valor) || valor < 1000 || valor > 9999)
          throw new ErroApi(400, "Informe o ano com quatro dígitos.");
        dados.ano = valor;
        break;
      case "quilometragem":
        if (!Number.isFinite(valor) || valor < 0 || valor > 99999999.99)
          throw new ErroApi(400, "Quilometragem inválida.");
        dados.quilometragem = valor;
        break;
      default:
        throw new ErroApi(400, "Campo desconhecido: " + campo);
    }
  }
  return dados;
}
