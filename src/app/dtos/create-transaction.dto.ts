import { z } from "zod";

export const CreateTransactionSchema = z.object({
  amountCents: z.coerce.bigint(),
  currency: z.string().optional(),
  type: z.enum(["CREDIT", "DEBIT"]),
  description: z.string().optional(),
});

export type CreateTransactionDTO = z.infer<typeof CreateTransactionSchema>;
