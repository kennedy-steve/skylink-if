-- CreateTable
CREATE TABLE "User" (
    "discordUserID" TEXT NOT NULL PRIMARY KEY,
    "infiniteFlightUserID" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_infiniteFlightUserID_key" ON "User"("infiniteFlightUserID");
