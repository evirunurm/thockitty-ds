import type { Preview } from '@storybook/react-webpack5'
import '../src/tokens/css/fonts.css'
import '../src/tokens/css/variables.css'

const preview: Preview = {
    parameters: {
		backgrounds: {
            options: {
                dark: { name: 'dark', value: '#0f0f0f' },
                light: { name: 'light', value: '#fdfdfd' }
            }
        },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},

    initialGlobals: {
        backgrounds: {
            value: 'dark'
        }
    }
}

export default preview
