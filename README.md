# thockitty-ds

A React component library built with [React Aria](https://react-spectrum.adobe.com/react-aria/) for accessible, unstyled UI components.

## Installation

```bash
npm install thockitty-ds
```

### Peer dependencies

Requires React 18 or 19:

```bash
npm install react react-dom
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
npm install

# Build the library
npm run build

# Start Storybook
npm run storybook
```

## Tech stack

- **TypeScript** for type safety
- **tsup** for bundling (ESM + CJS + type declarations)
- **React Aria** for accessible component behavior
- **Storybook** for component development and documentation
