export function serializeTransaction(record: any) {
  return {
    ...record,
    amountCents:
      record.amountCents && typeof record.amountCents !== "string"
        ? record.amountCents.toString()
        : record.amountCents,
  };
}

export function serializeTransactionsList(list: any[]) {
  return list.map(serializeTransaction);
}

export function serializeBalanceObject(bal: any) {
  return {
    balanceCents:
      bal.balanceCents && typeof bal.balanceCents !== "string"
        ? bal.balanceCents.toString()
        : bal.balanceCents,
    totalCreditsCents:
      bal.totalCreditsCents && typeof bal.totalCreditsCents !== "string"
        ? bal.totalCreditsCents.toString()
        : bal.totalCreditsCents,
    totalDebitsCents:
      bal.totalDebitsCents && typeof bal.totalDebitsCents !== "string"
        ? bal.totalDebitsCents.toString()
        : bal.totalDebitsCents,
  };
}
