<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import {
  Chart,
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  id?: string;
  type?: 'bar' | 'line' | 'pie' | 'doughnut';
  labels?: string[];
  data?: number[];
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'bar',
  labels: () => ['this', 'is', 'a', 'test'],
  data: () => [1, 2, 3, 4],
  label: 'something',
});

const chartRef = useTemplateRef<HTMLCanvasElement>('chart-ref');
let chartInstance: Chart | null = null;

function renderChart() {
  if (!chartRef.value) return;
  
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  chartInstance = new Chart(chartRef.value, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [{
        label: props.label,
        data: props.data,
        borderWidth: 1,
      }],
    },
  });
}

onMounted(renderChart);
</script>

<template>
    <canvas ref="chart-ref" :id="id ?? undefined"></canvas>
</template>