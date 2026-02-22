# Financial Transactions Service

API backend simples para registrar transações financeiras — construída com Node.js, Fastify e TypeScript. Projeto pensado para portfólio: demonstra modelagem financeira segura, arquitetura em camadas, testes automatizados e CI.

![CI](https://github.com/MathSandes/financial-transactions-service/actions/workflows/ci.yml/badge.svg) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Stack
- Node.js + TypeScript  
- Fastify  
- Prisma + PostgreSQL (rodando em Docker)  
- Vitest + Supertest (testes)  
- Pino (logger)

## Principais conceitos demonstrados
- Arquitetura limpa: controller → service → repository  
- Modelagem financeira: valores armazenados em centavos (`amountCents: BigInt`)  
- Idempotência: header opcional `Idempotency-Key` (persistido para evitar duplicidade)  
- Testes unitários e de integração  
- CI configurado (GitHub Actions) que roda migrations e testes

## Badges / Release
- Release: https://github.com/MathSandes/financial-transactions-service/releases/tag/v0.1.0

## Requisitos
- Node.js >= 18  
- Docker Desktop (ou outro Docker)  
- Git

## Setup rápido (desenvolvimento)
1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```
2. Suba o Postgres + Adminer:
```bash
npm run docker:up
# ou
docker compose up -d
```
3. Instale dependências:
```bash
npm install
```
4. Gere o cliente Prisma e rode migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```
5. (Opcional) Popule dados de exemplo:
```bash
npm run seed
```
6. Rode em modo dev:
```bash
npm run dev
```
API: http://localhost:3000

## Endpoints principais
- POST /transactions  
  - Body: `{ "amountCents": 1050, "type": "CREDIT"|"DEBIT", "description"?: "texto" }`  
  - Header opcional: `Idempotency-Key: <string>`
- GET /transactions  
- GET /transactions/balance  
  - Retorna `{ "balanceCents": "...", "totalCreditsCents": "...", "totalDebitsCents": "..." }` (valores como string)

## Exemplos de uso

- curl (Linux / WSL / macOS)
```bash
curl -X POST "http://localhost:3000/transactions" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: key123" \
  -d '{"amountCents":1000,"type":"CREDIT","description":"Teste"}'
```

- PowerShell (Windows)
```powershell
$body = @{ amountCents = 1000; type = "CREDIT"; description = "Teste" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/transactions" -Headers @{ "Idempotency-Key"="key123"; "Content-Type"="application/json" } -Body $body
```

- Listar transações:
```bash
curl http://localhost:3000/transactions
```

- Obter balanço:
```bash
curl http://localhost:3000/transactions/balance
```

## Testes
- Rodar todos os testes:
```bash
npm test
```
- Unit tests: `tests/unit`  
- Integration tests: `tests/integration` (dependem do Postgres em execução via Docker)

## Notas técnicas / decisões
- Armazenar valores como inteiros em centavos elimina problemas de precisão de ponto flutuante e é uma prática comum em sistemas financeiros.  
- `Idempotency-Key` evita duplicidade em retries; a chave é persistida como campo único.  
- Prisma retorna `BigInt` para `amountCents`; a API serializa esses valores como string nas respostas JSON para compatibilidade.

## CI / Deploy
- Workflow em `.github/workflows/ci.yml` executa: install, prisma generate, prisma migrate deploy e testes.  
- Para produção, configure variáveis de ambiente seguras e use `docker-compose.prod.yml` (ou outro provider: Render/Heroku/Railway).

## Contribuir
- Abra uma issue com proposta ou bug.  
- Fork → branch de feature → PR.  
- Respeite o padrão de commits (mensagens claras) e adicione testes para mudanças de lógica.

## Licença
MIT — ver arquivo `LICENSE`.

---
