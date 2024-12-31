// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Nzuri Documentation site',
  tagline: 'Documentation website for Nzuri Strategy Processes',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://nzuri-docs.netlify.app', // Your Netlify site URL
  baseUrl: '/', // Root directory of your site
  trailingSlash: false, // To avoid unnecessary trailing slashes

  // GitHub pages deployment config (not used here, but can stay for GitHub integration)
  organizationName: 'Nzuri-Codebase', // Your GitHub organization or username
  projectName: 'documentation-site', // Your repository name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: './sidebars.js', // Path to sidebar configuration
          editUrl: 'https://github.com/Nzuri-Codebase/documentation-site', // GitHub repo for editing
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/Nzuri-Codebase/documentation-site', // GitHub repo for editing
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    navbar: {
      title: 'Nzuri Docs',
      logo: {
        alt: 'Nzuri Logo',
        src: 'img/nzuri_logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/Nzuri-Codebase/documentation-site',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
