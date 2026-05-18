<template>
  <header class="app-topbar">
    <div class="app-topbar__left">
      <button class="app-topbar__menu" type="button" aria-label="Mở menu" @click="$emit('toggleMobile')">
        <i class="pi pi-bars"></i>
      </button>

      <div class="app-topbar__heading">
        <nav class="app-topbar__breadcrumb" aria-label="Breadcrumb">
          <RouterLink to="/dashboard">Hệ thống</RouterLink>
          <i class="pi pi-angle-right"></i>
          <span>{{ breadcrumb || title }}</span>
        </nav>
        <h1>{{ title }}</h1>
      </div>
    </div>

    <div class="app-topbar__right">
      <button class="app-topbar__icon-btn" type="button" aria-label="Thông báo">
        <i class="pi pi-bell"></i>
        <span></span>
      </button>

      <div ref="accountRoot" class="app-topbar__account">
        <button class="app-topbar__profile" type="button" @click="accountOpen = !accountOpen">
          <span class="app-topbar__avatar">{{ initials }}</span>
          <span class="app-topbar__user">
            <strong>{{ username }}</strong>
            <small>Quản trị viên</small>
          </span>
          <i class="pi pi-angle-down"></i>
        </button>

        <Transition name="account-menu">
          <div v-if="accountOpen" class="app-topbar__dropdown">
            <button type="button">
              <i class="pi pi-user"></i>
              Tài khoản
            </button>
            <button type="button">
              <i class="pi pi-shield"></i>
              Bảo mật
            </button>
            <button class="app-topbar__logout" type="button" @click="handleLogout">
              <i class="pi pi-sign-out"></i>
              Đăng xuất
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { tokenStorage } from '@/utils/tokenStorage'

defineProps<{
  title: string
  breadcrumb?: string
}>()

defineEmits<{
  toggleMobile: []
}>()

const router = useRouter()
const accountOpen = ref(false)
const accountRoot = ref<HTMLElement | null>(null)
const username = computed(() => tokenStorage.getUserName() || 'Admin')
const initials = computed(() =>
  username.value
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2),
)

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown)
})

function handleDocumentPointerDown(event: PointerEvent) {
  if (!accountOpen.value) return

  const target = event.target
  if (!(target instanceof Node)) return
  if (accountRoot.value?.contains(target)) return

  accountOpen.value = false
}

async function handleLogout() {
  await tokenStorage.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-topbar {
  position: sticky;
  top: 0;
  z-index: 160;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  padding: 0 var(--space-2xl);
  background: var(--color-topbar-bg);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-xs);
  backdrop-filter: blur(12px);
}

.app-topbar__left,
.app-topbar__right {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  min-width: 0;
}

.app-topbar__menu,
.app-topbar__icon-btn,
.app-topbar__profile,
.app-topbar__dropdown button {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: inherit;
}

.app-topbar__menu {
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}

.app-topbar__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
}

.app-topbar__breadcrumb a:hover {
  color: var(--color-primary-hover);
}

.app-topbar__heading h1 {
  margin: 2px 0 0;
  font-size: 22px;
  line-height: 1.25;
  letter-spacing: 0;
  color: var(--color-text);
}

.app-topbar__icon-btn {
  position: relative;
  width: 42px;
  height: 42px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.app-topbar__icon-btn:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
  background: var(--color-surface-muted);
}

.app-topbar__icon-btn span {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-round);
  background: var(--color-danger);
  border: 2px solid var(--color-surface);
}

.app-topbar__account {
  position: relative;
}

.app-topbar__profile {
  height: 46px;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-sm);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.app-topbar__profile:hover {
  background: var(--color-surface-muted);
}

.app-topbar__avatar {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-round);
  background: var(--color-primary);
  color: #ffffff;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.app-topbar__user {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.app-topbar__user strong {
  font-size: 13px;
  color: var(--color-text);
}

.app-topbar__user small {
  font-size: 11px;
  color: var(--color-text-muted);
}

.app-topbar__dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  min-width: 190px;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
}

.app-topbar__dropdown button {
  width: 100%;
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  border-radius: var(--radius-md);
  font-size: 13px;
  text-align: left;
}

.app-topbar__dropdown button:hover {
  background: var(--color-surface-muted);
}

.app-topbar__dropdown .app-topbar__logout {
  color: var(--color-danger);
}

.account-menu-enter-active,
.account-menu-leave-active {
  transition: all var(--transition-fast);
}

.account-menu-enter-from,
.account-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 960px) {
  .app-topbar {
    padding: 0 var(--space-lg);
  }

  .app-topbar__menu {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .app-topbar__user,
  .app-topbar__profile > .pi {
    display: none;
  }

  .app-topbar__heading h1 {
    font-size: 18px;
  }

  .app-topbar__breadcrumb {
    display: none;
  }
}
</style>
