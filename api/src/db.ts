import { PrismaClient } from "@prisma/client"; // The generated prisma items should be in node modules under the client automatically for usage

export const prisma = new PrismaClient();

process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);    
})