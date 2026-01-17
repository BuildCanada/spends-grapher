# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: @buildcanada/charts

A configurable data visualization library for creating interactive charts.

## Commands

```bash
bun install              # Install dependencies
bun run storybook        # Run Storybook on port 6006
bun run build            # Build Storybook for production
bun run serve-storybook  # Serve production build on port 6006
bun test                 # Run all tests
bun test src/path/to/file.test.ts  # Run single test file
bun run typecheck        # TypeScript check
```

## Architecture

- **React 19** with **MobX 6** for state management
- Uses TC-39 stage 3 decorators for `@computed` and `@action`
- Observable props are listed in `makeObservable()` calls, not decorated with `@observable`
- **Vitest** for testing with jsdom environment

## File Structure

```
src/
├── components/     # Reusable UI components (TextWrap, MarkdownTextWrap, etc.)
├── config/         # ChartsProvider context and configuration
├── core-table/     # Data table handling (ChartsTable, CoreTable)
├── explorer/       # Explorer component (data explorer UI)
├── grapher/        # Main charting engine
│   ├── axis/           # Axis rendering
│   ├── barCharts/      # Bar chart implementations
│   ├── chart/          # Chart interface and type mapping
│   ├── color/          # Color scales and schemes
│   ├── controls/       # Interactive controls (EntityPicker, Dropdown)
│   ├── core/           # Core graphing engine (Grapher, GrapherState)
│   ├── lineCharts/     # Line chart implementations
│   ├── mapCharts/      # Map visualization
│   ├── scatterCharts/  # Scatter plot implementations
│   ├── stackedCharts/  # Stacked area/bar charts
│   └── ...
├── styles/         # Global SCSS styles (entry: charts.scss)
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Key Components

- **Grapher**: Main charting component with multiple visualization types (line, bar, scatter, map, stacked)
- **GrapherState**: MobX-powered state management for Grapher
- **Explorer**: Data explorer that wraps Grapher and adds additional controls
- **ChartsProvider**: React context for global chart configuration (branding, data API, error reporting)

## Code Style

- Double quotes for string literals
- Use type definitions for function params and return values
- Avoid the `any` type (but note: `noImplicitAny` is disabled in tsconfig)
- BEM conventions for CSS in separate .scss files
- Entry point for styles: `src/styles/charts.scss`
- Tests use Vitest with `it()` and `expect()` from `vitest`

## MobX Pattern

```typescript
class MyComponent {
    someObservable = "value"

    constructor() {
        makeObservable(this, {
            someObservable: observable,
        })
    }

    @computed get derivedValue() {
        return this.someObservable.toUpperCase()
    }
}
```

**Important**: Don't use `@computed` on getters that access `this.props` - props aren't observable in mobx-react.

## Peer Dependencies

This package expects the following to be provided by the consuming application:
- `react` ^19.0.0
- `react-dom` ^19.0.0
- `mobx` ^6.13.0
- `mobx-react` ^7.6.0
