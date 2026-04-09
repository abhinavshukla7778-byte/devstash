import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SYSTEM_ITEM_TYPES = [
  { name: "Snippet", icon: "code-2", color: "#3B82F6" },
  { name: "Prompt", icon: "sparkles", color: "#8B5CF6" },
  { name: "Note", icon: "notebook-pen", color: "#F59E0B" },
  { name: "Command", icon: "terminal", color: "#10B981" },
  { name: "File", icon: "file", color: "#6B7280" },
  { name: "Image", icon: "image", color: "#EC4899" },
  { name: "URL", icon: "link", color: "#06B6D4" },
];

async function main() {
  console.log("Seeding system item types...");

  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { name: type.name, isSystem: true },
    });

    if (existing) {
      console.log(`  – ${type.name} (already exists, skipping)`);
      continue;
    }

    await prisma.itemType.create({
      data: { ...type, isSystem: true },
    });
    console.log(`  ✓ ${type.name}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
