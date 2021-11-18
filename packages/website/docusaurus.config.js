// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Skylink-IF Beta',
  tagline: 'Bringing Infinite Flight to Discord',
  url: 'https://skylink-if.tisuela.com',
  baseUrl: '/skylink-if/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'kennedy-steve', // Usually your GitHub org/user name.
  projectName: 'skylink-if', // Usually your repo name.
  trailingSlash: false,

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/kennedy-steve/skylink-if/tree/development/packages/website',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Skylink-IF Beta',
        logo: {
          alt: 'Skylink IF Logo',
          src: 'img/logo.svg',
        },
        items: [
          /** Left side */
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Contributing',
          },

          /** Right side */
          {
            href: 'https://github.com/kennedy-steve/skylink-if',
            position: 'right',
            className: 'header-github-link',
            'aria-label': 'GitHub repository',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Contributing',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://dsc.gg/skylink',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/kennedy-steve/skylink-if',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Skylink-IF`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
