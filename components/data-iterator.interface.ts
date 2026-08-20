import type { ChartDataDTO } from "~/utils/chart-schemas";
import type { ChartDataSkeleton } from "~/utils/use-chart-data.interface";

export interface DataIteratorProps {
  items: (ChartDataDTO | ChartDataSkeleton)[];
  activeDataset: ChartDataDTO | null;
  onSetActiveDataset: (dataset: ChartDataDTO) => void;
}
