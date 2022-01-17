import { Message } from 'discord.js';

import { EventHandler, TriggerHandler } from '.';

import * as infiniteFlightLive from '../lib/infinite-flight-live';

export class MessageHandler implements EventHandler {
    constructor(private triggerHandler: TriggerHandler) {}

    public async process(msg: Message): Promise<void> {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user.id) {
            return;
        }

        if (msg.mentions.has(msg.client.user.id)) {
            const userHits = await infiniteFlightLive.userStats([], [], ['N8te']);

            if (userHits.length == 0) {
                await msg.channel.send('htrgbskerjgaelrklejkgejklarb');
            } else {
                const userStats = userHits[0];
                await msg.channel.send(
                    `Nate has landed ${userStats.landingCount} times and also has ${userStats.violations} violations 💩`
                );
            }
        }

        // Process trigger
        await this.triggerHandler.process(msg);
    }
}
