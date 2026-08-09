<style scoped>
.bar{
  border-radius: .2em;
  position: unset !important;
  margin-bottom: 1em;
}
</style>

<template>
  <v-app theme="mdi-weather-night">
    <v-container fluid class="fg-surface-variant h-100">
      <v-app-bar class="bar" :title="'Wolfram Chart Viewer' + (chartData.activeDataset?.shortenedQuery ? ' - ' + chartData.activeDataset?.shortenedQuery : '')"></v-app-bar>
      <v-row gap="16" size="5">
        <v-col cols="4">
            <!-- ChartJS goes here! -->
            <v-card :elevation="3" height="100%">
              <chart-js-wrapper :config="chartData.activeDataset"/>
            </v-card>
        </v-col>
        
        <!-- tabs for selecting data types -->
        <v-col cols="1">
          <v-sheet elevation="2">
            <v-tabs color="primary" v-model="tab">
              <v-tab
                v-for="coll in chartData.collections"
                :value="coll.name.toLowerCase().replaceAll(' ', '-')"
              >
                {{ coll.name }}
              </v-tab>
            </v-tabs>
  
            <v-divider></v-divider>
  
            <v-tabs-window v-model="tab">

              <v-tabs-window-item 
                v-for="coll in chartData.collections"
                :key="coll.name"
                :value="coll.name.toLowerCase().replaceAll(' ', '-')"
              >
                <v-sheet class="pa-5" v-if="coll.queriable">
                  <v-textarea label="I'm an AI with an MCP server! Ask me in plain english!" variant="solo" v-model="query"/>
                </v-sheet>

              </v-tabs-window-item>

            </v-tabs-window>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <OpenrouterWarningSnackbar/>
  </v-app>
</template>

<script setup>
const tab = ref('wolfram-queries');
const query = ref('How expensive is gas between Torronto, and Honalulu Hawaii?');
const chartData = useChartData();

// {collections, activeCollection, activeDataset, initializeCollections, setActiveDataset} 

if(!chartData.collections.length){
  chartData.initializeCollections([
    // Wolfram queries - doesn't need to have anything pre-filled
    {
      name: "Wolfram Queries",
      queriable: true,
      entries:[]
    },

    // On the other hand, static information should get filled in
    {
      name: "Static",
      queriable: false,
      entries:[]
    },
  ])
}

// watch(()=>chartData.activeDataset, (newDataset)=>{
//   console.warn('eyoooooo', newDataset);
// })

onMounted(async () => {
  try {
    const data = await $fetch('/static-chart-data.json')
    const staticCollection = chartData.collections.find(c => c.name === 'Static')
    if (staticCollection) {
      staticCollection.entries = data
    }

    chartData.setActiveDataset(chartData.collections[1].entries[0].dataset);
  } catch (e) {
    console.error('Failed to load static chart data:', e)
  }
})
</script>
