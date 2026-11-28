-- CreateEnum
CREATE TYPE "StatusVeiculo" AS ENUM ('DISPONIVEL', 'EM_VIAGEM', 'EM_MANUTENCAO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusMotorista" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "StatusViagem" AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoManutencao" AS ENUM ('PREVENTIVA', 'CORRETIVA');

-- CreateEnum
CREATE TYPE "StatusManutencao" AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- Preserve the existing vehicle records and integer IDs while matching the new model.
ALTER TABLE "veiculo" RENAME TO "veiculos";
ALTER TABLE "veiculos" RENAME CONSTRAINT "veiculo_pkey" TO "veiculos_pkey";
ALTER INDEX "veiculo_placa_key" RENAME TO "veiculos_placa_key";
ALTER TABLE "veiculos" RENAME COLUMN "ano" TO "ano_fabricacao";
ALTER TABLE "veiculos" RENAME COLUMN "kilometragem" TO "odometro_atual";
ALTER TABLE "veiculos" ALTER COLUMN "modelo" TYPE VARCHAR(100) USING "modelo"::VARCHAR(100);
ALTER TABLE "veiculos" ALTER COLUMN "marca" TYPE VARCHAR(100) USING "marca"::VARCHAR(100);
ALTER TABLE "veiculos" ALTER COLUMN "odometro_atual" TYPE DECIMAL(10,2) USING "odometro_atual"::DECIMAL(10,2);
ALTER TABLE "veiculos" ADD COLUMN "status" "StatusVeiculo" NOT NULL DEFAULT 'DISPONIVEL';
ALTER TABLE "veiculos" ADD COLUMN "criado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "veiculos" ADD COLUMN "atualizado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE INDEX "veiculos_status_ativo_idx" ON "veiculos"("status", "ativo");

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(150) NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "cargo" VARCHAR(80) NOT NULL,
    "email" VARCHAR(254),
    "inicio_contrato" DATE NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motoristas" (
    "id" UUID NOT NULL,
    "funcionario_id" UUID NOT NULL,
    "cnh" VARCHAR(11) NOT NULL,
    "categoria_cnh" VARCHAR(3) NOT NULL,
    "status" "StatusMotorista" NOT NULL DEFAULT 'ATIVO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "motoristas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viagens" (
    "id" UUID NOT NULL,
    "veiculo_id" INTEGER NOT NULL,
    "motorista_id" UUID NOT NULL,
    "origem" VARCHAR(200) NOT NULL,
    "destino" VARCHAR(200) NOT NULL,
    "data_saida" TIMESTAMPTZ(3) NOT NULL,
    "previsao_chegada" TIMESTAMPTZ(3) NOT NULL,
    "chegada_real" TIMESTAMPTZ(3),
    "odometro_saida" DECIMAL(10,2),
    "odometro_chegada" DECIMAL(10,2),
    "status" "StatusViagem" NOT NULL DEFAULT 'AGENDADA',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "viagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manutencoes" (
    "id" UUID NOT NULL,
    "veiculo_id" INTEGER NOT NULL,
    "tipo" "TipoManutencao" NOT NULL,
    "status" "StatusManutencao" NOT NULL DEFAULT 'AGENDADA',
    "data_inicio" TIMESTAMPTZ(3) NOT NULL,
    "previsao_termino" TIMESTAMPTZ(3) NOT NULL,
    "concluida_em" TIMESTAMPTZ(3),
    "observacoes" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manutencoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencias" (
    "id" UUID NOT NULL,
    "viagem_id" UUID NOT NULL,
    "tipo" VARCHAR(60) NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocorrencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_viagem" (
    "id" UUID NOT NULL,
    "viagem_id" UUID NOT NULL,
    "evento" VARCHAR(60) NOT NULL,
    "dados" JSONB,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_viagem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_cpf_key" ON "funcionarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_email_key" ON "funcionarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "motoristas_funcionario_id_key" ON "motoristas"("funcionario_id");

-- CreateIndex
CREATE UNIQUE INDEX "motoristas_cnh_key" ON "motoristas"("cnh");

-- CreateIndex
CREATE INDEX "viagens_veiculo_id_data_saida_previsao_chegada_idx" ON "viagens"("veiculo_id", "data_saida", "previsao_chegada");

-- CreateIndex
CREATE INDEX "viagens_motorista_id_data_saida_previsao_chegada_idx" ON "viagens"("motorista_id", "data_saida", "previsao_chegada");

-- CreateIndex
CREATE INDEX "viagens_status_data_saida_idx" ON "viagens"("status", "data_saida");

-- CreateIndex
CREATE INDEX "manutencoes_veiculo_id_status_data_inicio_previsao_termino_idx" ON "manutencoes"("veiculo_id", "status", "data_inicio", "previsao_termino");

-- CreateIndex
CREATE INDEX "ocorrencias_viagem_id_criado_em_idx" ON "ocorrencias"("viagem_id", "criado_em");

-- CreateIndex
CREATE INDEX "historico_viagem_viagem_id_criado_em_idx" ON "historico_viagem"("viagem_id", "criado_em");

-- AddForeignKey
ALTER TABLE "motoristas" ADD CONSTRAINT "motoristas_funcionario_id_fkey" FOREIGN KEY ("funcionario_id") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagens" ADD CONSTRAINT "viagens_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id_pk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagens" ADD CONSTRAINT "viagens_motorista_id_fkey" FOREIGN KEY ("motorista_id") REFERENCES "motoristas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manutencoes" ADD CONSTRAINT "manutencoes_veiculo_id_fkey" FOREIGN KEY ("veiculo_id") REFERENCES "veiculos"("id_pk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias" ADD CONSTRAINT "ocorrencias_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_viagem" ADD CONSTRAINT "historico_viagem_viagem_id_fkey" FOREIGN KEY ("viagem_id") REFERENCES "viagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
