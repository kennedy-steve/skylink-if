/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import clsx from 'clsx';
import React from 'react';
import styles from './HomepageDemo.module.css';
import DiscordTerminal from './Terminals/DiscordTerminal';

type DemoItem = {
  title: string;
  discordTerminal: JSX.Element;
  description: JSX.Element;
};

const DemoRegister: DemoItem = {
  title: 'Register your Infinite Flight account',
  discordTerminal: (
    <DiscordTerminal>
      <span data-disco='input'>/register-me infinite-flight-username: N8te</span>
      <span data-disco>🤖 Our ground crew have checked your aircraft. You are now verified!</span>
      <span data-disco='input'>Cool beaaanssss!</span>
    </DiscordTerminal>
  ),
  description: (
    <>
      With an automated registration system, you can integrate your
      Infinite Flight account on Discord! Skylink-IF will remember your
      registration for all servers you are in. No more manual mapping or
      shady registration -- Skylink-IF is the only Infinite Flight Discord Bot
      with "ground crew" verification 👷‍♂️👋
    </>
  ),
};

const DemoNotifications: DemoItem = {
  title: 'Know when to join your Friends',
  discordTerminal: (
    <DiscordTerminal>
      <span data-disco>🤖 Woozy#1234 is piloting a Boeing-787 at KLAX</span>
      <span data-disco='input'>Sweet, I'll hop on KLAX Tower!</span>
      <span data-disco>🤖 nate#4321 is controlling KLAX Tower</span>
    </DiscordTerminal>
  ),
  description: (
    <>
      Our Infinite Flight Discord Bot will tell your server when a member
      is flying or controlling an ATC Facility. You won't be seeing any spam
      by setting specific notifications in public and private channels.
    </>
  ),
};

const DemoList: DemoItem[] = [
  DemoRegister,
  DemoNotifications,
];


function Demo({title, discordTerminal, description}: DemoItem) {
  return (
    <div className={styles.demoItem}>
    <div className='row'>
      <div className='col col--6'>
        {discordTerminal}
      </div>
      <div className='col col--6'>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
    </div>
  );
}


export default function HomepageDemo(): JSX.Element {
  return (
    <section className={styles.demoItems}>
      <div className='container item'>

        {DemoList.map((props, idx) => (
          <Demo key={idx} {...props} />
        ))}

      </div>


    </section>
  );
}
