<template>
  <v-data-iterator
    :items="props.items"
    item-value="shortenedQuery"
    :items-per-page="-1"
  >
    <template v-slot:default="{ items, isExpanded, toggleExpand }">
      <v-row>
        <v-col v-for="item in items" :key="item.raw.shortenedQuery" cols="12">
          <v-skeleton-loader
            class="border"
            :type="['image', 'heading', 'text']"
            :loading="item.raw.loading"
            v-if="item.raw.loading"
          ></v-skeleton-loader>

          <v-card
            :variant="props.activeDataset === item.raw ? 'tonal' : 'elevated'"
            class="cursor-pointer"
            @click="props.onSetActiveDataset(item.raw)"
            v-else
          >
            <v-card-title class="d-flex align-center">
              <v-icon
                color="primary"
                icon="mdi-chart-box"
                size="18"
                start
              ></v-icon>
              <h4 class="my-0 text-body-1 font-weight-medium">
                {{ item.raw.shortenedQuery }}
              </h4>
            </v-card-title>

            <v-card-text>
              {{ item.raw.query }}
            </v-card-text>

            <div class="px-4">
              <v-switch
                :label="`${isExpanded(item as any) ? 'Hide' : 'Show'} details`"
                :model-value="isExpanded(item as any)"
                density="compact"
                inset
                @click.stop="() => toggleExpand(item as any)"
              >
              </v-switch>
            </div>

            <v-divider></v-divider>

            <v-expand-transition>
              <div v-if="isExpanded(item as any)">
                <v-list :lines="false" density="compact">
                  <v-list-item
                    :title="`Type: ${item.raw.dataset?.type}`"
                  ></v-list-item>
                  <v-list-item
                    v-if="item.raw.toolCallsUsed"
                    :title="`Tool Calls Used: ${item.raw.toolCallsUsed}`"
                  ></v-list-item>
                  <v-list-item
                    :title="`Labels: ${item.raw.dataset?.data.labels?.join(', ')}`"
                  ></v-list-item>
                  <v-list-item
                    v-for="(dataset, index) in item.raw.dataset?.data.datasets"
                    :key="index"
                    :title="`Dataset ${index + 1}: ${dataset.label || 'Unlabeled'}`"
                  >
                  </v-list-item>
                </v-list>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
import type { ChartDataDTO } from "~/utils/chart-schemas";
import type { ChartDataSkeleton } from "~/utils/use-chart-data.interface";

interface DataIteratorProps {
  items: (ChartDataDTO | ChartDataSkeleton)[];
  activeDataset: ChartDataDTO | null;
  onSetActiveDataset: (dataset: ChartDataDTO) => void;
}

const props = withDefaults(defineProps<DataIteratorProps>(), {
  items: () => [],
  activeDataset: null,
  onSetActiveDataset: () => {},
});
</script>
