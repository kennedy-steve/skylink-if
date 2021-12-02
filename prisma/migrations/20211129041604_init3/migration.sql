/*
  Warnings:

  - You are about to drop the `activeControllerNotifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `activePilotNotifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "activeControllerNotifications";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "activePilotNotifications";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ActivePilotNotifications" (
    "discordChannelID" TEXT NOT NULL PRIMARY KEY,
    "discordServerID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ActiveControllerNotifications" (
    "discordChannelID" TEXT NOT NULL PRIMARY KEY,
    "discordServerID" TEXT NOT NULL
);
