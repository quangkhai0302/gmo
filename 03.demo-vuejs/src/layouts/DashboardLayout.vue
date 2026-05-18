<template>
  <div :class="['dashboard-shell', { 'dashboard-shell--collapsed': sidebarCollapsed }]">
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      @toggle-collapse="toggleSidebarCollapse"
      @close-mobile="mobileSidebarOpen = false"
    />

    <div class="dashboard-shell__body">
      <AppTopbar :title="title" :breadcrumb="breadcrumb" @toggle-mobile="openMobileSidebar" />

      <main class="dashboard-shell__content">
        <div class="dashboard-shell__page">
          <div v-if="$slots.header || $slots.actions || subtitle" class="dashboard-shell__page-header">
            <div>
              <p v-if="eyebrow" class="dashboard-shell__eyebrow">{{ eyebrow }}</p>
              <slot name="header">
                <p v-if="subtitle" class="dashboard-shell__subtitle">{{ subtitle }}</p>
              </slot>
            </div>
            <div v-if="$slots.actions" class="dashboard-shell__actions">
              <slot name="actions"></slot>
            </div>
          </div>

          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const SIDEBAR_COLLAPSED_STORAGE_KEY = 'student-management.sidebarCollapsed'

defineProps<{
  title: string
  breadcrumb?: string
  eyebrow?: string
  subtitle?: string
}>()

const route = useRoute()
const sidebarCollapsed = ref(readSidebarCollapsedState())
const mobileSidebarOpen = ref(false)

watch(() => route.fullPath, () => {
  mobileSidebarOpen.value = false
})

function toggleSidebarCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  writeSidebarCollapsedState(sidebarCollapsed.value)
}

function openMobileSidebar() {
  mobileSidebarOpen.value = true
}

function readSidebarCollapsedState() {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function writeSidebarCollapsedState(value: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(value))
  } catch {
    // Ignore unavailable storage in restricted browser contexts.
  }
}
</script>

<style scoped>
.dashboard-shell {
  min-height: 100vh;
  background: var(--color-background);
}

.dashboard-shell__body {
  min-height: 100vh;
  padding-left: 264px;
  transition: padding-left var(--transition-base);
}

.dashboard-shell--collapsed .dashboard-shell__body {
  padding-left: 80px;
}

.dashboard-shell__content {
  padding: var(--space-2xl);
}

.dashboard-shell__page {
  width: min(100%, 1440px);
  margin: 0 auto;
}

.dashboard-shell__page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.dashboard-shell__eyebrow {
  margin: 0 0 var(--space-xs);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-hover);
  text-transform: uppercase;
  letter-spacing: 0;
}

.dashboard-shell__subtitle {
  max-width: 720px;
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.dashboard-shell__actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

@media (max-width: 960px) {
  .dashboard-shell__body,
  .dashboard-shell--collapsed .dashboard-shell__body {
    padding-left: 0;
  }

  .dashboard-shell__content {
    padding: var(--space-xl) var(--space-lg);
  }
}

@media (max-width: 640px) {
  .dashboard-shell__content {
    padding: var(--space-lg);
  }

  .dashboard-shell__page-header {
    align-items: stretch;
    flex-direction: column;
  }

  .dashboard-shell__actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
