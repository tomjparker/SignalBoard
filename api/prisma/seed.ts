import { prisma } from "../src/db.js";

async function main() {
  const board = await prisma.board.upsert({
    where: { slug: "demo-board" },
    update: {},
    create: {
      name: "Demo Board",
      slug: "demo-board",
      issues: {
        create: [
          { title: "Fix login bug", status: "open", priority: 1 },
          { title: "Add dark mode", status: "in_progress", priority: 2 },
        ],
      },
    },
  });

  console.log("✅ Seeded board:", board.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
