import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { z } from 'zod'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load metadata ─────────────────────────────────────────────────────────────

function loadMetadata() {
	try {
		const dir = dirname(fileURLToPath(import.meta.url))
		const raw = readFileSync(join(dir, 'metadata.json'), 'utf-8')
		return JSON.parse(raw) as Metadata
	} catch {
		return null
	}
}

interface PropDef {
	name: string
	type: string
	default: string | null
	required: boolean
	description: string | null
}

interface StoryDef {
	id: string
	args: Record<string, unknown>
}

interface ComponentMeta {
	props: PropDef[]
	stories: StoryDef[]
	mdx: string
}

interface TokenDef {
	cssVariable: string
	value: string
}

interface Metadata {
	version: string
	components: Record<string, ComponentMeta>
	tokens: {
		color: TokenDef[]
		spacing: TokenDef[]
		typography: TokenDef[]
	}
}

// ── CORS headers ──────────────────────────────────────────────────────────────

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
	'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id',
}

// ── MCP server factory ────────────────────────────────────────────────────────

function createMcpServer(metadata: Metadata): McpServer {
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

// ── Handler ───────────────────────────────────────────────────────────────────

export default async (req: Request): Promise<Response> => {
	if (req.method === 'OPTIONS') {
		return new Response(null, { status: 204, headers: corsHeaders })
	}

	const metadata = loadMetadata()
	if (!metadata) {
		return new Response(
			JSON.stringify({ error: 'metadata.json not found. Run npm run build-mcp-metadata first.' }),
			{ status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
		)
	}

	const mcpServer = createMcpServer(metadata)
	const transport = new WebStandardStreamableHTTPServerTransport({
		sessionIdGenerator: undefined,
		enableJsonResponse: true,
	})

	await mcpServer.connect(transport)
	const response = await transport.handleRequest(req)

	const newHeaders = new Headers(response.headers)
	for (const [key, value] of Object.entries(corsHeaders)) {
		newHeaders.set(key, value)
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: newHeaders,
	})
}
