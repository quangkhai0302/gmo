<template>
  <Teleport to="body">
    <div class="sl-toast-container">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id"
          :class="['sl-toast', `sl-toast--${toast.type}`]">
          <div class="sl-toast__icon-wrap" aria-hidden="true">
            <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <div class="sl-toast__content">
            <p class="sl-toast__title">{{ toastTitle(toast.type) }}</p>
            <p class="sl-toast__message">{{ toast.message }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Toast { id: number; message: string; type: 'success' | 'error' }

const toasts = ref<Toast[]>([])
let nextId = 0

function toastTitle(type: Toast['type']) {
  return type === 'success' ? 'Thao tác thành công' : 'Có lỗi xảy ra'
}

function show(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
  const id = ++nextId
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.sl-toast-container {
  position: fixed;
  top: 72px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.sl-toast {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  max-width: 380px;
  box-shadow: 0 14px 30px rgba(17, 24, 39, 0.12);
  pointer-events: all;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
}

.sl-toast::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
}

.sl-toast__icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sl-toast__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sl-toast__title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.sl-toast__message {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.35;
}

.sl-toast--success {
  background: linear-gradient(180deg, #ffffff 0%, #f8fffc 100%);
  color: #065f46;
}
.sl-toast--success::after { background: #10b981; }
.sl-toast--success .sl-toast__icon-wrap { background: #d1fae5; color: #10b981; }
.sl-toast--success .sl-toast__title { color: #047857; }

.sl-toast--error {
  background: linear-gradient(180deg, #ffffff 0%, #fff8f8 100%);
  color: #991b1b;
}
.sl-toast--error::after { background: #ef4444; }
.sl-toast--error .sl-toast__icon-wrap { background: #fee2e2; color: #ef4444; }
.sl-toast--error .sl-toast__title { color: #b91c1c; }

.toast-enter-active, .toast-leave-active { transition: all 0.28s ease; }
.toast-enter-from { opacity: 0; transform: translateX(40px); }
.toast-leave-to   { opacity: 0; transform: translateX(40px); }
</style>
