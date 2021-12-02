-- CreateTable
CREATE TABLE "activePilotNotifications" (
    "discordChannelID" TEXT NOT NULL PRIMARY KEY,
    "discordServerID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "activeControllerNotifications" (
    "discordChannelID" TEXT NOT NULL PRIMARY KEY,
    "discordServerID" TEXT NOT NULL
);
