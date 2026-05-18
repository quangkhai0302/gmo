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

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

const toasts = ref<Toast[]>([])
let nextId = 0

function toastTitle(type: Toast['type']) {
  return type === 'success' ? 'Thao tác thành công' : 'Có lỗi xảy ra'
}

function show(message: string, type: 'success' | 'error' = 'success', duration = 3000) {
  const id = ++nextId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 88px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  pointer-events: none;
}

.toast-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  width: min(380px, calc(100vw - 32px));
  padding: var(--space-md) var(--space-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
  pointer-events: all;
}

.toast-item::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
}

.toast-item__icon-wrap {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-round);
  flex: 0 0 auto;
  font-size: 16px;
}

.toast-item__content {
  min-width: 0;
}

.toast-item__title {
  margin: 0;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.toast-item__message {
  margin: 2px 0 0;
  color: var(--color-text);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
}

.toast-item--success::after {
  background: var(--color-success);
}

.toast-item--success .toast-item__icon-wrap {
  background: var(--color-success-soft);
  color: #15803d;
}

.toast-item--success .toast-item__title {
  color: #15803d;
}

.toast-item--error::after {
  background: var(--color-danger);
}

.toast-item--error .toast-item__icon-wrap {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.toast-item--error .toast-item__title {
  color: var(--color-danger);
}

.toast-enter-active,
.toast-leave-active {
  transition: all var(--transition-base);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(28px);
}
</style>
