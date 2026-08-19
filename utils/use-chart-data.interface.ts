import { type ChartDataDTO } from "./chart-schemas";

export interface Loading {
  loading: boolean;
}

export interface Collection {
  name: string;
  queriable: boolean;
  entries: Array<ChartDataDTO | Loading>;
}

// Initial state for pinia
export interface ChartDataState {
  collections: Collection[];
  activeDataset: ChartDataDTO | null;
  activeCollection: Collection | null;
}
