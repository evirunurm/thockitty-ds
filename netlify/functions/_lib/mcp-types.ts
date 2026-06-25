import { z } from 'zod'
import type { Metadata } from '../../../scripts/build-mcp-metadata'

export type ToolResult = {
	content: Array<{ type: 'text'; text: string }>
	isError?: boolean
}

export const ComponentIdSchema = z.object({
	componentId: z.string().describe('The component ID (e.g. "button")'),
})

export type ComponentIdInput = z.infer<typeof ComponentIdSchema>

export interface ToolConfig {
	name: string
	description: string
	schema: typeof ComponentIdSchema | undefined
	handler: (
		input: ComponentIdInput | undefined,
		metadata: Metadata
	) => ToolResult
}
