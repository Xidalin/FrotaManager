import type { RequestHandler } from "express";
import { ErroApi } from "../errors/erroApi.js";
import { validarFuncionario } from "../dtos/funcionarios.dto.js";
import * as funcionarios from "../services/funcionarios.services.js";

function lerId(valor: unknown) {
  if (
    typeof valor !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valor)
  )
    throw new ErroApi(400, "ID inválido.");
  return valor;
}

export const listar: RequestHandler = async (_req, res) => {
  res.json(await funcionarios.listar());
};
export const cadastrar: RequestHandler = async (req, res) => {
  res.status(201).json(await funcionarios.cadastrar(validarFuncionario(req.body, false)));
};
export const editar: RequestHandler = async (req, res) => {
  res.json(await funcionarios.editar(lerId(req.params.id), validarFuncionario(req.body, true)));
};
export const inativar: RequestHandler = async (req, res) => {
  await funcionarios.inativar(lerId(req.params.id));
  res.sendStatus(204);
};
