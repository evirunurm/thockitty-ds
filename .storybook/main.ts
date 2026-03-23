import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
	staticDirs: ['../public'],
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-webpack5-compiler-swc',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-mcp',
		'storybook-addon-pseudo-states',
		'storybook-addon-tag-badges',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	webpackFinal: (config) => {
		// css-loader v7 defaults namedExport:true (esModule mode), but style-loader v4
		// reads content.locals which is only set when namedExport:false — patch it here.
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const rules: any[] = config.module?.rules ?? []
		for (const rule of rules) {
			if (rule?.test instanceof RegExp && rule.test.test('test.css')) {
				for (const use of rule.use ?? []) {
					if (typeof use?.loader === 'string' && use.loader.includes('css-loader')) {
						use.options = { ...use.options, modules: { auto: true, namedExport: false } }
					}
				}
			}
		}
		return config
	},
}
export default config
