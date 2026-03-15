import type { Preview } from '@storybook/react'
import '../src/tokens/css/fonts.css'
import '../src/tokens/css/variables.css'

const preview: Preview = {
	parameters: {
		backgrounds: {
			default: 'dark',
			values: [
				{ name: 'dark', value: '#0f0f0f' },
				{ name: 'light', value: '#fdfdfd' },
			],
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
}

export default preview
