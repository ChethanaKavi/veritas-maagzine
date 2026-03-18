/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `Magazine` table. All the data in the column will be lost.
  - You are about to drop the column `issueNumber` on the `Magazine` table. All the data in the column will be lost.
  - Added the required column `coverImage` to the `Magazine` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `Magazine` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Magazine" DROP COLUMN "coverImageUrl",
DROP COLUMN "issueNumber",
ADD COLUMN     "coverImage" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
