import { createStorybookMcpHandler } from '@storybook/mcp'

const handler = await createStorybookMcpHandler()

export default (request: Request) => handler(request, {})
