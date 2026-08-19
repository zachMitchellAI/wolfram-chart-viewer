import { defineStore } from "pinia";
import type {
  Collection,
  ChartDataState,
  ChartDataSkeleton,
} from "./use-chart-data.interface";
import { type ChartDataDTO } from "./chart-schemas";

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
      this.activeCollection = collection;
    },

    setActiveDataset(dataset: ChartDataDTO | null) {
      this.activeDataset = dataset;
    },

    async queryNewDataset(query: string) {
      // A fake dataset until we get a query back from wolfram.
      const skeletonDataset = {
        loading: true,
      } as ChartDataSkeleton;

      this.activeCollection?.entries.push(skeletonDataset);

      const response = await fetch(
        `/api/ask-wolfram?q=${encodeURIComponent(query)}`,
      );
      const data = JSON.parse(await response.text());

      // @ts-ignore
      if (!data["message"]) {
        // console.log(data);
        // Our data is ready & ripe for the taking:
        this.activeCollection?.entries.pop();
        this.activeCollection?.entries.push(data);
        return data;
      }

      // Error case: remove skeleton and return null so caller doesn't set active dataset
      this.activeCollection?.entries.pop();
      return null;
    },

    initializeCollections(newCollections: Collection[]) {
      this.collections.push(...newCollections);

      if (!this.activeCollection && this.collections[0]) {
        this.activeCollection = this.collections[0];
      }
    },
  },
});
