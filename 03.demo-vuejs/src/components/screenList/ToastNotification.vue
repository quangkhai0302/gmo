<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div v-for="toast in toasts" :key="toast.id" :class="['toast-item', `toast-item--${toast.type}`]">
          <div class="toast-item__icon-wrap" aria-hidden="true">
            <i v-if="toast.type === 'success'" class="pi pi-check-circle"></i>
            <i v-else class="pi pi-exclamation-circle"></i>
          </div>

          <div class="toast-item__content">
            <p class="toast-item__title">{{ toastTitle(toast.type) }}</p>
            <p class="toast-item__message">{{ toast.message }}</p>
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
.toast-container {
  position: fixed;
  top: 72px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  max-width: 380px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10);
  pointer-events: all;
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-light);
  position: relative;
  overflow: hidden;
}

/* Left accent bar */
.toast-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  border-radius: 0 2px 2px 0;
}

.toast-item__icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-round);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.95rem;
}

.toast-item__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-item__title {
  margin: 0;
  font-size: 0.82rem;
  font-weight: var(--font-weight-extrabold);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.toast-item__message {
  margin: 0;
  font-size: 0.88rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.35;
}

/* Success — Teal themed */
.toast-item--success {
  background: linear-gradient(180deg, #ffffff 0%, #f0faf9 100%);
  color: var(--color-primary-dark);
}

.toast-item--success::after {
  background: var(--color-success);
}

.toast-item--success .toast-item__icon-wrap {
  background: rgba(39, 174, 96, 0.12);
  color: var(--color-success);
}

.toast-item--success .toast-item__title {
  color: var(--color-primary-dark);
}

/* Error — Coral themed */
.toast-item--error {
  background: linear-gradient(180deg, #ffffff 0%, #fef6f4 100%);
  color: var(--color-coral-dark);
}

.toast-item--error::after {
  background: var(--color-coral);
}

.toast-item--error .toast-item__icon-wrap {
  background: rgba(239, 108, 74, 0.1);
  color: var(--color-coral);
}

.toast-item--error .toast-item__title {
  color: var(--color-coral-dark);
}

/* Transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
