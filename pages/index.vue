<style scoped>
.bar {
  border-radius: 0.2em;
  position: unset !important;
  margin-bottom: 1em;
}
</style>

<template>
  <v-app theme="mdi-weather-night">
    <v-container fluid class="fg-surface-variant h-100">
      <v-app-bar
        class="bar"
        :title="
          'Wolfram Chart Viewer' +
          (chartData.activeDataset?.shortenedQuery
            ? ' - ' + chartData.activeDataset?.shortenedQuery
            : '')
        "
      ></v-app-bar>
      <v-row gap="16" size="5">
        <v-col cols="4">
          <!-- ChartJS goes here! -->
          <v-card :elevation="3" height="100%">
            <chart-js-wrapper :config="chartData.activeDataset?.dataset" />
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
                  <v-textarea
                    label="I'm an AI with an MCP server! Ask me in plain english!"
                    variant="solo"
                    :disabled="boxDisabled"
                    @keydown="queryWolfram"
                    v-model="query"
                  />
                </v-sheet>

                <data-iterator
                  :items="coll.entries"
                  :active-dataset="chartData.activeDataset"
                  @set-active-dataset="chartData.setActiveDataset"
                />
              </v-tabs-window-item>
            </v-tabs-window>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <OpenrouterWarningSnackbar />
  </v-app>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false });
const tab = ref("wolfram-queries");
const query = ref(
  "calories of apple, orange, strawberry, grape, dragon fruit (make it a donut graph)",
);
const chartData = useChartData();
const boxDisabled = ref(false);

if (!chartData.collections.length) {
  chartData.initializeCollections([
    // Wolfram queries - doesn't need to have anything pre-filled
    {
      name: "Wolfram Queries",
      queriable: true,
      entries: [],
    },

    // On the other hand, static information should get filled in
    {
      name: "Static",
      queriable: false,
      entries: [],
    },
  ]);
}

async function queryWolfram(evt: KeyboardEvent): Promise<void> {
  // Don't spam the AI and take all the tokens! (That's not very nice...)
  if (boxDisabled.value) return;

  // Ignore all keystrokes until enter
  if (!(evt.key == "Enter" && !evt.shiftKey)) return;

  boxDisabled.value = true;

  const finsishedDataset = await chartData.queryNewDatset(
    (evt.target as HTMLTextAreaElement).value,
  );

  // Reset the textbox value
  query.value = "";

  // And then finally, set this as the active dataset so we can see the resulting data!
  if (finsishedDataset) {
    chartData.setActiveDataset(finsishedDataset);
  }
  boxDisabled.value = false;
}

// If the tab itself changes, se the active collection
watch(tab, (newTab) => {
  const selected = chartData.collections.find(
    (c) => c.name.toLowerCase().replaceAll(" ", "-") === newTab,
  );
  chartData.setActiveCollection(selected ?? null);
});

// Mount the stastic JSON data
onMounted(async () => {
  try {
    const data: ChartDataDTO[] = await $fetch("/static-chart-data.json");
    const staticCollection = chartData.collections.find(
      (c) => c.name === "Static",
    );
    if (staticCollection) {
      staticCollection.entries = data;
    }
  } catch (e) {
    console.error("Failed to load static chart data:", e);
  }
});
</script>
