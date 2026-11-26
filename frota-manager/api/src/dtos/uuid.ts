import { ErroApi } from "../errors/erroApi.js";

export function lerId(valor: unknown) {
  if (
    typeof valor !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor)
  )
    throw new ErroApi(400, "ID inválido.");
  return valor;
}
