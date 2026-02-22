const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");
  await prisma.transaction.createMany({
    data: [
      {
        id: "seed-credit-1",
        amountCents: 10000,
        currency: "BRL",
        type: "CREDIT",
        description: "Seed credit",
        idempotencyKey: "seed-credit-1",
      },
      {
        id: "seed-debit-1",
        amountCents: 2500,
        currency: "BRL",
        type: "DEBIT",
        description: "Seed debit",
        idempotencyKey: "seed-debit-1",
      },
    ],
    skipDuplicates: true,
  });
  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
