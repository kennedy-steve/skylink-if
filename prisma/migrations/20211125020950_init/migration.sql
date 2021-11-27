-- CreateTable
CREATE TABLE "User" (
    "discordUserID" TEXT NOT NULL PRIMARY KEY,
    "infiniteFlightUserID" TEXT,
    "currentlyActiveOnFlight" BOOLEAN NOT NULL DEFAULT false,
    "currentlyActiveOnATC" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "VerifyInfiniteFlightUserIDTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "verifiedByFlightEntryID" TEXT,
    "infiniteFlightUserID" TEXT NOT NULL,
    "discordUserID" TEXT NOT NULL,
    "discordGuildID" TEXT NOT NULL,
    "aircraftID" TEXT NOT NULL,
    "aircraftName" TEXT NOT NULL,
    "liveryID" TEXT NOT NULL,
    "liveryName" TEXT NOT NULL,
    "heading" REAL NOT NULL,
    CONSTRAINT "VerifyInfiniteFlightUserIDTicket_discordUserID_fkey" FOREIGN KEY ("discordUserID") REFERENCES "User" ("discordUserID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_infiniteFlightUserID_key" ON "User"("infiniteFlightUserID");
