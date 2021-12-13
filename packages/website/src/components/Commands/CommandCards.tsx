import React from 'react';
import Link from '@docusaurus/Link';
import styles from './CommandCards.module.css';

type CommandCardItem = {
    command: string,
    description: JSX.Element,
    admin: boolean,
    documentation: string,
}

const HelpCommand: CommandCardItem = {
    command: '/help',
    description: (
        <>
            Brief description of commands and features
        </>
    ),
    admin: false,
    documentation: '/docs/help/commands#help'
}

const RegisterMeCommand: CommandCardItem = {
    command: '/register-me',
    description: (
        <>
            Register yourself Infinite Flight account. 
            It's quick and gives you access to cool features 😎
        </>
    ),
    admin: false,
    documentation: '/docs/help/commands#register-me'
}

const GetPilotCommand: CommandCardItem = {
    command: '/get-pilot',
    description: (
        <>
            Get a pilot's information.
        </>
    ),
    admin: false,
    documentation: '/docs/help/commands#register-me'
}

const EnableNotificationsCommand: CommandCardItem = {
    command: '/enable-notifications',
    description: (
        <>
            Enable active pilot and/or controller notifications in a channel.
        </>
    ),
    admin: false,
    documentation: '/docs/help/commands#enable-notifications'
}

const DisableNotificationsCommand: CommandCardItem = {
    command: '/disable-notifications',
    description: (
        <>
            Disable notifications in a channel.
        </>
    ),
    admin: false,
    documentation: '/docs/help/commands#disable-notifications'
}

const CommandCardList: CommandCardItem[] = [
    HelpCommand,
    RegisterMeCommand,
    GetPilotCommand,
    EnableNotificationsCommand,
    DisableNotificationsCommand,
]

function CommandCard({
    command,
    description,
    admin,
    documentation,
    }: CommandCardItem
) {
    return (
        <div className="col col--4">
            <div className={styles.commandCard}>
                <div className="card">
                    <div className="card__header">
                        <h3>{command}</h3>
                    </div>
                    <div className="card__body">
                        <p>
                            {description}
                        </p>
                    </div>
                    <div className="card__footer">
                        <Link
                            className="button button--outline button--block"
                            to={documentation}>
                            More
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CommandCards() {
    return (
        <div className={styles.commandCards}>
            <div className="row">
                {CommandCardList.map(commandCard => (
                    <CommandCard
                        key={commandCard.command}
                        command={commandCard.command}
                        description={commandCard.description}
                        admin={commandCard.admin}
                        documentation={commandCard.documentation}
                    />
                ))}
            </div>
        </div>
    )
}