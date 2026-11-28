import { Router } from "express";
import * as funcionarios from "../controllers/funcionarios.controllers.js";

export const rotasFuncionarios = Router();
rotasFuncionarios.get("/", funcionarios.listar);
rotasFuncionarios.post("/", funcionarios.cadastrar);
rotasFuncionarios.patch("/:id", funcionarios.editar);
rotasFuncionarios.delete("/:id", funcionarios.inativar);
