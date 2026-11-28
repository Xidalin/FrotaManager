import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import { ErroApi } from "./errors/erroApi.js";
import { Prisma } from "./generated/prisma/client.js";
import { rotasVeiculos } from "./routes/veiculos.routes.js";
import { rotasFuncionarios } from "./routes/funcionarios.routes.js";
import { rotasMotoristas } from "./routes/motoristas.routes.js";
import { rotasManutencoes } from "./routes/manutencoes.routes.js";

export const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json());
app.use("/veiculos", rotasVeiculos);
app.use("/funcionarios", rotasFuncionarios);
app.use("/motoristas", rotasMotoristas);
app.use("/manutencoes", rotasManutencoes);
function mensagemDuplicidade(erro: Prisma.PrismaClientKnownRequestError, caminho: string) {
  const detalhe = `${JSON.stringify(erro.meta ?? "")} ${erro.message}`.toLowerCase();
  if (detalhe.includes("placa")) return "Placa já cadastrada.";
  if (detalhe.includes("cpf")) return "CPF já cadastrado.";
  if (detalhe.includes("email")) return "E-mail já cadastrado.";
  if (detalhe.includes("cnh")) return "CNH já cadastrada.";
  if (detalhe.includes("funcionario_id") || detalhe.includes("funcionarioid"))
    return "Funcionário já cadastrado como motorista.";
  if (caminho.startsWith("/veiculos")) return "Placa já cadastrada.";
  return "Registro com dados únicos já cadastrado.";
}

const tratarErro: ErrorRequestHandler = (erro, req, res, _next) => {
  if (erro instanceof ErroApi) res.status(erro.status).json({ erro: erro.message });
  else if (erro instanceof Prisma.PrismaClientKnownRequestError && erro.code === "P2002")
    res.status(409).json({ erro: mensagemDuplicidade(erro, req.path) });
  else if (erro.type === "entity.parse.failed") res.status(400).json({ erro: "JSON inválido." });
  else if (erro.type === "entity.too.large") res.status(413).json({ erro: "Corpo muito grande." });
  else res.status(500).json({ erro: "Falha interna ao processar a solicitação." });
};
app.use(tratarErro);
