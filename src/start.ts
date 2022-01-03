import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/rest/v9';
import { Options } from 'discord.js';

import { Bot } from './bot';
import {
    AdminRegisterMeCommand,
    Command,
    DevCommand,
    DisableNotificationsCommand,
    EnableNotificationsCommand,
    GetPilotCommand,
    HelpCommand,
    InfiniteFlightStatusCommand,
    InfoCommand,
    LinkCommand,
    RegisterMeCommand,
    TestCommand,
    TranslateCommand,
} from './commands';
import { Config } from './config';
import {
    CommandHandler,
    GuildJoinHandler,
    GuildLeaveHandler,
    MessageHandler,
    ReactionHandler,
    TriggerHandler,
} from './events';
import { CustomClient } from './extensions';
import { NotifyActiveInfiniteFlightUsersJob } from './jobs';
import { JobService, Logger } from './services';

let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    let client = new CustomClient({
        intents: Config.client.INTENTS,
        partials: Config.client.PARTIALS,
        makeCache: Options.cacheWithLimits({
            // Keep default caching behavior
            ...Options.defaultMakeCacheSettings,
            // Override specific options from config
            ...Config.client.CACHES,
        }),
    });

    // Commands
    let commands: Command[] = [
        new DevCommand(),
        new HelpCommand(),
        new InfoCommand(),
        new LinkCommand(),
        new TestCommand(),
        new TranslateCommand(),
        new GetPilotCommand(),
        new RegisterMeCommand(),
        new InfiniteFlightStatusCommand(),
        new AdminRegisterMeCommand(),
        new DisableNotificationsCommand(),
        new EnableNotificationsCommand,
    ].sort((a, b) => (a.data.name > b.data.name ? 1 : -1));

    // Event handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let commandHandler = new CommandHandler(commands);
    let triggerHandler = new TriggerHandler([]);
    let messageHandler = new MessageHandler(triggerHandler);
    let reactionHandler = new ReactionHandler([]);
    let jobService = new JobService([
        new NotifyActiveInfiniteFlightUsersJob(client),
    ]);

    let bot = new Bot(
        Config.client.TOKEN,
        client,
        guildJoinHandler,
        guildLeaveHandler,
        messageHandler,
        commandHandler,
        reactionHandler,
        jobService,
    );

    if (process.argv[2] === '--register') {
        await registerCommands(commands);
        process.exit();
    }

    await bot.start();
}

async function registerCommands(commands: Command[]): Promise<void> {
    let cmdDatas = commands.map(cmd => cmd.data);
    let cmdNames = cmdDatas.map(cmdData => cmdData.name);

    Logger.info(
        Logs.info.commandsRegistering.replaceAll(
            '{COMMAND_NAMES}',
            cmdNames.map(cmdName => `'${cmdName}'`).join(', ')
        )
    );

    try {
        let rest = new REST({ version: '9' }).setToken(Config.client.TOKEN);
        // await rest.put(Routes.applicationCommands(Config.client.id), { body: [] });
        // await rest.put(Routes.applicationCommands(Config.client.id), { body: cmdDatas });
        await rest.put(Routes.applicationGuildCommands(Config.client.ID, '910003714885042207'), { body: cmdDatas })
    } catch (error) {
        Logger.error(Logs.error.commandsRegistering, error);
        return;
    }

    Logger.info(Logs.info.commandsRegistered);
}

process.on('unhandledRejection', (reason, promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
