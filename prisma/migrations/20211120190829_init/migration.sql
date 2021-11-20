-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discordUserID" TEXT NOT NULL,
    "infiniteFlightUserID" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordUserID_key" ON "User"("discordUserID");

-- CreateIndex
CREATE UNIQUE INDEX "User_infiniteFlightUserID_key" ON "User"("infiniteFlightUserID");
