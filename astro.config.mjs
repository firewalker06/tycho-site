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
			description: 'Supervise many AI coding sessions across projects.',
			logo: {
				src: './public/assets/tycho-logo-only.svg',
			},
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
					items: [{ label: 'Mental Model', slug: 'docs/concept' }],
				},
				{
					label: 'Configuration',
					items: [{ label: 'Projects and Agents', slug: 'docs/configuration' }],
				},
				{
					label: 'Reference',
					items: [
						{ label: 'CLI Reference', slug: 'docs/reference' },
						{ label: 'Glossary', slug: 'docs/reference/glossary' },
						{ label: 'ADR: Site Direction', slug: 'docs/decisions/adr-001-website-direction' },
					],
				},
			],
		}),
	],
});
