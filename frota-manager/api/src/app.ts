import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { ErroApi } from "./errors/erroApi.js";
import { Prisma } from "./generated/prisma/client.js";
import { rotasVeiculos } from "./routes/veiculos.routes.js";

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());
app.use("/veiculos", rotasVeiculos);
const tratarErro: ErrorRequestHandler = (erro, _req, res, _next) => {
  if (erro instanceof ErroApi) res.status(erro.status).json({ erro: erro.message });
  else if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002")
    res.status(409).json({ erro: "Placa já cadastrada." });
  else if (erro.type === "entity.parse.failed") res.status(400).json({ erro: "JSON inválido." });
  else if (erro.type === "entity.too.large") res.status(413).json({ erro: "Corpo muito grande." });
  else res.status(500).json({ erro: "Falha interna ao processar a solicitação." });
};
app.use(tratarErro);
