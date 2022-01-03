-- CreateTable
CREATE TABLE "User" (
    "discordUserId" TEXT NOT NULL,
    "infiniteFlightUserId" TEXT,
    "currentlyActiveAsPilot" BOOLEAN NOT NULL DEFAULT false,
    "currentlyActiveAsController" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("discordUserId")
);

-- CreateTable
CREATE TABLE "VerifyInfiniteFlightUserIdTicket" (
    "id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
    "heading" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "VerifyInfiniteFlightUserIdTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivePilotNotificationsChannel" (
    "discordChannelId" TEXT NOT NULL,
    "discordGuildId" TEXT NOT NULL,

    CONSTRAINT "ActivePilotNotificationsChannel_pkey" PRIMARY KEY ("discordChannelId")
);

-- CreateTable
CREATE TABLE "ActiveControllerNotificationsChannel" (
    "discordChannelId" TEXT NOT NULL,
    "discordGuildId" TEXT NOT NULL,

    CONSTRAINT "ActiveControllerNotificationsChannel_pkey" PRIMARY KEY ("discordChannelId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_infiniteFlightUserId_key" ON "User"("infiniteFlightUserId");

-- AddForeignKey
ALTER TABLE "VerifyInfiniteFlightUserIdTicket" ADD CONSTRAINT "VerifyInfiniteFlightUserIdTicket_discordUserId_fkey" FOREIGN KEY ("discordUserId") REFERENCES "User"("discordUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
