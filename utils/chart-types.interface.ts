import type { ChartTypeRegistry } from "chart.js";

export const CHART_TYPES: (keyof ChartTypeRegistry)[] = [
  "bar",
  "line",
  "scatter",
  "bubble",
  "pie",
  "doughnut",
  "polarArea",
  "radar",
] as const;

export type ChartTypeLiteral = (typeof CHART_TYPES)[number];
