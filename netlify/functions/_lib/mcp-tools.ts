import type { Metadata } from '../../../scripts/build-mcp-metadata'
import type { ToolConfig, ComponentIdInput } from './mcp-types'
import { ComponentIdSchema } from './mcp-types'

export function componentError(componentId: string): string {
	return `Component '${componentId}' not found. Call list-components to see available options.`
}

export const tools: ToolConfig[] = [
	{
		name: 'list-components',
		description: 'Returns all available component IDs',
		schema: undefined,
		handler: (_input, metadata) => ({
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify({
						version: metadata.version,
						components: Object.keys(metadata.components),
					}),
				},
			],
		}),
	},
	{
		name: 'get-component',
		description: 'Returns props definition for a component',
		schema: ComponentIdSchema,
		handler: (input, metadata) => {
			const comp = metadata.components[input!.componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [{ type: 'text' as const, text: componentError(input!.componentId) }],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ version: metadata.version, id: input!.componentId, props: comp.props }),
					},
				],
			}
		},
	},
	{
		name: 'get-component-stories',
		description: 'Returns stories/variants for a component',
		schema: ComponentIdSchema,
		handler: (input, metadata) => {
			const comp = metadata.components[input!.componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [{ type: 'text' as const, text: componentError(input!.componentId) }],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ version: metadata.version, id: input!.componentId, stories: comp.stories }),
					},
				],
			}
		},
	},
	{
		name: 'get-component-docs',
		description: 'Returns raw MDX documentation string for a component',
		schema: ComponentIdSchema,
		handler: (input, metadata) => {
			const comp = metadata.components[input!.componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [{ type: 'text' as const, text: componentError(input!.componentId) }],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ version: metadata.version, id: input!.componentId, mdx: comp.mdx }),
					},
				],
			}
		},
	},
	{
		name: 'get-color-tokens',
		description: 'Returns all color design tokens',
		schema: undefined,
		handler: (_input, metadata) => ({
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify({ version: metadata.version, tokens: metadata.tokens.color }),
				},
			],
		}),
	},
	{
		name: 'get-spacing-tokens',
		description: 'Returns all spacing design tokens',
		schema: undefined,
		handler: (_input, metadata) => ({
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify({ version: metadata.version, tokens: metadata.tokens.spacing }),
				},
			],
		}),
	},
	{
		name: 'get-typography-tokens',
		description: 'Returns all typography design tokens',
		schema: undefined,
		handler: (_input, metadata) => ({
			content: [
				{
					type: 'text' as const,
					text: JSON.stringify({ version: metadata.version, tokens: metadata.tokens.typography }),
				},
			],
		}),
	},
]
