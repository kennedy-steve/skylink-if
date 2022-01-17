import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Options } from 'discord.js';
import { createRequire } from 'node:module';

import { Bot } from './bot.js';
import { Button } from './buttons/index.js';
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
} from './commands/index.js';
import { Config } from './config.js';
import {
    ButtonHandler,
    CommandHandler,
    GuildJoinHandler,
    GuildLeaveHandler,
    MessageHandler,
    ReactionHandler,
    TriggerHandler,
} from './events/index.js';
import { CustomClient } from './extensions/index.js';
import { NotifyActiveInfiniteFlightUsersJob, Job } from './jobs/index.js';
import { Reaction } from './reactions/index.js';
import { JobService, Logger } from './services/index.js';
import { Trigger } from './triggers/index.js';

const require = createRequire(import.meta.url);
let Logs = require('../lang/logs.json');

async function start(): Promise<void> {
    // Client
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
        new GetPilotCommand(),
        new RegisterMeCommand(),
        new InfiniteFlightStatusCommand(),
        new AdminRegisterMeCommand(),
        new DisableNotificationsCommand(),
        new EnableNotificationsCommand,
    ].sort((a, b) => (a.metadata.name > b.metadata.name ? 1 : -1));

    // Buttons
    let buttons: Button[] = [
        // TODO: Add new buttons here
    ];

    // Reactions
    let reactions: Reaction[] = [
        // TODO: Add new reactions here
    ];

    // Triggers
    let triggers: Trigger[] = [
        // TODO: Add new triggers here
    ];

    let jobs: Job[] = [
        new NotifyActiveInfiniteFlightUsersJob(client),
    ]

    // Event handlers
    let guildJoinHandler = new GuildJoinHandler();
    let guildLeaveHandler = new GuildLeaveHandler();
    let commandHandler = new CommandHandler(commands);
    let buttonHandler = new ButtonHandler(buttons);
    let triggerHandler = new TriggerHandler(triggers);
    let messageHandler = new MessageHandler(triggerHandler);
    let reactionHandler = new ReactionHandler(reactions);
    let jobService = new JobService([
        new NotifyActiveInfiniteFlightUsersJob(client),
    ]);

    // Bot
    let bot = new Bot(
        Config.client.TOKEN,
        client,
        guildJoinHandler,
        guildLeaveHandler,
        messageHandler,
        commandHandler,
        buttonHandler,
        reactionHandler,
        new JobService(jobs)
    );

    // Register
    if (process.argv[2] === '--register') {
        await registerCommands(commands);
        process.exit();
    }

    await bot.start();
}

async function registerCommands(commands: Command[]): Promise<void> {
    let cmdDatas = commands.map(cmd => cmd.metadata);
    let cmdNames = cmdDatas.map(cmdData => cmdData.name);

    Logger.info(
        Logs.info.commandsRegistering.replaceAll(
            '{COMMAND_NAMES}',
            cmdNames.map(cmdName => `'${cmdName}'`).join(', ')
        )
    );

    try {
        let rest = new REST({ version: '9' }).setToken(Config.client.TOKEN);
        await rest.put(Routes.applicationCommands(Config.client.ID), { body: [] });
        await rest.put(Routes.applicationCommands(Config.client.ID), { body: cmdDatas });
        //await rest.put(Routes.applicationGuildCommands(Config.client.ID, '910003714885042207'), { body: cmdDatas })
    } catch (error) {
        Logger.error(Logs.error.commandsRegistering, error);
        return;
    }

    Logger.info(Logs.info.commandsRegistered);
}

process.on('unhandledRejection', (reason, _promise) => {
    Logger.error(Logs.error.unhandledRejection, reason);
});

start().catch(error => {
    Logger.error(Logs.error.unspecified, error);
});
