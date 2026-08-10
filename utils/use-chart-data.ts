import type {
  ChartConfiguration,
  ChartTypeLiteral,
} from "./chart-types.interface";
import { defineStore } from "pinia";

interface Collection {
  name: string;
  queriable: boolean;
  entries: ChartDataDTO[];
}

// This should either be returned by an api call, or manually configured in the context of static entries
interface ChartDataDTO {
  query: string;
  loading?: boolean;
  shortenedQuery: string;
  dataset?: ChartConfiguration<ChartTypeLiteral>;
}

// Initial state for pinia
interface ChartDataState {
  collections: Collection[];
  activeDataset: ChartDataDTO | null;
  activeCollection: Collection | null;
}

export const useChartData = defineStore("chart-data", {
  state: () => {
    const stateDraft = {
      collections: [],
      activeCollection: null,
      activeDataset: null,
    } as ChartDataState;

    if (stateDraft.collections[0]) {
      stateDraft.activeCollection = stateDraft.collections[0];
    }

    return stateDraft;
  },
  actions: {
    setActiveCollection(collection: Collection | null) {
      //@ts-ignore
      this.activeCollection = collection;
    },

    setActiveDataset(dataset: ChartDataDTO | null) {
      //@ts-ignore
      this.activeDataset = dataset;
    },

    async queryNewDatset(query: string) {
      // A fake dataset until we get a query back from wolfram.
      const skeletonDataset = {
        loading: true,
      } as ChartDataDTO;

      this.activeCollection?.entries.push(skeletonDataset);

      const data = JSON.parse(
        await (await fetch(`/api/ask-wolfram?q=${query}`)).text(),
      );

      // @ts-ignore
      if (!data["message"]) {
        // console.log(data);
        // Our data is ready & ripe for the taking:
        this.activeCollection?.entries.pop();
        this.activeCollection?.entries.push(data);
      }

      return data;
    },

    initializeCollections(newCollections: Collection[]) {
      this.collections.push(...newCollections);

      if (!this.activeCollection && newCollections[0]) {
        this.activeCollection = newCollections[0];
      }
    },
  },
});
