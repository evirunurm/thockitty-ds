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

function buildSatoriMaps(dictionary) {
	const typographyMap = Object.fromEntries(
		dictionary.allTokens
			.filter((token) => token.$type === 'typography')
			.map((token) => {
				const raw = token.original.$value ?? token.value
				return [
					`--${token.path.join('-').toLowerCase()}`,
					{
						fontFamily: raw.fontFamily,
						fontSize: parseInt(raw.fontSize, 10),
						fontWeight: raw.fontWeight,
						fontStyle: raw.fontStyle,
					},
				]
			})
	)

	const colorsMap = Object.fromEntries(
		dictionary.allTokens
			.filter((token) => token.$type === 'color')
			.map((token) => [
				`--${token.path.join('-').toLowerCase()}`,
				token.$value ?? token.value ?? token.original.$value,
			])
	)

	return { typographyMap, colorsMap }
}

StyleDictionary.registerFormat({
	name: 'satori/esm',
	format: ({ dictionary }) => {
		const { typographyMap, colorsMap } = buildSatoriMaps(dictionary)
		return (
			`export const typography = ${JSON.stringify(typographyMap, null, '\t')};\n` +
			`export const colors = ${JSON.stringify(colorsMap, null, '\t')};\n`
		)
	},
})

StyleDictionary.registerFormat({
	name: 'satori/cjs',
	format: ({ dictionary }) => {
		const { typographyMap, colorsMap } = buildSatoriMaps(dictionary)
		return (
			`"use strict";\n` +
			`Object.defineProperty(exports, "__esModule", { value: true });\n` +
			`exports.typography = ${JSON.stringify(typographyMap, null, '\t')};\n` +
			`exports.colors = ${JSON.stringify(colorsMap, null, '\t')};\n`
		)
	},
})

StyleDictionary.registerFormat({
	name: 'satori/dts',
	format: () => {
		return (
			`export type SatoriTypographyStyle = {\n` +
			`\tfontFamily: string;\n` +
			`\tfontSize: number;\n` +
			`\tfontWeight: number;\n` +
			`\tfontStyle: string;\n` +
			`};\n` +
			`export declare const typography: Record<string, SatoriTypographyStyle>;\n` +
			`export declare const colors: Record<string, string>;\n`
		)
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
		satori: {
			transformGroup: 'js',
			buildPath: 'dist/satori/',
			files: [
				{
					destination: 'index.js',
					format: 'satori/esm',
				},
				{
					destination: 'index.cjs',
					format: 'satori/cjs',
				},
				{
					destination: 'index.d.ts',
					format: 'satori/dts',
				},
			],
		},
	},
}
