---
sidebar_position: 1
---

# Introduction

Hi I'm Nate, and I'll be introducing you to Skylink-IF. Skylink-IF development is not yet in full throttle. We still need to create and document a roadmap for the future of Skylink-IF before we lay down the code. 

:::tip Join Us

To join our initial development team or have say in the decision process, [join our discord](https://dsc.gg/skylink). 

:::

## So when will development start?

We want to have the following before we can start development as a team:

    ✅ A Website
    ✅ Proof-of-Concept Bot
    🔄 Documentation for development
    🔄 Suggested features from interested users
    ⬜ Roadmap developed by core developers and stakeholders


## What do I need to install?

There's a few things you need to install before working on our codebase, but if you're experienced with `git` and `nodejs`, you can skip this section.

* [NodeJS](https://nodejs.org/en/download/)
* [Git](https://git-scm.com/downloads)
* [npm](https://docs.npmjs.com/getting-started/installing-node)
* [Discord](https://discordapp.com/download)

### Optional

* [VSCode](https://code.visualstudio.com/download)
* [Yarn](https://yarnpkg.com/en/docs/install)

## What do I need to know?

Below, you'll find resources for learning the technologies Skylink-IF uses, such as Typescript. I'm actually new to most of these, so I'll be adding resources that have really helped me along the way.

### Git 

I'm not new to this one haha. Git is a version control system that allows you to track changes to your code and eases collaboration. I use git almost every day, and if you're into coding, you will too. 

* [Check out my git guide](https://www.tisuela.com/git-with-the-flow)

### Typescript

Skylink-IF (and this website too) use TypeScript. Essentially, it's just strongly-typed JavaScript. I myself, nate, am new to TypeScript. Never used it before LOL. I'm taking this opportunity to learn it, so if you are brand new too, well, you've picked the right project. I'll be documenting the resources I use to learn TypeScript.

* [TypeScript Documentation](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Discord.js

Discord.js is a library that allows you to connect to Discord servers. It's the reason why we are using TypeScript -- if we're learning JavaScript, we might as well learn TypeScript. The alternative was to use Discord.py, which is a Python library; however, it is currently unmaintained 😢.

* [Discord.js Documentation](https://discord.js.org/#/docs/main/stable/general/welcome)

### Infinite Flight Live API

Infinite Flight -- the reason why this bot is created. Please [check out this page to request a token](https://infiniteflight.com/guide/developer-reference/live-api/overview#obtaining-an-api-key). 

Template Email:

> Hi, I am a developer working on an open-source Infinite Flight discord bot, and I'd like to request an API key. Visit https://skylink-if.tisuela.com/ for more information.


Resources:

* [Infinite Flight Live API Documentation](https://infiniteflight.com/guide/developer-reference)

### Prisma

We use prisma as our ORM (Object Relational Mapper). It's a database abstraction layer that allows us to query our database. 

* [Prisma Documentation](https://www.prisma.io/docs/)

## How can I get involved?

Just [join our discord](https://dsc.gg/skylink) and let us know you'd like to help out! We're always looking for new members to join our team.

Don't wanna talk to us? [Fork Skylink-IF](https://github.com/kennedy-steve/skylink-if) and just [send us a Pull Request](https://github.com/kennedy-steve/skylink-if/pulls) with your changes.