import type { RequestHandler } from "express";
import { ErroApi, validarVeiculo } from "../dtos/veiculos.dto.js";
import * as veiculos from "../services/veiculos.services.js";

function lerId(valor: unknown) {
  if (typeof valor !== "string" || !/^[1-9]\d*$/.test(valor) || Number(valor) > 2147483647)
    throw new ErroApi(400, "ID inválido.");
  return Number(valor);
}

export const listar: RequestHandler = async (_req, res) => {
  res.json(await veiculos.listar());
};
export const cadastrar: RequestHandler = async (req, res) => {
  res.status(201).json(await veiculos.cadastrar(validarVeiculo(req.body, false)));
};
export const editar: RequestHandler = async (req, res) => {
  res.json(await veiculos.editar(lerId(req.params.id), validarVeiculo(req.body, true)));
};
export const inativar: RequestHandler = async (req, res) => {
  await veiculos.inativar(lerId(req.params.id));
  res.sendStatus(204);
};
