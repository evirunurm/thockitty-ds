import StyleDictionary from 'style-dictionary'
import { formats, transformGroups } from 'style-dictionary/enums'

StyleDictionary.registerFormat({
	name: 'docs/tokens',
	format: ({ dictionary }) => {
		const tokens = dictionary.allTokens.map((token) => ({
			name: token.name,
			path: token.path.join('.'),
			value: token.$value ?? token.value ?? token.original.$value,
			cssVariable: `--${token.path.join('-').toLowerCase()}`,
		}))
		return `export const tokens = ${JSON.stringify(tokens, null, '\t')}\n`
	},
})

StyleDictionary.registerFormat({
	name: 'docs/tokens-typography',
	format: ({ dictionary }) => {
		const tokens = dictionary.allTokens.map((token) => ({
			name: token.name,
			path: token.path.join('.'),
			value: token.value,
			cssVariable: `--${token.path.join('-').toLowerCase()}`,
			fontFamily:
				token.original.$value?.fontFamily ?? token.value.fontFamily,
			fontSize: token.original.$value?.fontSize ?? token.value.fontSize,
			fontWeight:
				token.original.$value?.fontWeight ?? token.value.fontWeight,
			lineHeight:
				token.original.$value?.lineHeight ?? token.value.lineHeight,
			letterSpacing:
				token.original.$value?.letterSpacing ??
				token.value.letterSpacing,
			fontStyle:
				token.original.$value?.fontStyle ?? token.value.fontStyle,
		}))
		return `export const tokens = ${JSON.stringify(tokens, null, '\t')}\n`
	},
})

/** @type {import('style-dictionary').Config} */
export default {
	source: ['tokens.json'],
	preprocessors: ['tokens-studio'],
	platforms: {
		css: {
			transformGroup: transformGroups.css,
			buildPath: 'src/tokens/css/',
			files: [
				{
					destination: 'variables.css',
					format: formats.cssVariables,
				},
			],
		},
		ts: {
			transformGroup: 'js',
			buildPath: 'src/tokens/ts/',
			files: [
				{
					destination: 'colors.ts',
					format: 'docs/tokens',
					filter: (token) => token.$type === 'color',
				},
				{
					destination: 'spacing.ts',
					format: 'docs/tokens',
					filter: (token) => token.$type === 'dimension',
				},
				{
					destination: 'typography.ts',
					format: 'docs/tokens-typography',
					filter: (token) => token.$type === 'typography',
				},
			],
		},
	},
}
