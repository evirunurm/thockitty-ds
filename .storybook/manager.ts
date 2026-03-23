import { addons } from 'storybook/manager-api'
import {
	defaultConfig,
	type TagBadgeParameters,
} from 'storybook-addon-tag-badges/manager-helpers'
import thockittyTheme from './thockitty-theme'

addons.setConfig({
	theme: thockittyTheme,
	tagBadges: [
		{
			tags: 'in-progress',
			badge: {
				text: 'in progress',
				style: {
					backgroundColor: '#f59e0b',
					color: '#000',
				},
				tooltip:
					'This component is in progress and not yet ready for production use.',
			},
		},
		...defaultConfig,
	] satisfies TagBadgeParameters,
})
