import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  // 1. Connection check
  await prisma.$connect();
  console.log("✓ Connected to Neon PostgreSQL\n");

  // 2. Verify system item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });

  console.log(`✓ System item types (${itemTypes.length} found):`);
  for (const t of itemTypes) {
    console.log(`  • ${t.name} — icon: ${t.icon}, color: ${t.color}`);
  }

  // 3. Count all tables
  const [users, items, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);

  console.log("\n✓ Table row counts:");
  console.log(`  • Users:       ${users}`);
  console.log(`  • Items:       ${items}`);
  console.log(`  • Collections: ${collections}`);
  console.log(`  • Tags:        ${tags}`);
  console.log(`  • Item types:  ${itemTypes.length}`);

  console.log("\nAll checks passed.");
}

main()
  .catch((e) => {
    console.error("Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
