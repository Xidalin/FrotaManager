import type { RequestHandler } from "express";
import { lerId } from "../dtos/uuid.js";
import { validarFuncionario } from "../dtos/funcionarios.dto.js";
import * as funcionarios from "../services/funcionarios.services.js";

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
