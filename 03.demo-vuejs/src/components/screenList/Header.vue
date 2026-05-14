<template>
  <header class="sl-header">
    <div class="sl-header__logo">
      <div class="sl-header__logo-icon">
        <i class="pi pi-graduation-cap"></i>
      </div>
      <span class="sl-header__logo-text">StudentMS</span>
    </div>

    <div class="sl-header__right">
      <div class="sl-header__user" v-if="showUsername">
        <div class="sl-header__avatar">{{ initials }}</div>
        <span class="sl-header__username">Welcome, {{ username }}</span>
      </div>
      <button class="sl-header__logout" @click="handleLogout">
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
.sl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.sl-header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sl-header__logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.sl-header__logo-text {
  font-size: 1.15rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.sl-header__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sl-header__user {
  display: flex;
  align-items: center;
  gap: 9px;
}

.sl-header__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.sl-header__username {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.sl-header__logout {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.sl-header__logout:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #ef4444;
}
</style>
