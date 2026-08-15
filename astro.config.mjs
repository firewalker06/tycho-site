// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://usetycho.com',
	devToolbar: {
		enabled: false,
	},
	integrations: [
		starlight({
			title: 'Tycho',
			description: 'Supervise coding agents across projects.',
			logo: {
				src: './public/assets/tycho-logo-only.svg',
			},
			head: [
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' } },
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon-32x32.png', sizes: '32x32' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
				{ tag: 'link', attrs: { rel: 'manifest', href: '/site.webmanifest' } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#11100e' } },
				{ tag: 'meta', attrs: { property: 'og:site_name', content: 'Tycho' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://usetycho.com/og-image.png' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: 'https://usetycho.com/og-image.png' } },
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/firewalker06/tycho' }],
			customCss: ['./src/styles/starlight.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Install and Run', slug: 'docs/getting-started' },
					],
				},
				{
					label: 'Concept',
					items: [
						{ label: 'Mental Model', slug: 'docs/concept' },
						{ label: 'Delegating Work Between Agents', slug: 'docs/concept/delegation' },
					],
				},
				{
					label: 'Configuration',
					items: [
						{ label: 'Projects and Agents', slug: 'docs/configuration' },
						{ label: 'Harnesses', slug: 'docs/configuration/harnesses' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'CLI Reference', slug: 'docs/reference' },
						{ label: 'Glossary', slug: 'docs/reference/glossary' },
					],
				},
			],
		}),
	],
});
