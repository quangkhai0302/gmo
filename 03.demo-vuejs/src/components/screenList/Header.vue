<template>
  <header class="sl-header">
    <div class="sl-header__logo">
      <div class="sl-header__logo-icon">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="url(#hgrad)" />
          <path d="M8 22L14 10L20 18L23 14L26 18" stroke="white" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" />
          <defs>
            <linearGradient id="hgrad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stop-color="#4f46e5" />
              <stop offset="100%" stop-color="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span class="sl-header__logo-text">StudentMS</span>
    </div>

    <div class="sl-header__right">
      <div class="sl-header__user" v-if="showUsername">
        <div class="sl-header__avatar">{{ initials }}</div>
        <span class="sl-header__username">Welcome, {{ username }}</span>
      </div>
      <button class="sl-header__logout" @click="handleLogout">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ username?: string; showUsername?: boolean }>(), { username: 'Admin', showUsername: true })
const emit = defineEmits<{ logout: [] }>()

const initials = computed(() =>
  props.username.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
)

function handleLogout() {
  emit('logout')
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
