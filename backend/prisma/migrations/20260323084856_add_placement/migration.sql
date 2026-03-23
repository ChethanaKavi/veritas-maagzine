/*
  Warnings:

  - You are about to drop the column `clickCount` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `impressionCount` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `mediaType` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Advertisement` table. All the data in the column will be lost.
  - You are about to drop the `AdPlacement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `topic` to the `Advertisement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Advertisement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdPlacement" DROP CONSTRAINT "AdPlacement_adId_fkey";

-- DropForeignKey
ALTER TABLE "AdPlacement" DROP CONSTRAINT "AdPlacement_articleId_fkey";

-- DropForeignKey
ALTER TABLE "AdPlacement" DROP CONSTRAINT "AdPlacement_magazineId_fkey";

-- AlterTable
ALTER TABLE "Advertisement" DROP COLUMN "clickCount",
DROP COLUMN "endDate",
DROP COLUMN "impressionCount",
DROP COLUMN "isActive",
DROP COLUMN "mediaType",
DROP COLUMN "mediaUrl",
DROP COLUMN "position",
DROP COLUMN "startDate",
DROP COLUMN "title",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "mobileImageWidth" INTEGER,
ADD COLUMN     "tabImageWidth" INTEGER,
ADD COLUMN     "topic" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "webImageWidth" INTEGER;

-- DropTable
DROP TABLE "AdPlacement";

-- CreateTable
CREATE TABLE "Placement" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Placement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Placement_value_key" ON "Placement"("value");
