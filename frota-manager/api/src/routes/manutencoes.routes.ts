import { Router } from "express";
import * as manutencoes from "../controllers/manutencoes.controllers.js";

export const rotasManutencoes = Router();

rotasManutencoes.get("/", manutencoes.listar);
rotasManutencoes.post("/", manutencoes.cadastrar);
rotasManutencoes.patch("/:id/concluir", manutencoes.concluir);