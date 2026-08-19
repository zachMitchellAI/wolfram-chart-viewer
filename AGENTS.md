# AGENTS.md

## Project Instructions for AI Agents

### Type & format Checking

**Always run type checking & prettier after making changes:**

```bash
bun run types
bun run format
```

This project uses strict TypeScript. Ensure all new code passes type checking before considering a task complete.

### Chart Types

Chart.js types are barrel-exported from `utils/chart-types.interface.ts`. This file contains:

- All Chart.js type re-exports (`ChartType`, `ChartData`, `ChartOptions`, etc.)
- Per-chart dataset interfaces (`BarChartDataset`, `PieChartDataset`, etc.)
- Factory functions (`createBarDataset`, `createPieDataset`, etc.)
- Type-safe lookup utilities (`ChartDatasetByType`, `ChartDataByType`)

When working with charts, import from this barrel file rather than directly from `chart.js`.

### Code Style

- Follow existing conventions in the codebase
- Use explicit types over `any`
- Prefer `type` over `interface` for simple type aliases
- Keep imports organized (external first, then internal)
- Imports of components DO NOT require having explicit imports. Simply import the component, then confirm the type is working by running the aformentioned type-check
- use kebab-case for file names & component names within the files themselves
- All `.vue` files need to have their styles on top, component templates in the middle, and scripts on the bottom.

#### AVOID:

in `.vue` files in the script tag:

```ts
import { computed } from "vue";
import type { ChartDataDTO } from "~/utils/use-chart-data.interface";
```

It is not necessary, nuxt takes care of imports automatically

## NPM imports

Agents MUST NOT import any new packages without explicit permission. If there are existing packages that need to be upgraded, that is the primary exception. Otherwise if you're thinking a package needs to be installed, please prompt the user before taking the action
