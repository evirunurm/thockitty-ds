import { create } from '@storybook/theming/create'

export default create({
	base: 'dark',

	// Brand
	brandImage: `${process.env.STORYBOOK_BASE_PATH ?? ''}/brand/thockitty-dark.svg`,
	brandTitle: 'thockitty',
	brandTarget: '_self',

	// Typography
	fontBase: '"Geist Mono", monospace',
	fontCode: '"Geist Mono", monospace',

	// Colors
	colorPrimary: '#000000',
	colorSecondary: '#e65f89',

	// UI
	appBg: '#18181b',
	appContentBg: '#0f0f0f',
	appPreviewBg: '#0f0f0f',
	appBorderColor: '#3f3f46',
	appBorderRadius: 0,

	// Text colors
	textColor: '#fdfdfd',
	textInverseColor: '#0f0f0f',

	// Toolbar
	barTextColor: '#a1a1aa',
	barSelectedColor: '#e65f89',
	barHoverColor: '#fdfdfd',
	barBg: '#18181b',

	// Form colors
	inputBg: '#27272a',
	inputBorder: '#3f3f46',
	inputTextColor: '#fdfdfd',
	inputBorderRadius: 0,
	// buttonBg: '',
	// buttonBorder: '',
	// gridCellSize: '',
	// textMutedColor: '',
	// booleanBg: '',
	// booleanSelectedBg: ''
})
