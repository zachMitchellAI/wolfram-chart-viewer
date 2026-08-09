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
              <chart-js-wrapper :config="chartData.activeDataset?.dataset"/>
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

                <!-- Implementation of the the card was done by kimi k2.7 by giving it this template: https://vuetifyjs.com/en/components/data-iterators/#guide -->
                <v-data-iterator
                  :items="coll.entries"
                  item-value="shortenedQuery"
                >
                  <template v-slot:default="{ items, isExpanded, toggleExpand }">
                    <v-row>
                      <v-col
                        v-for="item in items"
                        :key="item.raw.shortenedQuery"
                        cols="12"
                      >
                        <v-card
                          :variant="chartData.activeDataset === item.raw ? 'tonal' : 'elevated'"
                          class="cursor-pointer"
                          @click="chartData.setActiveDataset(item.raw)"
                        >
                          <v-card-title class="d-flex align-center">
                            <v-icon
                              color="primary"
                              icon="mdi-chart-box"
                              size="18"
                              start
                            ></v-icon>

                            <h4 class="my-0 text-body-1 font-weight-medium">{{ item.raw.shortenedQuery }}</h4>
                          </v-card-title>

                          <v-card-text>
                            {{ item.raw.query }}
                          </v-card-text>

                          <div class="px-4">
                            <v-switch
                              :label="`${isExpanded(item) ? 'Hide' : 'Show'} details`"
                              :model-value="isExpanded(item)"
                              density="compact"
                              inset
                              @click.stop="() => toggleExpand(item)"
                            ></v-switch>
                          </div>

                          <v-divider></v-divider>

                          <v-expand-transition>
                            <div v-if="isExpanded(item)">
                              <v-list :lines="false" density="compact">
                                <v-list-item :title="`Type: ${item.raw.dataset.type}`"></v-list-item>
                                <v-list-item :title="`Labels: ${item.raw.dataset.data.labels?.join(', ')}`"></v-list-item>
                                <v-list-item
                                  v-for="(dataset, index) in item.raw.dataset.data.datasets"
                                  :key="index"
                                  :title="`Dataset ${index + 1}: ${dataset.label || 'Unlabeled'}`"
                                ></v-list-item>
                              </v-list>
                            </div>
                          </v-expand-transition>
                        </v-card>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>

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

// {collections, activeCollection, activeDataset, initializeCollections, setActiveCollection, setActiveDataset} 

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

watch(tab, (newTab) => {
  const selected = chartData.collections.find(
    c => c.name.toLowerCase().replaceAll(' ', '-') === newTab
  );
  chartData.setActiveCollection(selected ?? null);
});

onMounted(async () => {
  try {
    const data = await $fetch('/static-chart-data.json')
    const staticCollection = chartData.collections.find(c => c.name === 'Static')
    if (staticCollection) {
      staticCollection.entries = data
    }
  } catch (e) {
    console.error('Failed to load static chart data:', e)
  }
})
</script>
