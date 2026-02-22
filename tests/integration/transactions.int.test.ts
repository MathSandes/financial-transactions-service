import { describe, it, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import fastify from "fastify";
import { transactionsRoutes } from "../../src/app/routes/transactions.routes";
import cors from "@fastify/cors";
import prisma from "../../src/app/db/prisma";

let app: any;

beforeAll(async () => {
  app = fastify();
  app.register(cors, { origin: true });
  app.register(transactionsRoutes, { prefix: "/transactions" });
  await app.ready();

  // clean DB
  await prisma.transaction.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
  await app.close();
});

describe("Transactions integration", () => {
  it("creates a transaction and respects idempotency", async () => {
    const res1 = await request(app.server)
      .post("/transactions")
      .set("Idempotency-Key", "itest-key-1")
      .send({
        amountCents: 1000,
        type: "CREDIT",
        description: "integration test",
      });
    expect(res1.status).toBe(201);
    expect(res1.body).toHaveProperty("id");

    const res2 = await request(app.server)
      .post("/transactions")
      .set("Idempotency-Key", "itest-key-1")
      .send({
        amountCents: 1000,
        type: "CREDIT",
        description: "integration test",
      });
    expect(res2.status).toBe(201);
    expect(res2.body.id).toBe(res1.body.id);
  });

  it("returns correct balance", async () => {
    // create a debit and a credit
    await request(app.server)
      .post("/transactions")
      .set("Idempotency-Key", "itest-credit")
      .send({ amountCents: 5000, type: "CREDIT" });
    await request(app.server)
      .post("/transactions")
      .set("Idempotency-Key", "itest-debit")
      .send({ amountCents: 2000, type: "DEBIT" });

    const bal = await request(app.server).get("/transactions/balance");
    expect(bal.status).toBe(200);
    expect(bal.body).toHaveProperty("balanceCents");
    expect(bal.body).toHaveProperty("totalCreditsCents");
    expect(bal.body).toHaveProperty("totalDebitsCents");
  });
});
