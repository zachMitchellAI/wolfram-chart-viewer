<template>
  <v-sheet class="pa-5">
    <v-textarea
      :label="placeholder"
      variant="solo"
      :disabled="boxDisabled"
      v-model="query"
      @keydown.enter.exact="submit"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import type { PromptBoxProps } from "./prompt-box.interface";

const props = withDefaults(defineProps<PromptBoxProps>(), {
  placeholder: "I'm an AI with an MCP server! Ask me in plain english!",
});

const chartData = useChartData();
const query = ref("");
const boxDisabled = ref(false);

async function submit(): Promise<void> {
  if (boxDisabled.value || !query.value.trim()) return;

  boxDisabled.value = true;

  const finishedDataset = await chartData.queryNewDataset(query.value);

  query.value = "";

  if (finishedDataset) {
    chartData.setActiveDataset(finishedDataset);
    console.log("active dataset", chartData.activeDataset);
  }

  boxDisabled.value = false;
}
</script>
