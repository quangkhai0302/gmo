<template>
  <div class="pagination" v-if="totalPages > 0">
    <div class="pagination__controls">
      <button class="page-btn page-btn--nav" :disabled="currentPage === 1"
        @click="$emit('changePage', 1)" title="First page">
        <i class="pi pi-angle-double-left"></i>
      </button>
      <button class="page-btn page-btn--nav" :disabled="currentPage === 1"
        @click="$emit('changePage', currentPage - 1)" title="Previous page">
        <i class="pi pi-angle-left"></i>
      </button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="page-dots">···</span>
        <button v-else
          :class="['page-btn', { 'page-btn--active': page === currentPage }]"
          @click="$emit('changePage', page as number)">
          {{ page }}
        </button>
      </template>

      <button class="page-btn page-btn--nav" :disabled="currentPage === totalPages"
        @click="$emit('changePage', currentPage + 1)" title="Next page">
        <i class="pi pi-angle-right"></i>
      </button>
      <button class="page-btn page-btn--nav" :disabled="currentPage === totalPages"
        @click="$emit('changePage', totalPages)" title="Last page">
        <i class="pi pi-angle-double-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  currentPage: number
  totalItems: number
  pageSize: number
}>()
defineEmits<{ changePage: [page: number] }>()

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize))

const visiblePages = computed((): (number | '...')[] => {
  const total = totalPages.value, current = props.currentPage, delta = 2
  const pages: (number | '...')[] = []
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); return pages }
  pages.push(1)
  const left = Math.max(2, current - delta), right = Math.min(total - 1, current + delta)
  if (left > 2) pages.push('...')
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push('...')
  pages.push(total)
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  border-top: 1px solid var(--color-border-light);
  flex-wrap: wrap;
  gap: 10px;
  background: var(--color-surface-card);
}

.pagination__controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-card);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-bounce);
  font-family: var(--font-family);
}

.page-btn:hover:not(:disabled):not(.page-btn--active) {
  background: var(--color-primary-bg);
  border-color: rgba(43, 168, 162, 0.3);
  color: var(--color-primary-dark);
}

.page-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-on-primary);
  box-shadow: var(--shadow-teal-glow);
}

.page-btn--active:hover {
  background: var(--color-primary-dark);
}

.page-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.page-dots {
  padding: 0 6px;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  height: 36px;
}
</style>
