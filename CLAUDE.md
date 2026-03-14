# Thockitty Design System

This is a component library intended to be packaged and consumed by other projects. Keep this in mind when making changes:

- Avoid side effects, global styles, or assumptions about the host environment
- Components should be self-contained and composable
- `src/assets/` holds static assets (fonts, etc.) that are bundled with the library
- Storybook (`npm run storybook`) is used for development and documentation only — it is not part of the distributed package
