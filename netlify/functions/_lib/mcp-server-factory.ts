import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Metadata } from '../../../scripts/build-mcp-metadata'
import { tools } from './mcp-tools'
import type { ComponentIdInput } from './mcp-types'

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

	for (const tool of tools) {
		if (tool.schema) {
			server.registerTool(
				tool.name,
				{
					description: tool.description,
					inputSchema: tool.schema as any,
				},
				(input: ComponentIdInput) => tool.handler(input, metadata)
			)
		} else {
			server.tool(tool.name, tool.description, () =>
				tool.handler(undefined, metadata)
			)
		}
	}

	return server
}
