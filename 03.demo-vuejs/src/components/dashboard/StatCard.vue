<template>
  <article class="stat-card">
    <div class="stat-card__icon">
      <i :class="icon"></i>
    </div>
    <div class="stat-card__content">
      <span>{{ label }}</span>
      <strong>{{ value }}</strong>
      <small :class="{ 'stat-card__trend--down': trendDown }">
        <i :class="trendDown ? 'pi pi-arrow-down-right' : 'pi pi-arrow-up-right'"></i>
        {{ trend }}
      </small>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  trend: string
  icon: string
  trendDown?: boolean
}>()
</script>

<style scoped>
.stat-card {
  min-height: 132px;
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
  padding: var(--space-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.stat-card__icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: var(--color-primary-subtle);
  color: var(--color-primary-hover);
  font-size: 18px;
  flex: 0 0 auto;
}

.stat-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 0;
}

.stat-card__content span {
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
}

.stat-card__content strong {
  color: var(--color-text);
  font-size: 28px;
  line-height: 1.15;
  letter-spacing: 0;
}

.stat-card__content small {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #16a34a;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.stat-card__trend--down {
  color: var(--color-danger) !important;
}
</style>
