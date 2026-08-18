<template>
  <v-sheet elevation="2">
    <v-tabs color="primary" v-model="tab">
      <v-tab
        v-for="coll in chartData.collections"
        :key="coll.name"
        :value="slug(coll.name)"
      >
        {{ coll.name }}
      </v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        v-for="coll in chartData.collections"
        :key="coll.name"
        :value="slug(coll.name)"
      >
        <v-sheet class="pa-5" v-if="coll.queriable">
          <prompt-box />
        </v-sheet>

        <data-iterator
          :items="coll.entries"
          :active-dataset="chartData.activeDataset"
          @set-active-dataset="chartData.setActiveDataset"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import type { Collection } from "~/utils/use-chart-data.interface";

const chartData = useChartData();
const tab = ref("");

function slug(name: string): string {
  return name.toLowerCase().replaceAll(" ", "-");
}

watch(tab, (newTab) => {
  const selected = (chartData.collections as Collection[]).find(
    (c) => slug(c.name) === newTab,
  );
  chartData.setActiveCollection(selected ?? null);
});

watch(
  () => chartData.activeCollection?.name,
  (name) => {
    if (name) tab.value = slug(name);
  },
  { immediate: true },
);
</script>
