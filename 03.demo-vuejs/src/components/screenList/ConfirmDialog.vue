<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="visible" class="dialog-overlay" @click.self="$emit('cancel')">
        <div class="dialog-panel" role="dialog" aria-modal="true">
          <div class="dialog-panel__icon">
            <i class="pi pi-trash"></i>
          </div>
          <h3 class="dialog-panel__title">Xác nhận xóa</h3>
          <p class="dialog-panel__message">
            Bạn có chắc chắn muốn xóa sinh viên<br />
            <strong>"{{ studentName }}"</strong>?
          </p>
          <p class="dialog-panel__note">Hành động này không thể hoàn tác.</p>
          <div class="dialog-panel__actions">
            <button class="dialog-btn dialog-btn--cancel" @click="$emit('cancel')">Hủy</button>
            <button class="dialog-btn dialog-btn--confirm" @click="$emit('confirm')">
              <i class="pi pi-check"></i>
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; studentName: string }>()
defineEmits<{ confirm: []; cancel: [] }>()
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 140, 134, 0.10);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
}

.dialog-panel {
  background: var(--color-surface-card);
  border-radius: var(--radius-xl);
  padding: var(--space-3xl) var(--space-3xl);
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), var(--shadow-card);
  border: 1px solid var(--color-border-light);
}

.dialog-panel__icon {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-round);
  background: rgba(239, 108, 74, 0.08);
  border: 1.5px solid rgba(239, 108, 74, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-xl);
  color: var(--color-coral);
  font-size: 1.3rem;
}

.dialog-panel__title {
  font-size: 1.15rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 10px;
}

.dialog-panel__message {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin: 0 0 6px;
}

.dialog-panel__message strong {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-bold);
}

.dialog-panel__note {
  font-size: 0.78rem;
  color: var(--color-coral);
  margin: 0 0 var(--space-xl);
  font-weight: var(--font-weight-normal);
}

.dialog-panel__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.dialog-btn {
  flex: 1;
  padding: 12px 18px;
  border: none;
  border-radius: var(--radius-round);
  font-size: 0.875rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-bounce);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-family);
}

.dialog-btn--cancel {
  background: var(--color-surface-card);
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
}

.dialog-btn--cancel:hover {
  background: var(--color-primary-bg);
  color: var(--color-text-primary);
  border-color: var(--color-primary-light);
}

.dialog-btn--cancel:active {
  transform: scale(0.95);
}

.dialog-btn--confirm {
  background: linear-gradient(135deg, var(--color-coral), var(--color-coral-dark));
  color: var(--color-text-on-primary);
  box-shadow: var(--shadow-coral-glow);
}

.dialog-btn--confirm:hover {
  background: linear-gradient(135deg, var(--color-coral-light), var(--color-coral));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(239, 108, 74, 0.45);
}

.dialog-btn--confirm:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-coral-glow);
}

/* Transition */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.25s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-from .dialog-panel,
.dialog-fade-leave-to .dialog-panel {
  transform: scale(0.92) translateY(12px);
}

.dialog-fade-enter-active .dialog-panel,
.dialog-fade-leave-active .dialog-panel {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
