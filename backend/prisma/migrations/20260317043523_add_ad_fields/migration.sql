-- AlterTable
ALTER TABLE "AdPlacement" ADD COLUMN     "mobileWidth" INTEGER,
ADD COLUMN     "tabWidth" INTEGER,
ADD COLUMN     "webWidth" INTEGER;

-- AlterTable
ALTER TABLE "Advertisement" ADD COLUMN     "area" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "mobileImage" TEXT,
ADD COLUMN     "tabImage" TEXT,
ADD COLUMN     "webImage" TEXT;
