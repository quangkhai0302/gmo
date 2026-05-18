<template>
  <Teleport to="body">
    <Transition name="dialog-fade">
      <div v-if="visible" class="dialog-overlay" @click.self="$emit('cancel')">
        <section class="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
          <div class="dialog-panel__header">
            <div class="dialog-panel__icon">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <div>
              <h3 id="delete-dialog-title">Xác nhận xóa sinh viên</h3>
              <p>Hành động này sẽ xóa hồ sơ khỏi hệ thống và không thể hoàn tác.</p>
            </div>
          </div>

          <div class="dialog-panel__body">
            <span>Sinh viên</span>
            <strong>{{ studentName }}</strong>
          </div>

          <div class="dialog-panel__actions">
            <button class="app-button app-button--secondary" type="button" @click="$emit('cancel')">Hủy</button>
            <button class="app-button app-button--danger" type="button" @click="$emit('confirm')">
              <i class="pi pi-trash"></i>
              Xóa hồ sơ
            </button>
          </div>
        </section>
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
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: rgba(15, 23, 42, 0.42);
  backdrop-filter: blur(7px);
}

.dialog-panel {
  width: min(100%, 460px);
  padding: var(--space-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.22);
}

.dialog-panel__header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);
}

.dialog-panel__icon {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: var(--color-danger-soft);
  color: var(--color-danger);
  flex: 0 0 auto;
}

.dialog-panel h3 {
  margin: 0;
  font-size: 18px;
  letter-spacing: 0;
}

.dialog-panel p {
  margin: 6px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.dialog-panel__body {
  margin: var(--space-xl) 0;
  padding: var(--space-lg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-background);
}

.dialog-panel__body span,
.dialog-panel__body strong {
  display: block;
}

.dialog-panel__body span {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.dialog-panel__body strong {
  margin-top: var(--space-xs);
  color: var(--color-text);
  font-size: 15px;
}

.dialog-panel__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity var(--transition-base);
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active .dialog-panel,
.dialog-fade-leave-active .dialog-panel {
  transition: transform var(--transition-base);
}

.dialog-fade-enter-from .dialog-panel,
.dialog-fade-leave-to .dialog-panel {
  transform: translateY(12px) scale(0.98);
}

@media (max-width: 520px) {
  .dialog-panel__actions {
    flex-direction: column-reverse;
  }

  .dialog-panel__actions .app-button {
    width: 100%;
  }
}
</style>
