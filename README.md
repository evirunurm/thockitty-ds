# thockitty-ds

A React component library built with [React Aria](https://react-spectrum.adobe.com/react-aria/) for accessible, unstyled UI components.

## Documentation

Browse the component library live at: https://evirunurm.github.io/thockitty-ds/

## Installation

```bash
pnpm add thockitty-ds
```

### Peer dependencies

Requires React 18 or 19:

```bash
pnpm add react react-dom
```

## Usage

```tsx
import { Button } from 'thockitty-ds'

function App() {
	return <Button onPress={() => console.log('pressed')}>Click me</Button>
}
```

## Components

### Button

An accessible button built on `@react-aria/button`. Supports `forwardRef`, `onPress`, `isDisabled`, and all standard [AriaButtonProps](https://react-spectrum.adobe.com/react-aria/useButton.html).

| Prop         | Type                      | Description                       |
| ------------ | ------------------------- | --------------------------------- |
| `onPress`    | `(e: PressEvent) => void` | Called when the button is pressed |
| `isDisabled` | `boolean`                 | Whether the button is disabled    |
| `className`  | `string`                  | CSS class name                    |
| `style`      | `CSSProperties`           | Inline styles                     |
| `children`   | `ReactNode`               | Button content                    |

## Development

```bash
# Install dependencies
pnpm install

# Build the library
pnpm run build

# Start Storybook
pnpm run storybook
```

### MCP Server

The library exposes an MCP (Model Context Protocol) server that provides programmatic access to component documentation, props, and design tokens.

#### Build Metadata

The MCP server requires pre-built metadata about components and tokens:

```bash
pnpm run build-mcp-metadata
```

This generates `netlify/functions/metadata.json` by analyzing:
- Component props from TypeScript interfaces
- Story variants from Storybook stories
- MDX documentation files
- Design tokens (colors, spacing, typography)

#### Local Development

Run the local MCP server for testing:

```bash
pnpm run mcp:dev
```

This starts a stdio-based MCP server that can be tested with the MCP Inspector.

#### Testing with MCP Inspector

The MCP Inspector provides a UI for testing MCP servers:

```bash
# Install globally
pnpm add -g @modelcontextprotocol/inspector

# Run from project root
cd thockitty-ds
mcp-inspector
```

In the inspector UI, add a new server:

- **Command:** `node`
- **Args:** `--import`, `tsx/esm`, `scripts/mcp-local-server.ts`

Or run with inline arguments:

```bash
mcp-inspector --command node --args "--import" --args "tsx/esm" --args "scripts/mcp-local-server.ts"
```

#### Available MCP Tools

Once connected, the following tools are available:

| Tool | Description |
|------|-------------|
| `list-components` | Returns all available component IDs |
| `get-component` | Returns props definition for a component |
| `get-component-stories` | Returns stories/variants for a component |
| `get-component-docs` | Returns MDX documentation for a component |
| `get-color-tokens` | Returns all color design tokens |
| `get-spacing-tokens` | Returns all spacing design tokens |
| `get-typography-tokens` | Returns all typography design tokens |

#### Production

In production (Netlify), the MCP server runs as an HTTP function at `/.netlify/functions/mcp`. It uses the Web Standard Streamable HTTP transport for compatibility with MCP clients.

## Tech stack

- **TypeScript** for type safety
- **tsup** for bundling (ESM + CJS + type declarations)
- **React Aria** for accessible component behavior
- **Storybook** for component development and documentation
