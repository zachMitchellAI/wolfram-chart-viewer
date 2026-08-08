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
      <v-app-bar class="bar" title="Wolfram Chart Viewer"></v-app-bar>
      <v-row gap="16" size="5">
        <v-col cols="4">
            <!-- ChartJS goes here! -->
            <v-card :elevation="3">
              <chart-js-wrapper/>
            </v-card>
        </v-col>
        
        <!-- tabs for selecting data types -->
        <v-col cols="1">
          <v-sheet elevation="2">
            <v-tabs color="primary" v-model="tab">
              <v-tab value="wolfram-queries">Wolfram Queries{{ activeDataset ? " - " + activeDataset.shortenedQuery : "" }}</v-tab>
              <v-tab value="static">Static</v-tab>
            </v-tabs>
  
            <v-divider></v-divider>
  
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="wolfram-queries">
                <v-sheet class="pa-5">
                  <v-textarea label="I'm an AI with an MCP server! Ask me in plain english!" variant="solo" v-model="query"/>
                </v-sheet>
              </v-tabs-window-item>
              <v-tabs-window-item value="static">
                <v-sheet class="pa-5" color="orange">Two</v-sheet>
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
const {collections, activeCollection, activeDataset} = useChartData();
</script>
