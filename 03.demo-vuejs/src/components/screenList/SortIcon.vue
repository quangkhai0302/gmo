<template>
  <span class="sl-sort-icon">
    <svg v-if="!isActive" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
      <path d="M7 15l5 5 5-5M7 9l5-5 5 5"/>
    </svg>
    <svg v-else-if="sort.order === 'asc'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5">
      <path d="M12 5v14M5 12l7 7 7-7"/>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SortState, Student } from '../../types/student'

const props = defineProps<{ field: keyof Student; sort: SortState }>()

const isActive = computed(
  () => props.sort.field === props.field && props.sort.order !== null
)
</script>

<style scoped>
.sl-sort-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
</style>
