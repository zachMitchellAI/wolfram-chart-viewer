<style scoped>
.bar {
  border-radius: 0.2em;
  position: unset !important;
  margin-bottom: 1em;
}
</style>

<template>
  <v-app-bar class="bar" :title="computedTitle"></v-app-bar>
</template>

<script setup lang="ts">
import type { AppTitleBarProps } from "./app-title-bar.interface";

const props = defineProps<AppTitleBarProps>();

const computedTitle = computed(() => {
  const base = "Wolfram Chart Viewer";
  const subtitle = props.activeDataset?.shortenedQuery;
  return subtitle ? `${base} - ${subtitle}` : base;
});
</script>
