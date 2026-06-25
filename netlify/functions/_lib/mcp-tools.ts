import type { Metadata } from '../../../scripts/build-mcp-metadata'
import type { ToolConfig, ComponentIdInput, TokenCategoryInput } from './mcp-types'
import { ComponentIdSchema, TokenCategorySchema } from './mcp-types'

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
			const { componentId } = input as ComponentIdInput
			const comp = metadata.components[componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [
						{
							type: 'text' as const,
							text: componentError(componentId),
						},
					],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({
							version: metadata.version,
							id: componentId,
							props: comp.props,
						}),
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
			const { componentId } = input as ComponentIdInput
			const comp = metadata.components[componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [
						{
							type: 'text' as const,
							text: componentError(componentId),
						},
					],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({
							version: metadata.version,
							id: componentId,
							stories: comp.stories,
						}),
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
			const { componentId } = input as ComponentIdInput
			const comp = metadata.components[componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [
						{
							type: 'text' as const,
							text: componentError(componentId),
						},
					],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({
							version: metadata.version,
							id: componentId,
							mdx: comp.mdx,
						}),
					},
				],
			}
		},
	},
	{
		name: 'get-tokens',
		description: 'Returns design tokens for a specific category',
		schema: TokenCategorySchema,
		handler: (input, metadata) => {
			const category = (input as TokenCategoryInput).category
			const tokens = metadata.tokens[category]
			if (!tokens) {
				return {
					isError: true,
					content: [
						{
							type: 'text' as const,
							text: `Invalid category '${category}'. Valid categories are: color, spacing, typography.`,
						},
					],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({
							version: metadata.version,
							category,
							tokens,
						}),
					},
				],
			}
		},
	},
]
