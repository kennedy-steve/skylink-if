/*
  Warnings:

  - You are about to drop the `ActiveControllerNotifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ActivePilotNotifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ActiveControllerNotifications";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ActivePilotNotifications";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ActivePilotNotificationsChannel" (
    "discordChannelID" TEXT NOT NULL PRIMARY KEY,
    "discordServerID" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ActiveControllerNotificationsChannel" (
    "discordChannelID" TEXT NOT NULL PRIMARY KEY,
    "discordServerID" TEXT NOT NULL
);
