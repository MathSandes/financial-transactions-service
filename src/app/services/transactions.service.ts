import { TransactionsRepository } from "../repositories/transactions.repository";

export type CreateTransactionDTO = {
  amountCents: bigint;
  currency?: string;
  type: "CREDIT" | "DEBIT";
  description?: string | null;
  idempotencyKey?: string | null;
};

export const TransactionsService = {
  async create(dto: CreateTransactionDTO) {
    if (dto.amountCents <= BigInt(0)) {
      const err: any = new Error("Amount must be greater than zero");
      err.code = "VALIDATION_ERROR";
      throw err;
    }

    if (dto.idempotencyKey) {
      const existing = await TransactionsRepository.findByIdempotencyKey(
        dto.idempotencyKey,
      );
      if (existing) {
        return existing;
      }
    }

    const created = await TransactionsRepository.create(dto as any);
    return created;
  },
  async list() {
    return TransactionsRepository.findAll();
  },
  async balance() {
    const { totalCreditsCents, totalDebitsCents } =
      await TransactionsRepository.aggregateBalance();
    const balanceCents = totalCreditsCents - totalDebitsCents;
    return { balanceCents, totalCreditsCents, totalDebitsCents };
  },
};
