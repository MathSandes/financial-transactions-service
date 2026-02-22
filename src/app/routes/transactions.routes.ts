import { FastifyInstance } from "fastify";
import { z } from "zod";
import { TransactionsService } from "../services/transactions.service";
import {
  serializeTransaction,
  serializeTransactionsList,
  serializeBalanceObject,
} from "../utils/serialize";

export async function transactionsRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    const bodySchema = z.object({
      amountCents: z.coerce.bigint(),
      currency: z.string().optional(),
      type: z.enum(["CREDIT", "DEBIT"]),
      description: z.string().optional(),
    });

    const parsed = bodySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        code: "VALIDATION_ERROR",
        message: parsed.error.errors.map((e) => e.message).join(", "),
      });
    }

    const idempotencyKey = request.headers["idempotency-key"] as
      | string
      | undefined;

    try {
      const created = await TransactionsService.create({
        ...parsed.data,
        idempotencyKey: idempotencyKey ?? null,
      } as any);

      // Convert BigInt fields to string for safe JSON serialization
      return reply.status(201).send(serializeTransaction(created));
    } catch (err: any) {
      if (err.code === "VALIDATION_ERROR") {
        return reply
          .status(400)
          .send({ code: "VALIDATION_ERROR", message: err.message });
      }
      return reply
        .status(500)
        .send({ code: "INTERNAL_ERROR", message: "Internal server error" });
    }
  });

  app.get("/", async (_request, reply) => {
    const list = await TransactionsService.list();
    return reply.send(serializeTransactionsList(list));
  });

  app.get("/balance", async (_request, reply) => {
    const bal = await TransactionsService.balance();
    return reply.send(serializeBalanceObject(bal));
  });
}
