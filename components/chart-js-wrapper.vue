<template>
  <canvas ref="chart-ref" :id="id ?? undefined"></canvas>
</template>

<script setup lang="ts">
interface ChartJSWrapperProps {
  id?: string;
  config?: ChartConfiguration;
}
import { onMounted, useTemplateRef, watch } from "vue";
import { Chart } from "chart.js/auto";

const props = withDefaults(defineProps<ChartJSWrapperProps>(), {
  config: () =>
    ({
      type: "bar",
      data: {
        labels: ["alpha", "beta", "gamma", "theta"],
        datasets: [
          {
            label: "Default Placeholder Data",
            data: [1, 2, 3, 4],
            backgroundColor: "#FFFA",
            borderWidth: 1,
          },
        ],
      },
    }) as ChartConfiguration,
});

const chartRef = useTemplateRef<HTMLCanvasElement>("chart-ref");
let chartInstance: Chart | null = null;

function renderChart() {
  if (!chartRef.value || !props.config) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  // @ts-ignore - The types absolutely work, but chartjs extremely dynamic and recursive.
  chartInstance = new Chart(chartRef.value, props.config);
}

onMounted(renderChart);

watch(
  () => props.config,
  (_newConfig) => {
    renderChart();
  },
);
</script>
