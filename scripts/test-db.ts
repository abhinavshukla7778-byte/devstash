import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== DevStash DB Test ===\n");

  // 1. Connection
  await prisma.$connect();
  console.log("✓ Connected to Neon PostgreSQL\n");

  // 2. System item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log(`✓ System item types (${itemTypes.length}):`);
  for (const t of itemTypes) {
    console.log(`  • ${t.name.padEnd(10)} icon: ${t.icon?.padEnd(12)} color: ${t.color}`);
  }

  // 3. Demo user
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  });
  if (!user) throw new Error("Demo user not found");
  console.log(`\n✓ Demo user: ${user.name} <${user.email}> | isPro: ${user.isPro} | verified: ${user.emailVerified?.toISOString().split("T")[0]}`);

  // 4. Collections with items via join table
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: {
      items: {
        include: {
          item: {
            include: { type: true },
          },
        },
      },
    },
  });

  console.log(`\n✓ Collections (${collections.length}):`);
  for (const col of collections) {
    console.log(`\n  [${col.name}] — ${col.description}`);
    for (const ci of col.items) {
      const { item } = ci;
      const meta = [
        `type: ${item.type.name}`,
        item.language ? `lang: ${item.language}` : null,
        item.url ? `url: ${item.url}` : null,
        item.isFavorite ? "⭐ favorite" : null,
        item.isPinned ? "📌 pinned" : null,
      ]
        .filter(Boolean)
        .join(" | ");
      console.log(`    • ${item.title} (${meta})`);
    }
  }

  // 5. Row counts
  const [userCount, itemCount, collectionCount, collectionItemCount] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.collection.count(),
    prisma.collectionItem.count(),
  ]);

  console.log("\n✓ Row counts:");
  console.log(`  • Users:           ${userCount}`);
  console.log(`  • Items:           ${itemCount}`);
  console.log(`  • Collections:     ${collectionCount}`);
  console.log(`  • CollectionItems: ${collectionItemCount}`);
  console.log(`  • Item types:      ${itemTypes.length}`);

  console.log("\nAll checks passed.");
}

main()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
