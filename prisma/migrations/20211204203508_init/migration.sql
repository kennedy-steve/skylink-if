-- CreateTable
CREATE TABLE "User" (
    "discordUserId" TEXT NOT NULL PRIMARY KEY,
    "infiniteFlightUserId" TEXT,
    "currentlyActiveOnFlight" BOOLEAN NOT NULL DEFAULT false,
    "currentlyActiveOnATC" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "VerifyInfiniteFlightUserIdTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "verifiedByFlightEntryId" TEXT,
    "infiniteFlightUserId" TEXT NOT NULL,
    "discordUserId" TEXT NOT NULL,
    "discordGuildId" TEXT NOT NULL,
    "aircraftId" TEXT NOT NULL,
    "aircraftName" TEXT NOT NULL,
    "liveryId" TEXT NOT NULL,
    "liveryName" TEXT NOT NULL,
    "heading" REAL NOT NULL,
    CONSTRAINT "VerifyInfiniteFlightUserIdTicket_discordUserId_fkey" FOREIGN KEY ("discordUserId") REFERENCES "User" ("discordUserId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ActivePilotNotificationsChannel" (
    "discordChannelId" TEXT NOT NULL PRIMARY KEY,
    "discordGuildId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ActiveControllerNotificationsChannel" (
    "discordChannelId" TEXT NOT NULL PRIMARY KEY,
    "discordGuildId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_infiniteFlightUserId_key" ON "User"("infiniteFlightUserId");
