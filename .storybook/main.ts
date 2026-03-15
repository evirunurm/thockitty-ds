import type { StorybookConfig } from '@storybook/react-webpack5'

const config: StorybookConfig = {
	staticDirs: ['../public'],
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
		'@storybook/addon-webpack5-compiler-swc',
		'@storybook/addon-essentials',
		'@storybook/addon-onboarding',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
	],
	framework: {
		name: '@storybook/react-webpack5',
		options: {},
	},
	webpackFinal: async (config) => {
		if (process.env.STORYBOOK_BASE_PATH) {
			config.output = config.output ?? {}
			config.output.publicPath = `${process.env.STORYBOOK_BASE_PATH}/`
		}
		return config
	},
}
export default config
