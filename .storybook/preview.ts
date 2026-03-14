import type { Preview } from '@storybook/react'
import '../src/tokens/css/fonts.css'
import '../src/tokens/css/variables.css'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
}

export default preview
