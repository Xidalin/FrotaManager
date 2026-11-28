import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("Configure DATABASE_URL no .env da API.");
export const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
