import type { RequestHandler } from "express";
import { lerId } from "../dtos/uuid.js";
import { validarMotorista } from "../dtos/motoristas.dto.js";
import * as motoristas from "../services/motoristas.services.js";

export const listar: RequestHandler = async (_req, res) => {
  res.json(await motoristas.listar());
};
export const cadastrar: RequestHandler = async (req, res) => {
  res.status(201).json(await motoristas.cadastrar(validarMotorista(req.body, false)));
};
export const editar: RequestHandler = async (req, res) => {
  res.json(await motoristas.editar(lerId(req.params.id), validarMotorista(req.body, true)));
};
export const inativar: RequestHandler = async (req, res) => {
  await motoristas.inativar(lerId(req.params.id));
  res.sendStatus(204);
};
