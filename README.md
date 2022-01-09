# [Skylink IF](https://skylink-if.tisuela.com/)

[![CodeFactor](https://www.codefactor.io/repository/github/kennedy-steve/skylink-if/badge)](https://www.codefactor.io/repository/github/kennedy-steve/skylink-if)

Brining Infinite Flight to Discord. Check out our [website](https://skylink-if.tisuela.com/). Also, I want to give credit to [velocity23](https://github.com/velocity23) for his [Infinite Flight API Typescript library](https://github.com/velocity23/if-discord-bot/tree/master/src/lib/iflive) and [Kevin Novak](https://github.com/KevinNovak) for providing the [Discord Bot Typescript Template](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template).


## Setup

1. Copy example config files.
    - Navigate to the `config` folder of this project.
    - Copy all files ending in `.example.json` and remove the `.example` from the copied file names.
        - Ex: `config.example.json` should be copied and renamed as `config.json`.
2. Obtain a bot token.
    - You'll need to create a new bot in your [Discord Developer Portal](https://discord.com/developers/applications/).
        - See [here](https://www.writebots.com/discord-bot-token/) for detailed instructions.
        - At the end you should have a **bot token**.
3. Modify the config file.
    - Open the `config/config.json` file.
    - You'll need to edit the following values:
        - `client.id` - Your discord bot's [user ID](https://techswift.org/2020/04/22/how-to-find-your-user-id-on-discord/).
        - `client.token` - Your discord bot's token.
4. Install packages.
    - Navigate into the downloaded source files and type `npm install`.
5. Register commands.
    - In order to use slash commands, they first [have to be registered](https://discordjs.guide/interactions/registering-slash-commands.html#registering-slash-commands).
    - Type `npm run register` to register the bot's commands.
        - Run this script any time you change a command name, structure, or add/remove commands.
        - This is so Discord knows what your commands look like.
        - It may take up to an hour for command changes to appear.

## Start Scripts

1. Normal Mode
    - Type `npm start`.
    - This runs the bot directly with Node and without shards.
    - Use this mode if you don't need sharding.
2. Dev Mode
    - Type `npm start:dev`.
    - This runs the bot with [ts-node-dev](https://www.npmjs.com/package/ts-node-dev).
    - Use this mode for general development.
    - TypeScript files are compiled automatically as they are changed.

## Huge Shoutout -- Bot Template

Shoutout to [Kevin](https://github.com/KevinNovak) for creating [a Typescript Discord Bot Template](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template) which is the foundation of Skylink-IF. Highly encourage y'all to [check out that template](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template)!

