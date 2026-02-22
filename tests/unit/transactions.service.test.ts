import { describe, it, expect, vi, beforeEach } from "vitest";

// mock the repository module
vi.mock("../../src/app/repositories/transactions.repository", () => {
  return {
    TransactionsRepository: {
      create: vi.fn(),
      findByIdempotencyKey: vi.fn(),
      aggregateBalance: vi.fn(),
      findAll: vi.fn(),
    },
  };
});

import { TransactionsService } from "../../src/app/services/transactions.service";
import { TransactionsRepository } from "../../src/app/repositories/transactions.repository";

describe("TransactionsService (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws validation error when amountCents <= 0", async () => {
    await expect(
      TransactionsService.create({
        amountCents: BigInt(0),
        type: "CREDIT",
      } as any),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
  });

  it("returns existing transaction when idempotency key exists", async () => {
    const existing = { id: "tx1", amountCents: BigInt(1000) };
    (TransactionsRepository.findByIdempotencyKey as any).mockResolvedValue(
      existing,
    );

    const res = await TransactionsService.create({
      amountCents: BigInt(1000),
      type: "CREDIT",
      idempotencyKey: "key-1",
    } as any);

    expect(TransactionsRepository.findByIdempotencyKey).toHaveBeenCalledWith(
      "key-1",
    );
    expect(res).toBe(existing);
  });

  it("creates a new transaction when no idempotency key exists", async () => {
    (TransactionsRepository.findByIdempotencyKey as any).mockResolvedValue(
      null,
    );
    const created = { id: "tx2", amountCents: BigInt(2000) };
    (TransactionsRepository.create as any).mockResolvedValue(created);

    const res = await TransactionsService.create({
      amountCents: BigInt(2000),
      type: "DEBIT",
    } as any);

    expect(TransactionsRepository.create).toHaveBeenCalled();
    expect(res).toBe(created);
  });

  it("calculates balance correctly", async () => {
    (TransactionsRepository.aggregateBalance as any).mockResolvedValue({
      totalCreditsCents: BigInt(5000),
      totalDebitsCents: BigInt(2000),
    });

    const res = await TransactionsService.balance();
    expect(res.balanceCents).toBe(BigInt(3000));
    expect(res.totalCreditsCents).toBe(BigInt(5000));
    expect(res.totalDebitsCents).toBe(BigInt(2000));
  });
});
