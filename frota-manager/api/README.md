# API de veículos do FrotaManager

Implementa o schema PostgreSQL do domínio da frota e a parte de veículos do RF-01. O serviço escuta em 127.0.0.1 para desenvolvimento local. A autenticação dos perfis de gestor e motorista está pendente.

## Verificar sem instalar um banco

Na pasta `frota-manager/api`, com Node.js 24 e npm, execute:

```sh
npm ci
npm run generate
npm run typecheck
npm test
```

O teste inicia um banco temporário PGlite, aplica todas as migrações da branch e exercita as rotas via HTTP.

## Executar com PostgreSQL local

A equipe decidiu PostgreSQL com Prisma. Para testar individualmente, crie um banco PostgreSQL vazio e exclusivo de desenvolvimento, copie `.env.example` para `.env` nesta pasta e ajuste `DATABASE_URL`. Nunca use credenciais reais em `.env.example` nem aplique migrações em bancos compartilhados sem autorização. A geração do cliente e os testes automatizados não exigem conexão com o banco configurado em `.env`.

```sh
npx prisma migrate deploy
npm run dev
```

As viagens têm índices por veículo/motorista, horário de saída e situação para apoiar consultas de disponibilidade e relatórios. A sobreposição de intervalos de viagens não é garantida por índices comuns; a RN-01 deve ser verificada pela camada de serviço/backend, dentro de uma transação.

Base local: `http://127.0.0.1:3001`. O navegador pode consumir a API a partir de `http://localhost:3000` (ajustável por `FRONTEND_ORIGIN`).

| Método e caminho | Resultado |
|---|---|
| POST /veiculos | 201 e veículo criado. Placa duplicada retorna 409, inclusive se estiver inativa. |
| GET /veiculos | 200 e lista de veículos ativos, ordenada por ID. |
| PATCH /veiculos/{id} | 200 e veículo atualizado. Aceita um ou mais campos do cadastro. Odômetro inferior retorna 422. |
| DELETE /veiculos/{id} | 204 e inativação lógica. Preserva o registro e sua placa. |

Corpo para POST (Content-Type: application/json):

```json
{"placa":"ABC1D23","marca":"Fiat","modelo":"Uno","ano":2020,"quilometragem":12000}
```

Campos inválidos retornam 400. Edição e inativação de um ID inexistente ou inativo retornam 404.
