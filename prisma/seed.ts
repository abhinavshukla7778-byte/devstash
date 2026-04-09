import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ─── System Item Types ────────────────────────────────────────────────────────

const SYSTEM_ITEM_TYPES = [
  { name: "snippet", icon: "Code", color: "#3b82f6" },
  { name: "prompt", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", icon: "Terminal", color: "#f97316" },
  { name: "note", icon: "StickyNote", color: "#fde047" },
  { name: "file", icon: "File", color: "#6b7280" },
  { name: "image", icon: "Image", color: "#ec4899" },
  { name: "link", icon: "Link", color: "#10b981" },
];

// ─── Seed Data ────────────────────────────────────────────────────────────────

const COLLECTIONS: {
  name: string;
  description: string;
  items: {
    title: string;
    typeName: string;
    contentType: "text" | "file";
    content?: string;
    url?: string;
    description?: string;
    language?: string;
    isFavorite?: boolean;
    isPinned?: boolean;
  }[];
}[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        title: "useDebounce Hook",
        typeName: "snippet",
        contentType: "text",
        language: "typescript",
        isFavorite: true,
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage:
// const debouncedSearch = useDebounce(searchTerm, 400);`,
      },
      {
        title: "useLocalStorage Hook",
        typeName: "snippet",
        contentType: "text",
        language: "typescript",
        content: `import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }
  };

  return [storedValue, setValue] as const;
}`,
      },
      {
        title: "Compound Component Pattern",
        typeName: "snippet",
        contentType: "text",
        language: "typescript",
        isPinned: true,
        content: `import { createContext, useContext, ReactNode } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used within <Tabs>");
  return ctx;
}

function Tabs({ children, defaultTab }: { children: ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

function Tab({ name, children }: { name: string; children: ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      onClick={() => setActiveTab(name)}
      data-active={activeTab === name}
    >
      {children}
    </button>
  );
}

function TabPanel({ name, children }: { name: string; children: ReactNode }) {
  const { activeTab } = useTabs();
  return activeTab === name ? <div>{children}</div> : null;
}

Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
export { Tabs };`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        title: "Code Review Prompt",
        typeName: "prompt",
        contentType: "text",
        isFavorite: true,
        content: `You are a senior software engineer performing a thorough code review.

Review the following code for:
- Correctness and logic errors
- Security vulnerabilities (XSS, injection, auth issues)
- Performance concerns (N+1 queries, unnecessary re-renders)
- Code clarity and naming
- Missing edge cases

Be concise. Lead with the most important issues. For each issue, suggest a specific fix.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        title: "Documentation Generator",
        typeName: "prompt",
        contentType: "text",
        content: `Generate clear, concise documentation for the following function or module.

Include:
- One-line summary
- Parameters (name, type, description)
- Return value
- Usage example
- Any important caveats or side effects

Keep it developer-friendly. Skip obvious details. Use JSDoc format.

\`\`\`
{{code}}
\`\`\``,
      },
      {
        title: "Refactoring Assistant",
        typeName: "prompt",
        contentType: "text",
        content: `You are an expert at refactoring code for readability, maintainability, and performance.

Refactor the following code. Rules:
- Do not change external behavior
- Prefer simple, readable solutions over clever ones
- Extract repeated logic into helpers
- Use modern language features where appropriate
- Keep functions under 40 lines

Explain each significant change in a short bullet list after the code.

\`\`\`
{{code}}
\`\`\``,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        title: "Docker Compose — Next.js + Postgres",
        typeName: "snippet",
        contentType: "text",
        language: "yaml",
        content: `version: "3.9"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/devstash
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: devstash
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:`,
      },
      {
        title: "Deploy to Vercel (CLI)",
        typeName: "command",
        contentType: "text",
        content: `# Production deploy
vercel --prod

# Preview deploy
vercel

# Set env variable
vercel env add DATABASE_URL production

# Pull env variables locally
vercel env pull .env.local`,
      },
      {
        title: "Prisma Docs",
        typeName: "link",
        contentType: "text",
        url: "https://www.prisma.io/docs",
        description: "Official Prisma ORM documentation",
      },
      {
        title: "GitHub Actions Docs",
        typeName: "link",
        contentType: "text",
        url: "https://docs.github.com/en/actions",
        description: "CI/CD with GitHub Actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        title: "Git — Useful Operations",
        typeName: "command",
        contentType: "text",
        isFavorite: true,
        content: `# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Stash with a message
git stash push -m "wip: feature description"

# Pretty log
git log --oneline --graph --decorate --all

# Find which commit introduced a string
git log -S "searchTerm" --source --all

# Rebase interactively (last 5 commits)
git rebase -i HEAD~5`,
      },
      {
        title: "Docker — Container Management",
        typeName: "command",
        contentType: "text",
        content: `# Remove all stopped containers
docker container prune -f

# Remove all unused images
docker image prune -a -f

# Show running containers with resource usage
docker stats --no-stream

# Exec into running container
docker exec -it <container_name> sh

# View container logs (last 100 lines, follow)
docker logs --tail=100 -f <container_name>`,
      },
      {
        title: "Process Management",
        typeName: "command",
        contentType: "text",
        content: `# Find process using a port
lsof -i :3000

# Kill process on a port
kill -9 $(lsof -t -i:3000)

# Show top processes by memory
ps aux --sort=-%mem | head -10

# Background a running process
# Press Ctrl+Z then:
bg %1

# List background jobs
jobs -l`,
      },
      {
        title: "npm / pnpm Utilities",
        typeName: "command",
        contentType: "text",
        content: `# List outdated packages
npm outdated

# Check what's using disk in node_modules
du -sh node_modules/* | sort -rh | head -20

# Delete all node_modules recursively (monorepos)
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Audit and auto-fix vulnerabilities
npm audit fix

# Check package for side effects / tree shaking
npx package-size <package-name>`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        title: "Tailwind CSS Docs",
        typeName: "link",
        contentType: "text",
        url: "https://tailwindcss.com/docs",
        description: "Official Tailwind CSS documentation and utility reference",
        isFavorite: true,
      },
      {
        title: "shadcn/ui Components",
        typeName: "link",
        contentType: "text",
        url: "https://ui.shadcn.com/docs/components",
        description: "Accessible, composable React components built with Radix + Tailwind",
      },
      {
        title: "Radix UI Primitives",
        typeName: "link",
        contentType: "text",
        url: "https://www.radix-ui.com/primitives/docs/overview/introduction",
        description: "Unstyled, accessible UI primitives for React",
      },
      {
        title: "Lucide Icons",
        typeName: "link",
        contentType: "text",
        url: "https://lucide.dev/icons",
        description: "Open-source icon library used throughout the app",
      },
    ],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding database...\n");

  // 1. System item types
  console.log("→ Upserting system item types...");
  const typeMap: Record<string, string> = {};

  for (const t of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { name: t.name, isSystem: true },
    });

    if (existing) {
      await prisma.itemType.update({
        where: { id: existing.id },
        data: { icon: t.icon, color: t.color },
      });
      typeMap[t.name] = existing.id;
      console.log(`  • ${t.name} (updated)`);
    } else {
      const created = await prisma.itemType.create({
        data: { ...t, isSystem: true },
      });
      typeMap[t.name] = created.id;
      console.log(`  • ${t.name} (created)`);
    }
  }

  // 2. Demo user
  console.log("\n→ Creating demo user...");
  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`  • ${user.email}`);

  // 3. Collections & items
  console.log("\n→ Seeding collections and items...");

  for (const col of COLLECTIONS) {
    const existingCollection = await prisma.collection.findFirst({
      where: { name: col.name, userId: user.id },
    });

    const collection = existingCollection ?? await prisma.collection.create({
      data: {
        name: col.name,
        description: col.description,
        userId: user.id,
      },
    });

    for (const item of col.items) {
      const typeId = typeMap[item.typeName];
      if (!typeId) {
        console.warn(`  ⚠ Unknown type "${item.typeName}", skipping`);
        continue;
      }

      let existingItem = await prisma.item.findFirst({
        where: { title: item.title, userId: user.id },
      });

      if (!existingItem) {
        existingItem = await prisma.item.create({
          data: {
            title: item.title,
            contentType: item.contentType,
            content: item.content,
            url: item.url,
            description: item.description,
            language: item.language,
            isFavorite: item.isFavorite ?? false,
            isPinned: item.isPinned ?? false,
            userId: user.id,
            typeId,
          },
        });
      }

      // Link item to collection via join table
      await prisma.collectionItem.upsert({
        where: {
          collectionId_itemId: {
            collectionId: collection.id,
            itemId: existingItem.id,
          },
        },
        update: {},
        create: {
          collectionId: collection.id,
          itemId: existingItem.id,
        },
      });
    }

    console.log(`  • ${col.name} (${col.items.length} items)`);
  }

  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
