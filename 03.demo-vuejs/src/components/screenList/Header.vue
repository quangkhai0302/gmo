<template>
  <header class="app-header">
    <div class="app-header__logo">
      <div class="app-header__logo-icon">
        <i class="pi pi-graduation-cap"></i>
      </div>
      <span class="app-header__logo-text">StudentMS</span>
    </div>

    <div class="app-header__right">
      <div class="app-header__user" v-if="showUsername">
        <div class="app-header__avatar">{{ initials }}</div>
        <span class="app-header__username">Welcome, {{ username }}</span>
      </div>
      <button class="app-header__logout" @click="handleLogout">
        <i class="pi pi-sign-out"></i>
        Logout
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import router from '@/router'
import { tokenStorage } from '@/utils/tokenStorage'
import { computed } from 'vue'

const props = withDefaults(defineProps<{ username?: string; showUsername?: boolean }>(), { showUsername: true })
const username = computed(() => props.username?.trim() || tokenStorage.getUserName() || 'User')

const initials = computed(() =>
  username.value
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
)

const handleLogout = async () => {
  await tokenStorage.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-2xl);
  height: 60px;
  background: var(--color-surface-card);
  border-bottom: 1.5px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-header__logo-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: var(--shadow-teal-glow);
}

.app-header__logo-text {
  font-size: 1.15rem;
  font-weight: var(--font-weight-extrabold);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.app-header__user {
  display: flex;
  align-items: center;
  gap: 9px;
}

.app-header__avatar {
  width: 34px;
  height: 34px;
  border-radius: var(--radius-round);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-on-primary);
  box-shadow: var(--shadow-teal-glow);
}

.app-header__username {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-normal);
}

.app-header__logout {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  background: var(--color-surface-card);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-round);
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-family);
}

.app-header__logout:hover {
  background: rgba(239, 108, 74, 0.06);
  border-color: var(--color-coral-light);
  color: var(--color-coral);
  box-shadow: var(--shadow-coral-glow);
}

.app-header__logout:active {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 640px) {
  .app-header {
    padding: 0 var(--space-lg);
  }

  .app-header__username {
    display: none;
  }
}
</style>
