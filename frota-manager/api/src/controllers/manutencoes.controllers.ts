import type { RequestHandler } from "express";
import { lerId } from "../dtos/uuid.js";
import { validarCadastroManutencao } from "../dtos/manutencoes.dto.js";
import * as manutencoes from "../services/manutencoes.services.js";

export const listar: RequestHandler = async (_req, res) => {
  res.json(await manutencoes.listar());
};

export const cadastrar: RequestHandler = async (req, res) => {
  res
    .status(201)
    .json(
      await manutencoes.cadastrar(
        validarCadastroManutencao(req.body),
      ),
    );
};

export const concluir: RequestHandler = async (req, res) => {
  res.json(await manutencoes.concluir(lerId(req.params.id)));
};