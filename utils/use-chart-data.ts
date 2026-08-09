import { defineStore } from 'pinia';

interface Collection {
    name: string,
    queriable: boolean,
    entries: ChartDataDTO[]
}

// This should either be returned by an api call, or manually configured in the context of static entries
interface ChartDataDTO {
    query: string,
    shortenedQuery: string,
    dataset: ChartConfiguration<ChartTypeLiteral>
}

// Initial state for pinia
interface ChartDataState {
    collections: Collection[],
    activeDataset: ChartDataDTO | null,
    activeCollection: Collection | null
}

export const useChartData = defineStore('chart-data', {
    state:() => {
        const stateDraft = {
        collections:[],
        activeCollection: null,
        activeDataset: null
        } as ChartDataState;

        if(stateDraft.collections[0]){
            stateDraft.activeCollection = stateDraft.collections[0];
        }
        
        return stateDraft;
    },
    actions:{
        setActiveDataset(dataset: ChartDataDTO){
            //@ts-ignore
            this.activeDataset = dataset;
        },

        initializeCollections(newCollections: Collection[]){
            this.collections.push(...newCollections);
        }
    }
});