<template>
  <DashboardLayout :title="pageTitle" :breadcrumb="pageTitle">
    <section class="placeholder-panel">
      <div class="placeholder-panel__icon">
        <i :class="icon"></i>
      </div>
      <div>
        <h2>{{ pageTitle }}</h2>
        <p>Không gian này có thể triển khai danh sách, biểu mẫu, phân quyền và báo cáo chi tiết theo đúng module nghiệp vụ.</p>
      </div>
      <RouterLink class="app-button app-button--primary" to="/students">
        <i class="pi pi-users"></i>
        Quản lý sinh viên
      </RouterLink>
    </section>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const route = useRoute()

const titles: Record<string, { title: string; icon: string }> = {
  '/classes': { title: 'Lớp học', icon: 'pi pi-building-columns' },
  '/subjects': { title: 'Môn học', icon: 'pi pi-book' },
  '/reports': { title: 'Báo cáo', icon: 'pi pi-chart-bar' },
  '/settings': { title: 'Cài đặt', icon: 'pi pi-cog' },
}

const pageMeta = computed(() => titles[route.path] ?? { title: 'Module', icon: 'pi pi-th-large' })
const pageTitle = computed(() => pageMeta.value.title)
const icon = computed(() => pageMeta.value.icon)
</script>

<style scoped>
.placeholder-panel {
  min-height: 360px;
  display: grid;
  place-items: center;
  gap: var(--space-lg);
  padding: var(--space-3xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  text-align: center;
}

.placeholder-panel__icon {
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xl);
  background: var(--color-primary-subtle);
  color: var(--color-primary-hover);
  font-size: 28px;
}

.placeholder-panel h2 {
  margin: 0;
  font-size: 22px;
}

.placeholder-panel p {
  max-width: 520px;
  margin: var(--space-sm) auto 0;
  color: var(--color-text-secondary);
}
</style>
