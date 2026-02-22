import { FastifyReply, FastifyRequest } from "fastify";
import { TransactionsService } from "../services/transactions.service";

export async function createTransactionController(request: FastifyRequest, reply: FastifyReply) {
  try {
    const body = request.body as any;
    const created = await TransactionsService.create({
      amountCents: BigInt(body.amountCents),
      type: body.type,
      description: body.description ?? null,
      currency: body.currency ?? "BRL",
      idempotencyKey: (request.headers["idempotency-key"] as string) ?? null,
    } as any);
    return reply.status(201).send(created);
  } catch (err: any) {
    return reply.status(500).send({ code: "INTERNAL_ERROR", message: err.message ?? "Internal error" });
  }
}
