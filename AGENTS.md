# AGENTS.md

## Project Instructions for AI Agents

### Type Checking
**Always run type checking after making changes:**

```bash
npx tsc -b --noEmit
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