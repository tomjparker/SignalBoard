import { PrismaClient } from "@prisma/client"; // The generated prisma items should be in node modules under the client automatically for usage

export const prisma =
  new PrismaClient({ log: process.env.NODE_ENV === 'production' ? ['error'] : ['error','warn'] });

export type { Prisma } from '@prisma/client';

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);    
})