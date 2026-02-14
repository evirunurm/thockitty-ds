### Step 1: Project Initialization and Structure

- Start from the existing repository containing `tokens.json` (leave it untouched at the root).
- Ensure the project is set up with Node.js (v18+ recommended) and npm or yarn as the package manager.
- Create a modern directory structure for a React component library:
- Use `src/index.ts` to re-export all components (initially just Button) for a clean public API.

### Step 2: Install Dependencies

- Install core development tools for building a modern React library:
    - Use TypeScript for type safety: `npm install typescript --save-dev`.
    - Use parcel as a bundle.
    - Install React types for development: `npm install @types/react @types/react-dom --save-dev`.
- Install React Aria dependencies:
    - Direct dependency: `@react-aria/button` (since we're wrapping it specifically for the Button component): `npm install @react-aria/button`.
    - Peer dependencies: `react` and `react-dom` (to ensure consumers provide compatible versions and avoid duplication): Add to `package.json` under `"peerDependencies": { "react": "^18.0.0", "react-dom": "^18.0.0" }`. Review this step to make sure what's the best approach for this.
- No other dependencies for styling or extras, keeping it minimal.

### Step 3: Configure TypeScript (tsconfig.json)

- Create `tsconfig.json` with modern React settings. Example:
    ```json
    {
    	"compilerOptions": {
    		"target": "ES2020",
    		"module": "ESNext",
    		"moduleResolution": "node",
    		"jsx": "react-jsx",
    		"strict": true,
    		"esModuleInterop": true,
    		"skipLibCheck": true,
    		"declaration": true,
    		"outDir": "dist",
    		"rootDir": "src"
    	},
    	"include": ["src"],
    	"exclude": ["node_modules", "dist"]
    }
    ```
- This enables JSX support, strict typing, and declaration file generation for the package.

### Step 4: Implement the Button Component

- In `src/components/Button/Button.tsx`:
    - Create a simple Button wrapper.
- In `src/components/Button/index.ts`: `export * from './Button';`
- In `src/index.ts`: `export * from './components/Button';`
- This setup allows easy import like `import { Button } from 'thockitty-ds';` and supports tree-shaking.

### Step 5: Configure Build and Package.json

- Add build scripts to `package.json`. Example:
    ```json
    {
    	"name": "thockitty-ds",
    	"version": "0.1.0",
    	"main": "dist/index.cjs",
    	"module": "dist/index.mjs",
    	"types": "dist/index.d.ts",
    	"scripts": {
    		"build": "tsup src/index.ts --format esm,cjs --dts --clean"
    	},
    	"peerDependencies": {
    		"react": "^18.0.0",
    		"react-dom": "^18.0.0"
    	},
    	"dependencies": {
    		"@react-aria/button": "^3.0.0" // Use latest stable version
    	},
    	"devDependencies": {
    		"@types/react": "^18.0.0",
    		"@types/react-dom": "^18.0.0",
    		"tsup": "^8.0.0",
    		"typescript": "^5.0.0"
    	},
    	"files": ["dist"]
    }
    ```
- Run `npm run build` to generate `dist/` with ESM (.mjs), CJS (.cjs), and types (.d.ts). This makes it a consumable npm package supporting modern bundlers.
- Set `"files": ["dist"]` to include only built artifacts in the published package.

### Step 6: Update README.md

- Replace or update the existing README with the final conclussions of the project.

### Step 7: Testing and Publishing

- Add stortybook to the library.
- Add `.gitignore` to exclude `node_modules`, `dist`, etc.
