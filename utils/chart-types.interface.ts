// This is an AI generated file to grab the chart types.
// It's for referencing a specific way to build a chart, for DTO transfer, and to build appropriate chart data for langchain
import type {
  ChartType,
  ChartTypeRegistry,
  ChartData,
  ChartOptions,
  ChartDataset,
  DefaultDataPoint,
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  ChartDataCustomTypesPerDataset,
  ChartDatasetCustomTypesPerDataset,
  BarControllerDatasetOptions,
  LineControllerDatasetOptions,
  ScatterControllerDatasetOptions,
  BubbleControllerDatasetOptions,
  PieControllerDatasetOptions,
  DoughnutControllerDatasetOptions,
  PolarAreaControllerDatasetOptions,
  RadarControllerDatasetOptions,
  ScatterDataPoint,
  BubbleDataPoint,
  BarParsedData,
  CartesianParsedData,
  RadialParsedData,
} from 'chart.js';

type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type {
  ChartType,
  ChartTypeRegistry,
  ChartData,
  ChartOptions,
  ChartDataset,
  DefaultDataPoint,
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  ChartDataCustomTypesPerDataset,
  ChartDatasetCustomTypesPerDataset,
  BarControllerDatasetOptions,
  LineControllerDatasetOptions,
  ScatterControllerDatasetOptions,
  BubbleControllerDatasetOptions,
  PieControllerDatasetOptions,
  DoughnutControllerDatasetOptions,
  PolarAreaControllerDatasetOptions,
  RadarControllerDatasetOptions,
  ScatterDataPoint,
  BubbleDataPoint,
  BarParsedData,
  CartesianParsedData,
  RadialParsedData,
};

export type SupportedChartType = ChartType;

export type ChartTypeKeys = keyof ChartTypeRegistry;

export const CHART_TYPES: ChartTypeKeys[] = [
  'bar',
  'line',
  'scatter',
  'bubble',
  'pie',
  'doughnut',
  'polarArea',
  'radar',
] as const;

export type ChartTypeLiteral = (typeof CHART_TYPES)[number];

export interface ChartTypeMetadata {
  type: ChartTypeLiteral;
  name: string;
  category: 'cartesian' | 'radial';
  supportsStacking: boolean;
  dataPointDescription: string;
}

export function isValidChartType(type: string): type is ChartTypeLiteral {
  return CHART_TYPES.includes(type as ChartTypeLiteral);
}

export interface BarChartDataset<TData = number | [number, number]> extends DeepPartial<BarControllerDatasetOptions> {
  type: 'bar';
  data: TData[];
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderRadius?: number | { topLeft: number; topRight: number; bottomLeft: number; bottomRight: number };
  barPercentage?: number;
  categoryPercentage?: number;
  maxBarThickness?: number;
  minBarLength?: number;
  indexAxis?: 'x' | 'y';
}

export interface LineChartDataset<TData = ScatterDataPoint | number> extends DeepPartial<LineControllerDatasetOptions> {
  type: 'line';
  data: TData[];
  label?: string;
  borderColor?: string | string[];
  borderWidth?: number;
  backgroundColor?: string | string[];
  fill?: boolean | 'start' | 'end' | 'origin' | 'stack';
  tension?: number;
  cubicInterpolationMode?: 'default' | 'monotone';
  pointStyle?: string | string[];
  pointRadius?: number | number[];
  pointHoverRadius?: number | number[];
  showLine?: boolean;
  spanGaps?: boolean;
}

export interface ScatterChartDataset<TData = ScatterDataPoint> extends DeepPartial<ScatterControllerDatasetOptions> {
  type: 'scatter';
  data: TData[];
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  pointStyle?: string | string[];
  pointRadius?: number | number[];
  pointHoverRadius?: number | number[];
  showLine?: boolean;
}

export interface BubbleChartDataset<TData = BubbleDataPoint> extends DeepPartial<BubbleControllerDatasetOptions> {
  type: 'bubble';
  data: TData[];
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  radius?: number | number[];
  hoverRadius?: number | number[];
}

export interface PieChartDataset<TData = number> extends DeepPartial<PieControllerDatasetOptions> {
  type: 'pie';
  data: TData[];
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderAlign?: 'center' | 'inner';
  hoverOffset?: number;
  circumference?: number;
  rotation?: number;
}

export interface DoughnutChartDataset<TData = number> extends DeepPartial<DoughnutControllerDatasetOptions> {
  type: 'doughnut';
  data: TData[];
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderAlign?: 'center' | 'inner';
  hoverOffset?: number;
  circumference?: number;
  rotation?: number;
  cutout?: number | string;
}

export interface PolarAreaChartDataset<TData = number> extends DeepPartial<PolarAreaControllerDatasetOptions> {
  type: 'polarArea';
  data: TData[];
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  borderAlign?: 'center' | 'inner';
  hoverOffset?: number;
}

export interface RadarChartDataset<TData = number> extends DeepPartial<RadarControllerDatasetOptions> {
  type: 'radar';
  data: TData[];
  label?: string;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  pointBackgroundColor?: string | string[];
  pointBorderColor?: string | string[];
  pointBorderWidth?: number | number[];
  pointRadius?: number | number[];
  pointHoverRadius?: number | number[];
  pointHitRadius?: number | number[];
  fill?: boolean;
  lineTension?: number;
}

export type AnyChartDataset =
  | BarChartDataset
  | LineChartDataset
  | ScatterChartDataset
  | BubbleChartDataset
  | PieChartDataset
  | DoughnutChartDataset
  | PolarAreaChartDataset
  | RadarChartDataset;

export type ChartDatasetByType<TType extends ChartTypeLiteral> =
  TType extends 'bar' ? BarChartDataset :
  TType extends 'line' ? LineChartDataset :
  TType extends 'scatter' ? ScatterChartDataset :
  TType extends 'bubble' ? BubbleChartDataset :
  TType extends 'pie' ? PieChartDataset :
  TType extends 'doughnut' ? DoughnutChartDataset :
  TType extends 'polarArea' ? PolarAreaChartDataset :
  TType extends 'radar' ? RadarChartDataset :
  never;

export interface ChartDataByType<TType extends ChartTypeLiteral, TLabel = string> {
  labels?: TLabel[];
  datasets: ChartDatasetByType<TType>[];
}

export function isChartConfigurationWithType<TType extends ChartTypeLiteral>(
  config: ChartConfiguration<TType> | ChartConfigurationCustomTypesPerDataset<TType>
): config is ChartConfiguration<TType> {
  return 'type' in config;
}

export function createBarDataset(data: (number | [number, number])[], label: string, options?: Partial<BarChartDataset>): BarChartDataset {
  return {
    type: 'bar',
    label,
    data,
    ...options,
  };
}

export function createLineDataset(data: (ScatterDataPoint | number)[], label: string, options?: Partial<LineChartDataset>): LineChartDataset {
  return {
    type: 'line',
    label,
    data,
    ...options,
  };
}

export function createScatterDataset(data: ScatterDataPoint[], label: string, options?: Partial<ScatterChartDataset>): ScatterChartDataset {
  return {
    type: 'scatter',
    label,
    data,
    ...options,
  };
}

export function createBubbleDataset(data: BubbleDataPoint[], label: string, options?: Partial<BubbleChartDataset>): BubbleChartDataset {
  return {
    type: 'bubble',
    label,
    data,
    ...options,
  };
}

export function createPieDataset(data: number[], label: string, options?: Partial<PieChartDataset>): PieChartDataset {
  return {
    type: 'pie',
    label,
    data,
    ...options,
  };
}

export function createDoughnutDataset(data: number[], label: string, options?: Partial<DoughnutChartDataset>): DoughnutChartDataset {
  return {
    type: 'doughnut',
    label,
    data,
    ...options,
  };
}

export function createPolarAreaDataset(data: number[], label: string, options?: Partial<PolarAreaChartDataset>): PolarAreaChartDataset {
  return {
    type: 'polarArea',
    label,
    data,
    ...options,
  };
}

export function createRadarDataset(data: number[], label: string, options?: Partial<RadarChartDataset>): RadarChartDataset {
  return {
    type: 'radar',
    label,
    data,
    ...options,
  };
}