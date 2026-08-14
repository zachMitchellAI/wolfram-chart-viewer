import type {
  ChartConfiguration,
  ChartTypeLiteral,
} from "./chart-types.interface";

export interface Collection {
  name: string;
  queriable: boolean;
  entries: ChartDataDTO[];
}

// This should either be returned by an api call, or manually configured in the context of static entries
export interface ChartDataDTO {
  query: string;
  loading?: boolean;
  shortenedQuery: string;
  dataset?: ChartConfiguration<ChartTypeLiteral>;
}

// Initial state for pinia
export interface ChartDataState {
  collections: Collection[];
  activeDataset: ChartDataDTO | null;
  activeCollection: Collection | null;
}
