<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue';
import { Chart } from 'chart.js/auto';
import { type ChartConfiguration, type ChartTypeLiteral, isChartConfigurationWithType } from '~/utils/chart-types.interface';

interface Props {
  id?: string;
  config?: ChartConfiguration<ChartTypeLiteral>;
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    type: 'bar',
    data: {
      labels: ['alpha', 'beta', 'gamma', 'theta'],
      datasets: [{
        label: 'Default Placeholder Data',
        data: [1,2,3,4],
        backgroundColor: '#FFFA',
        borderWidth: 1,
      }],
    },
  }) as ChartConfiguration<ChartTypeLiteral>,
});

const chartRef = useTemplateRef<HTMLCanvasElement>('chart-ref');
let chartInstance: Chart | null = null;

function renderChart() {
  if (!chartRef.value) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  // console.warn("rendering the thing...", props.config);

  chartInstance = new Chart(chartRef.value, {...props.config});
}

onMounted(renderChart);

watch(
  () => props.config,
  (newConfig) => {
    console.warn("updating the thing", newConfig);
    if (!chartInstance) return;

    if (
      newConfig &&
      isChartConfigurationWithType(chartInstance.config) &&
      isChartConfigurationWithType(newConfig) &&
      chartInstance.config.type !== newConfig.type
    ) {
      renderChart();
      return;
    }

    chartInstance.update();
  },
  // { deep: true },
);
</script>

<template>
  <canvas ref="chart-ref" :id="id ?? undefined"></canvas>
</template>
