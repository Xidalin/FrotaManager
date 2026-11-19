import { Router } from "express";
import * as veiculos from "../controllers/veiculos.controllers.js";

export const rotasVeiculos = Router();
rotasVeiculos.get("/", veiculos.listar);
rotasVeiculos.post("/", veiculos.cadastrar);
rotasVeiculos.patch("/:id", veiculos.editar);
rotasVeiculos.delete("/:id", veiculos.inativar);
