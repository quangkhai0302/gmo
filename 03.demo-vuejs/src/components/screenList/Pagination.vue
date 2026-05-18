<template>
  <div class="pagination" v-if="totalPages > 0">
    <p class="pagination__summary">
      Hiển thị <strong>{{ startItem }}-{{ endItem }}</strong> trên <strong>{{ totalItems }}</strong> hồ sơ
    </p>

    <div class="pagination__controls">
      <button class="page-btn" :disabled="currentPage === 1" title="Trang đầu" @click="$emit('changePage', 1)">
        <i class="pi pi-angle-double-left"></i>
      </button>
      <button class="page-btn" :disabled="currentPage === 1" title="Trang trước" @click="$emit('changePage', currentPage - 1)">
        <i class="pi pi-angle-left"></i>
      </button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="page-dots">...</span>
        <button v-else :class="['page-btn', { 'page-btn--active': page === currentPage }]" @click="$emit('changePage', page as number)">
          {{ page }}
        </button>
      </template>

      <button class="page-btn" :disabled="currentPage === totalPages" title="Trang sau" @click="$emit('changePage', currentPage + 1)">
        <i class="pi pi-angle-right"></i>
      </button>
      <button class="page-btn" :disabled="currentPage === totalPages" title="Trang cuối" @click="$emit('changePage', totalPages)">
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
const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1)
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems))

const visiblePages = computed((): (number | '...')[] => {
  const total = totalPages.value
  const current = props.currentPage
  const pages: (number | '...')[] = []

  if (total <= 7) {
    for (let index = 1; index <= total; index += 1) pages.push(index)
    return pages
  }

  pages.push(1)
  const left = Math.max(2, current - 2)
  const right = Math.min(total - 1, current + 2)
  if (left > 2) pages.push('...')
  for (let index = left; index <= right; index += 1) pages.push(index)
  if (right < total - 1) pages.push('...')
  pages.push(total)
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.pagination__summary {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.pagination__summary strong {
  color: var(--color-text);
}

.pagination__controls {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover:not(:disabled):not(.page-btn--active) {
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.page-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: #ffffff;
}

.page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-dots {
  min-width: 28px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

@media (max-width: 720px) {
  .pagination {
    align-items: stretch;
    flex-direction: column;
  }

  .pagination__controls {
    overflow-x: auto;
    padding-bottom: 2px;
  }
}
</style>
