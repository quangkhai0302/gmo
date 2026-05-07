<template>
  <div class="sl-pagination" v-if="totalPages > 0">
    <div class="sl-pagination__controls">
      <button class="sl-page-btn sl-page-btn--nav" :disabled="currentPage === 1"
        @click="$emit('changePage', 1)" title="First page">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>
        </svg>
      </button>
      <button class="sl-page-btn sl-page-btn--nav" :disabled="currentPage === 1"
        @click="$emit('changePage', currentPage - 1)" title="Previous page">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="sl-page-dots">···</span>
        <button v-else
          :class="['sl-page-btn', { 'sl-page-btn--active': page === currentPage }]"
          @click="$emit('changePage', page as number)">
          {{ page }}
        </button>
      </template>

      <button class="sl-page-btn sl-page-btn--nav" :disabled="currentPage === totalPages"
        @click="$emit('changePage', currentPage + 1)" title="Next page">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <button class="sl-page-btn sl-page-btn--nav" :disabled="currentPage === totalPages"
        @click="$emit('changePage', totalPages)" title="Last page">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>
        </svg>
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
.sl-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  border-top: 1px solid #f3f4f6;
  flex-wrap: wrap;
  gap: 10px;
  background: #ffffff;
}

.sl-pagination__controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sl-page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
  font-family: inherit;
}
.sl-page-btn:hover:not(:disabled):not(.sl-page-btn--active) {
  background: #eef2ff;
  border-color: #a5b4fc;
  color: #4f46e5;
}
.sl-page-btn--active {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}
.sl-page-btn--active:hover { background: #4338ca; }
.sl-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.sl-page-dots {
  padding: 0 6px;
  color: #d1d5db;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  height: 36px;
}
</style>
