import { defineStore } from 'pinia';

interface ChartDataDTO {
    query: string,
    shortenedQuery: string,
    dataset: ChartConfiguration<ChartTypeLiteral>
}

interface ChartDataState {
    collections: Array<ChartConfiguration<ChartTypeLiteral>>,
    activeDataset: ChartDataDTO | null,
    activeCollection: ChartConfiguration<ChartTypeLiteral> | null
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
            this.activeDataset = dataset;
        }
    }
});