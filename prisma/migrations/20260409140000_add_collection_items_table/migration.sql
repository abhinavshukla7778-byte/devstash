-- Drop existing index and foreign key on Item.collectionId
DROP INDEX IF EXISTS "Item_collectionId_idx";

ALTER TABLE "Item" DROP CONSTRAINT IF EXISTS "Item_collectionId_fkey";

-- Drop the collectionId column from Item
ALTER TABLE "Item" DROP COLUMN IF EXISTS "collectionId";

-- Create CollectionItem join table
CREATE TABLE "CollectionItem" (
    "collectionId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,

    CONSTRAINT "CollectionItem_pkey" PRIMARY KEY ("collectionId", "itemId")
);

-- Index on itemId for reverse lookups
CREATE INDEX "CollectionItem_itemId_idx" ON "CollectionItem"("itemId");

-- Foreign keys
ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_collectionId_fkey"
    FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CollectionItem" ADD CONSTRAINT "CollectionItem_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
