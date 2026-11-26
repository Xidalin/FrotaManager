import { Router } from "express";
import * as motoristas from "../controllers/motoristas.controllers.js";

export const rotasMotoristas = Router();
rotasMotoristas.get("/", motoristas.listar);
rotasMotoristas.post("/", motoristas.cadastrar);
rotasMotoristas.patch("/:id", motoristas.editar);
rotasMotoristas.delete("/:id", motoristas.inativar);
