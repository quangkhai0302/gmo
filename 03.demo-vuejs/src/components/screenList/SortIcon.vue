<template>
  <span class="sl-sort-icon">
    <i v-if="!isActive" class="pi pi-sort-alt sl-sort-icon--inactive"></i>
    <i v-else-if="sort.order === 'asc'" class="pi pi-sort-amount-up sl-sort-icon--active"></i>
    <i v-else class="pi pi-sort-amount-down sl-sort-icon--active"></i>
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
  font-size: 0.75rem;
}

.sl-sort-icon--inactive {
  color: #9ca3af;
}

.sl-sort-icon--active {
  color: #4f46e5;
}
</style>
