<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from "vue";
import { Chart } from "chart.js/auto";

interface Props {
  id?: string;
  config?: ChartConfiguration<ChartTypeLiteral>;
}

const props = withDefaults(defineProps<Props>(), {
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
    }) as ChartConfiguration<ChartTypeLiteral>,
});

const chartRef = useTemplateRef<HTMLCanvasElement>("chart-ref");
let chartInstance: Chart | null = null;

function renderChart() {
  if (!chartRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  // console.warn("rendering the thing...", props.config);

  chartInstance = new Chart(chartRef.value, { ...props.config });
}

onMounted(renderChart);

watch(
  () => props.config,
  (_newConfig) => {
    renderChart();
  },
);
</script>

<template>
  <canvas ref="chart-ref" :id="id ?? undefined"></canvas>
</template>
