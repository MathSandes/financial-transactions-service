# Financial Transactions API

API simples para registrar transações financeiras (Fastify + TypeScript + Prisma + Postgres).

Principais pontos:

- Modelagem em centavos (amountCents: BigInt)
- Idempotency via header `Idempotency-Key`
- Separação controller → service → repository
- Testes unitários e de integração (Vitest + Supertest)

Pré-requisitos:

- Node.js >= 18
- Docker Desktop (ou outro Docker)
- Git

Badge de CI (após push para GitHub):

![CI](https://github.com/YOUR_USERNAME/financial-transactions-api/actions/workflows/ci.yml/badge.svg)

Setup rápido:

1. Copie .env.example para .env e ajuste se necessário
2. Suba o Postgres: `npm run docker:up`
3. Instale dependências: `npm install`
4. Gere cliente Prisma: `npx prisma generate`
5. Rode migration: `npx prisma migrate dev --name init`
6. Rode em dev: `npm run dev`

Seed (opcional):

1. Rode `npm run seed` para popular dados de exemplo.

Exemplos (curl / PowerShell):

- Criar transação (curl):
  curl.exe -X POST "http://localhost:3000/transactions" -H "Content-Type: application/json" -H "Idempotency-Key: key123" -d "{\"amountCents\":1000,\"type\":\"CREDIT\",\"description\":\"Teste\"}"

- Criar transação (PowerShell):
  $body = @{ amountCents = 1000; type = \"CREDIT\"; description = \"Teste\" } | ConvertTo-Json
  Invoke-RestMethod -Method Post -Uri \"http://localhost:3000/transactions\" -Headers @{ \"Idempotency-Key\"=\"key123\"; \"Content-Type\"=\"application/json\" } -Body $body

- Listar transações:
  curl.exe http://localhost:3000/transactions

- Balance:
  curl.exe http://localhost:3000/transactions/balance

Endpoints:

- POST /transactions
- GET /transactions
- GET /transactions/balance

Observações:

- Valores são enviados em centavos (ex: R$10.50 => 1050)
- Se enviar header `Idempotency-Key`, a API garante idempotência
