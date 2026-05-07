<template>
  <Teleport to="body">
    <Transition name="sl-dialog">
      <div v-if="visible" class="sl-dialog-overlay" @click.self="$emit('cancel')">
        <div class="sl-dialog" role="dialog" aria-modal="true">
          <div class="sl-dialog__icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
          <h3 class="sl-dialog__title">Xác nhận xóa</h3>
          <p class="sl-dialog__message">
            Bạn có chắc chắn muốn xóa sinh viên<br />
            <strong>"{{ studentName }}"</strong>?
          </p>
          <p class="sl-dialog__note">Hành động này không thể hoàn tác.</p>
          <div class="sl-dialog__actions">
            <button class="sl-dialog__btn sl-dialog__btn--cancel" @click="$emit('cancel')">Hủy</button>
            <button class="sl-dialog__btn sl-dialog__btn--confirm" @click="$emit('confirm')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
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
.sl-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.3);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.sl-dialog {
  background: #ffffff;
  border-radius: 18px;
  padding: 36px 40px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.sl-dialog__icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #fef2f2;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #ef4444;
}

.sl-dialog__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px;
}

.sl-dialog__message {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 6px;
}

.sl-dialog__message strong {
  color: #111827;
  font-weight: 700;
}

.sl-dialog__note {
  font-size: 0.78rem;
  color: #ef4444;
  margin: 0 0 28px;
}

.sl-dialog__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.sl-dialog__btn {
  flex: 1;
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
}

.sl-dialog__btn--cancel {
  background: #f9fafb;
  color: #6b7280;
  border: 1px solid #d1d5db;
}
.sl-dialog__btn--cancel:hover { background: #f3f4f6; color: #374151; }

.sl-dialog__btn--confirm {
  background: #ef4444;
  color: white;
}
.sl-dialog__btn--confirm:hover {
  background: #dc2626;
  transform: translateY(-1px);
}
.sl-dialog__btn--confirm:active { transform: scale(0.98); }

.sl-dialog-enter-active, .sl-dialog-leave-active { transition: all 0.22s ease; }
.sl-dialog-enter-from, .sl-dialog-leave-to { opacity: 0; }
.sl-dialog-enter-from .sl-dialog, .sl-dialog-leave-to .sl-dialog { transform: scale(0.93) translateY(10px); }
.sl-dialog-enter-active .sl-dialog, .sl-dialog-leave-active .sl-dialog { transition: all 0.22s ease; }
</style>
