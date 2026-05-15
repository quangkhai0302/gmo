<template>
  <span class="sort-icon">
    <i v-if="!isActive" class="pi pi-sort-alt sort-icon--inactive"></i>
    <i v-else-if="sort.order === 'asc'" class="pi pi-sort-amount-up sort-icon--active"></i>
    <i v-else class="pi pi-sort-amount-down sort-icon--active"></i>
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
.sort-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.sort-icon--inactive {
  color: var(--color-text-muted);
  opacity: 0.5;
  transition: opacity var(--transition-fast);
}

.sort-icon--active {
  color: var(--color-primary);
}
</style>
