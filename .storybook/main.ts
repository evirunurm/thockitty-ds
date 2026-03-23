import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
	staticDirs: ['../public'],
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-webpack5-compiler-swc',
		'@storybook/addon-a11y',
		'@storybook/addon-docs',
		'@storybook/addon-mcp',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	webpackFinal: async (config) => {
		config.module?.rules?.push({
			test: /\.(woff|woff2|eot|ttf|otf)$/i,
			type: 'asset/resource',
		})
		return config
	},
}
export default config
