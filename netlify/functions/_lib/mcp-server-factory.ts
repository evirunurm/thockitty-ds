import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import type { Metadata } from '../../../scripts/build-mcp-metadata'

/**
 * Shared MCP server factory used by BOTH:
 *   - netlify/functions/mcp.mts      (deployed, always-on, reads metadata.json)
 *   - .storybook/thockitty-mcp-preset/preset.ts  (dev, live manifest-backed)
 *
 * Both entrypoints build the same `Metadata` shape (however they source the data)
 * and pass it here, so the tool surface never drifts between dev and prod.
 */
export function createThockittyMcpServer(metadata: Metadata): McpServer {
	const server = new McpServer({
		name: 'thockitty-ds',
		version: metadata.version,
	})

	function componentError(componentId: string): string {
		return `Component '${componentId}' not found. Call list-components to see available options.`
	}

	server.tool('list-components', 'Returns all available component IDs', () => ({
		content: [
			{
				type: 'text' as const,
				text: JSON.stringify({
					version: metadata.version,
					components: Object.keys(metadata.components),
				}),
			},
		],
	}))

	server.tool(
		'get-component',
		'Returns props definition for a component',
		{ componentId: z.string().describe('The component ID (e.g. "button")') },
		({ componentId }) => {
			const comp = metadata.components[componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [{ type: 'text' as const, text: componentError(componentId) }],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ version: metadata.version, id: componentId, props: comp.props }),
					},
				],
			}
		}
	)

	server.tool(
		'get-component-stories',
		'Returns stories/variants for a component',
		{ componentId: z.string().describe('The component ID (e.g. "button")') },
		({ componentId }) => {
			const comp = metadata.components[componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [{ type: 'text' as const, text: componentError(componentId) }],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ version: metadata.version, id: componentId, stories: comp.stories }),
					},
				],
			}
		}
	)

	server.tool(
		'get-component-docs',
		'Returns raw MDX documentation string for a component',
		{ componentId: z.string().describe('The component ID (e.g. "button")') },
		({ componentId }) => {
			const comp = metadata.components[componentId.toLowerCase()]
			if (!comp) {
				return {
					isError: true,
					content: [{ type: 'text' as const, text: componentError(componentId) }],
				}
			}
			return {
				content: [
					{
						type: 'text' as const,
						text: JSON.stringify({ version: metadata.version, id: componentId, mdx: comp.mdx }),
					},
				],
			}
		}
	)

	server.tool('get-color-tokens', 'Returns all color design tokens', () => ({
		content: [
			{
				type: 'text' as const,
				text: JSON.stringify({ version: metadata.version, tokens: metadata.tokens.color }),
			},
		],
	}))

	server.tool('get-spacing-tokens', 'Returns all spacing design tokens', () => ({
		content: [
			{
				type: 'text' as const,
				text: JSON.stringify({ version: metadata.version, tokens: metadata.tokens.spacing }),
			},
		],
	}))

	server.tool('get-typography-tokens', 'Returns all typography design tokens', () => ({
		content: [
			{
				type: 'text' as const,
				text: JSON.stringify({ version: metadata.version, tokens: metadata.tokens.typography }),
			},
		],
	}))

	return server
}