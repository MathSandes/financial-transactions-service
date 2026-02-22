import prisma from "../db/prisma";

export type CreateTransactionInput = {
  amountCents: bigint;
  currency?: string;
  type: "CREDIT" | "DEBIT";
  description?: string | null;
  idempotencyKey?: string | null;
};

export const TransactionsRepository = {
  async create(data: CreateTransactionInput) {
    return prisma.transaction.create({ data });
  },
  async findAll() {
    return prisma.transaction.findMany({ orderBy: { createdAt: "desc" } });
  },
  async findByIdempotencyKey(key: string) {
    return prisma.transaction.findUnique({ where: { idempotencyKey: key } });
  },
  async aggregateBalance() {
    const credits = await prisma.transaction.aggregate({
      where: { type: "CREDIT" },
      _sum: { amountCents: true },
    });
    const debits = await prisma.transaction.aggregate({
      where: { type: "DEBIT" },
      _sum: { amountCents: true },
    });
    return {
      totalCreditsCents: credits._sum.amountCents ?? BigInt(0),
      totalDebitsCents: debits._sum.amountCents ?? BigInt(0),
    };
  },
};
