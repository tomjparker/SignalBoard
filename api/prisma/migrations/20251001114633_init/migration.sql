-- CreateEnum
CREATE TYPE "public"."IssueStatus" AS ENUM ('open', 'in_progress', 'done');

-- CreateTable
CREATE TABLE "public"."Board" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Board_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Issue" (
    "id" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."IssueStatus" NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_slug_key" ON "public"."Board"("slug");

-- CreateIndex
CREATE INDEX "Board_createdAt_idx" ON "public"."Board"("createdAt");

-- CreateIndex
CREATE INDEX "Issue_boardId_createdAt_idx" ON "public"."Issue"("boardId", "createdAt");

-- CreateIndex
CREATE INDEX "Issue_status_idx" ON "public"."Issue"("status");

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "public"."Board"("id") ON DELETE CASCADE ON UPDATE CASCADE;
