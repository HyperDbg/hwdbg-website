// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'hwdbg',
  tagline: 'HyperDbg\'s chip-level hardware debugger',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://hwdbg.hyperdbg.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'HyperDbg', // Usually your GitHub org/user name.
  projectName: 'hwdbg', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.png',
      navbar: {
        title: 'hwdbg',
        logo: {
          alt: 'hwdbg',
          src: 'img/hyperdbg.png',
        },
        items: [
          /*{
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'HyperDbg',
          },*/
          {to: '/docs', label: 'Documentation', position: 'left'},
          {to: 'https://hwdbg.hyperdbg.org/api', label: 'API', position: 'left'},
          {to: 'https://github.com/HyperDbg/hwdbg-fpga', label: 'FPGA Boards', position: 'left'},
          {
			href: "https://github.com/HyperDbg/HyperDbg/tree/master/hwdbg",
			position: "right",
			className: "header-github-link",
			"aria-label": "GitHub repository",
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
                label: 'Getting Started',
                to: '/docs/getting-started',
              },     
			  {
                label: 'API',
                to: 'https://hwdbg.hyperdbg.org/api',
              },     
			  {
                label: 'FAQs',
                to: '/docs/faq',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'HyperDbg',
                href: 'https://hyperdbg.org',
              },
              {
                label: 'Telegram',
                href: 'https://t.me/HyperDbg',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/anSPsGUtzN',
              },
              {
                label: 'Matrix',
                href: 'https://matrix.to/#/#hyperdbg-discussion:matrix.org',
              },
              {
                label: 'Mastodon',
                href: 'https://infosec.exchange/@hyperdbg',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/HyperDbg',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Source',
                href: 'https://github.com/HyperDbg/HyperDbg/tree/master/hwdbg',
              },               
			  {
                label: 'Research',
                href: 'https://research.hyperdbg.org',
              },              
			  {
                label: 'HyperDbg GitHub',
                href: 'https://github.com/HyperDbg',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} HyperDbg Developers. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
