<template>
  <aside :class="['app-sidebar', { 'app-sidebar--collapsed': collapsed, 'app-sidebar--open': mobileOpen }]">
    <div class="app-sidebar__brand">
      <RouterLink to="/dashboard" class="app-sidebar__logo" @click="handleLogoClick">
        <span class="app-sidebar__mark">
          <i class="pi pi-graduation-cap"></i>
        </span>
        <span class="app-sidebar__brand-text">StudentOS</span>
      </RouterLink>

      <button class="app-sidebar__collapse" type="button" :title="collapseButtonTitle" @click="handleCollapseClick">
        <i :class="collapseButtonIcon"></i>
      </button>
    </div>

    <nav class="app-sidebar__nav" aria-label="Menu chính">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="app-sidebar__item"
        active-class="app-sidebar__item--active"
        :title="collapsed ? item.label : undefined"
        @click="$emit('closeMobile')"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="app-sidebar__footer">
      <button class="app-sidebar__theme-toggle" type="button" :title="themeToggleTitle" @click="cycleTheme">
        <i :class="currentThemeOption.icon"></i>
        <span>{{ currentThemeOption.label }}</span>
      </button>
    </div>
  </aside>

  <button v-if="mobileOpen" class="app-sidebar__scrim" type="button" aria-label="Đóng menu" @click="$emit('closeMobile')"></button>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  applyThemePreference,
  getStoredThemePreference,
  setStoredThemePreference,
  type ThemePreference,
} from '@/utils/theme'

const props = defineProps<{
  collapsed: boolean
  mobileOpen: boolean
}>()

const emit = defineEmits<{
  toggleCollapse: []
  closeMobile: []
}>()

const menuItems = [
  { label: 'Tổng quan', icon: 'pi pi-chart-line', path: '/dashboard' },
  { label: 'Sinh viên', icon: 'pi pi-users', path: '/students' },
  { label: 'Lớp học', icon: 'pi pi-building-columns', path: '/classes' },
  { label: 'Môn học', icon: 'pi pi-book', path: '/subjects' },
  { label: 'Báo cáo', icon: 'pi pi-chart-bar', path: '/reports' },
  { label: 'Cài đặt', icon: 'pi pi-cog', path: '/settings' },
]

const themeOptions: Array<{ value: ThemePreference; label: string; icon: string }> = [
  { value: 'light', label: 'Sáng', icon: 'pi pi-sun' },
  { value: 'dark', label: 'Tối', icon: 'pi pi-moon' },
  { value: 'system', label: 'Hệ thống', icon: 'pi pi-desktop' },
]

const themePreference = ref<ThemePreference>(getStoredThemePreference())

const collapseButtonTitle = computed(() => {
  if (props.mobileOpen) return 'Đóng menu'
  return props.collapsed ? 'Mở rộng menu' : 'Thu gọn menu'
})

const collapseButtonIcon = computed(() => {
  if (props.mobileOpen) return 'pi pi-times'
  return props.collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'
})

const currentThemeOption = computed(() =>
  themeOptions.find((option) => option.value === themePreference.value) ?? themeOptions[2],
)

const themeToggleTitle = computed(() => `Giao diện: ${currentThemeOption.value.label}`)

function handleCollapseClick() {
  if (props.mobileOpen) {
    emit('closeMobile')
    return
  }

  emit('toggleCollapse')
}

function cycleTheme() {
  const currentIndex = themeOptions.findIndex((option) => option.value === themePreference.value)
  const nextPreference = themeOptions[(currentIndex + 1) % themeOptions.length].value

  themePreference.value = nextPreference
  setStoredThemePreference(nextPreference)
}

function handleLogoClick(event: MouseEvent) {
  if (props.collapsed) {
    event.preventDefault()
    emit('toggleCollapse')
    return
  }

  emit('closeMobile')
}

applyThemePreference(themePreference.value)
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 220;
  width: 264px;
  background: var(--color-sidebar);
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(148, 163, 184, 0.14);
  transition: width var(--transition-base), transform var(--transition-base);
}

.app-sidebar--collapsed {
  width: 80px;
}

.app-sidebar__brand {
  position: relative;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: 0 var(--space-lg);
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

.app-sidebar__logo {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  gap: var(--space-md);
}

.app-sidebar__mark {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-lg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: linear-gradient(135deg, var(--color-primary), #0f766e);
  box-shadow: 0 12px 26px rgba(20, 184, 166, 0.28);
  flex: 0 0 auto;
}

.app-sidebar__brand-text {
  font-size: 17px;
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0;
}

.app-sidebar__collapse {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: var(--radius-md);
  background: rgba(15, 23, 42, 0.78);
  color: var(--color-sidebar-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.app-sidebar__collapse:hover {
  color: #ffffff;
  border-color: rgba(20, 184, 166, 0.42);
  background: rgba(20, 184, 166, 0.12);
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-lg) var(--space-md);
}

.app-sidebar__item {
  position: relative;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 0 var(--space-md);
  border-radius: var(--radius-md);
  color: var(--color-sidebar-muted);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  transition: background var(--transition-fast), color var(--transition-fast);
}

.app-sidebar__item i {
  width: 20px;
  text-align: center;
  font-size: 16px;
}

.app-sidebar__item:hover {
  color: #ffffff;
  background: rgba(148, 163, 184, 0.10);
}

.app-sidebar__item--active {
  color: #ffffff;
  background: rgba(20, 184, 166, 0.15);
}

.app-sidebar__item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 0 var(--radius-round) var(--radius-round) 0;
  background: var(--color-primary);
}

.app-sidebar__footer {
  margin-top: auto;
  padding: var(--space-lg);
}

.app-sidebar__theme-toggle {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: var(--radius-md);
  background: rgba(15, 23, 42, 0.62);
  color: #e2e8f0;
  font-size: 13px;
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast);
}

.app-sidebar__theme-toggle i {
  width: 18px;
  text-align: center;
  font-size: 14px;
  color: #93c5fd;
}

.app-sidebar__theme-toggle:hover {
  color: #ffffff;
  border-color: rgba(20, 184, 166, 0.36);
  background: rgba(20, 184, 166, 0.16);
}

.app-sidebar__workspace {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.app-sidebar__workspace-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-round);
  background: var(--color-success);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}

.app-sidebar__workspace strong,
.app-sidebar__workspace small {
  display: block;
}

.app-sidebar__workspace strong {
  font-size: 13px;
  color: #f8fafc;
}

.app-sidebar__workspace small {
  font-size: 11px;
  color: var(--color-sidebar-muted);
}

.app-sidebar--collapsed .app-sidebar__brand {
  height: 72px;
  justify-content: center;
  padding: 0 var(--space-md);
}

.app-sidebar--collapsed .app-sidebar__brand-text,
.app-sidebar--collapsed .app-sidebar__item span,
.app-sidebar--collapsed .app-sidebar__theme-toggle span,
.app-sidebar--collapsed .app-sidebar__workspace div {
  display: none;
}

.app-sidebar--collapsed .app-sidebar__collapse {
  position: absolute;
  top: 50%;
  right: -16px;
  z-index: 3;
  width: 32px;
  height: 32px;
  transform: translateY(-50%);
  border-color: rgba(148, 163, 184, 0.22);
  border-radius: var(--radius-round);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.16);
}

.app-sidebar--collapsed .app-sidebar__collapse:hover {
  border-color: rgba(20, 184, 166, 0.42);
  background: var(--color-surface);
  color: var(--color-primary-hover);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.2);
}

.app-sidebar--collapsed .app-sidebar__logo {
  justify-content: center;
}

.app-sidebar--collapsed .app-sidebar__mark {
  width: 40px;
  height: 40px;
  box-shadow: 0 10px 22px rgba(20, 184, 166, 0.22);
}

.app-sidebar--collapsed .app-sidebar__item {
  justify-content: center;
  padding: 0;
}

.app-sidebar--collapsed .app-sidebar__workspace {
  justify-content: center;
}

.app-sidebar--collapsed .app-sidebar__footer {
  padding: var(--space-md);
}

.app-sidebar--collapsed .app-sidebar__theme-toggle {
  justify-content: center;
  padding: 0;
}

.app-sidebar__scrim {
  display: none;
}

@media (max-width: 960px) {
  .app-sidebar {
    transform: translateX(-100%);
    width: 280px;
  }

  .app-sidebar--open {
    transform: translateX(0);
  }

  .app-sidebar--collapsed {
    width: 280px;
  }

  .app-sidebar--collapsed .app-sidebar__brand {
    height: 72px;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 var(--space-lg);
  }

  .app-sidebar--collapsed .app-sidebar__brand-text,
  .app-sidebar--collapsed .app-sidebar__item span,
  .app-sidebar--collapsed .app-sidebar__theme-toggle span,
  .app-sidebar--collapsed .app-sidebar__workspace div {
    display: block;
  }

  .app-sidebar--collapsed .app-sidebar__item {
    justify-content: flex-start;
    padding: 0 var(--space-md);
  }

  .app-sidebar--collapsed .app-sidebar__logo {
    justify-content: flex-start;
  }

  .app-sidebar--collapsed .app-sidebar__theme-toggle {
    justify-content: flex-start;
    padding: 0 var(--space-md);
  }

  .app-sidebar--collapsed .app-sidebar__collapse {
    position: static;
    transform: none;
    width: 32px;
    height: 32px;
    display: inline-flex;
    border-color: rgba(148, 163, 184, 0.18);
    border-radius: var(--radius-md);
    background: rgba(15, 23, 42, 0.78);
    color: var(--color-sidebar-muted);
    box-shadow: none;
  }

  .app-sidebar__scrim {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 210;
    border: 0;
    background: rgba(15, 23, 42, 0.48);
    backdrop-filter: blur(3px);
  }
}
</style>
