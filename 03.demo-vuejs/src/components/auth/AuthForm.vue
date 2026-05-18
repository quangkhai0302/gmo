<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

export type AuthField = {
  key: string
  type?: 'text' | 'email' | 'password'
  placeholder: string
}

type NewType = {
    // content
    title: string
    subtitle?: string
    errorSummary?: string
    fieldErrors?: Record<string, string>

    // data
    fields: AuthField[]
    modelValue: Record<string, string>

    // action
    firstSubmitLabel: string
    secondSubmitLabel?: string

    // style
    containerClass: string
    firstButtonClass: string
    secondButtonClass?: string

    // layout
    actionsInline?: boolean

    submitLoading?: boolean

    // 
    buttonOrderReversed?: boolean
}

const props = defineProps<NewType>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, string>): void
  (e: 'firstSubmitButton'): void
  (e: 'secondSubmitButton'): void
}>()

const updateField = (key: string, value?: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value ?? '',
  })
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card" :class="containerClass">
      <!-- Logo area -->
      <div class="auth-logo">
        <div class="auth-logo__icon">
          <i class="pi pi-graduation-cap"></i>
        </div>
        <span class="auth-logo__text">StudentMS</span>
      </div>

      <h2 class="auth-title">{{ title }}</h2>
      <p v-if="subtitle" class="auth-subtitle">{{ subtitle }}</p>

      <!-- Error summary -->
      <div v-if="errorSummary" class="auth-error-box" role="alert">
        <i class="pi pi-exclamation-triangle"></i>
        <p class="auth-error-summary">{{ errorSummary }}</p>
      </div>

      <!-- Fields -->
      <template v-for="field in fields" :key="field.key">
        <div class="auth-field">
          <Password
            v-if="field.type === 'password'"
            :modelValue="modelValue[field.key] ?? ''"
            :placeholder="field.placeholder"
            :feedback="false"
            :toggleMask="false"
            :inputClass="['auth-input', { 'auth-input--invalid': !!fieldErrors?.[field.key] }]"
            class="auth-password"
            @update:modelValue="updateField(field.key, $event)"
          />

          <InputText
            v-else
            :modelValue="modelValue[field.key] ?? ''"
            :type="field.type ?? 'text'"
            :placeholder="field.placeholder"
            :class="['auth-input', { 'auth-input--invalid': !!fieldErrors?.[field.key] }]"
            @update:modelValue="updateField(field.key, $event)"
          />

          <p v-if="fieldErrors?.[field.key]" class="auth-field-error">
            <i class="pi pi-info-circle"></i>
            {{ fieldErrors[field.key] }}
          </p>
        </div>
      </template>

      <!-- Actions -->
      <div :class="['auth-actions', { 'auth-actions--inline': actionsInline }]">
        <Button
          :label="firstSubmitLabel"
          :loading="submitLoading"
          :disabled="submitLoading"
          :class="['auth-btn-primary', firstButtonClass]"
          @click="emit('firstSubmitButton')"
        />

        <Button
          v-if="secondSubmitLabel"
          :label="secondSubmitLabel"
          text
          :disabled="submitLoading"
          :class="['auth-btn-secondary', secondButtonClass]"
          @click="emit('secondSubmitButton')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(145deg, var(--color-surface-base) 0%, var(--color-primary-bg) 50%, #e0f2f0 100%);
  padding: var(--space-lg);
}

.auth-card {
  width: 420px;
  max-width: 100%;
  padding: var(--space-2xl) var(--space-2xl) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  background: var(--color-surface-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card), 0 8px 32px rgba(30, 140, 134, 0.08);
  border: 1px solid var(--color-border-light);
}

/* Logo */
.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-xs);
}

.auth-logo__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-on-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: var(--shadow-teal-glow);
}

.auth-logo__text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-extrabold);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

/* Title & Subtitle */
.auth-title {
  margin: 0;
  text-align: center;
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.auth-subtitle {
  margin: -8px 0 0;
  text-align: center;
  font-size: var(--font-size-body);
  color: var(--color-text-muted);
}

/* Error box */
.auth-error-box {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  border: 1px solid rgba(239, 108, 74, 0.3);
  background: rgba(239, 108, 74, 0.06);
  color: var(--color-coral-dark);
  border-radius: var(--radius-md);
  padding: var(--space-md) var(--space-lg);
}

.auth-error-box i {
  font-size: 1rem;
  flex-shrink: 0;
  color: var(--color-coral);
}

.auth-error-summary {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

/* Fields */
.auth-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.auth-field-error {
  margin: 0;
  font-size: 11px;
  color: var(--color-coral);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 4px;
}

.auth-field-error i {
  font-size: 10px;
}

/* Input overrides */
:deep(.p-inputtext.auth-input) {
  width: 100%;
  padding: 12px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  outline: none;
  font-size: var(--font-size-body);
  transition: all var(--transition-base);
  background: var(--color-cream);
}

:deep(.p-inputtext.auth-input)::placeholder {
  color: var(--color-text-muted) !important;
  opacity: 0.7;
}

:deep(.p-inputtext.auth-input:enabled:focus) {
  background: var(--color-surface-card);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

:deep(.p-inputtext.auth-input:enabled:hover) {
  border-color: var(--color-primary-light);
}

:deep(.p-inputtext.auth-input.auth-input--invalid),
.auth-password :deep(.p-password-input.auth-input.auth-input--invalid) {
  border-color: var(--color-coral);
  background: rgba(239, 108, 74, 0.04);
}

:deep(.p-inputtext.auth-input.auth-input--invalid:enabled:focus),
.auth-password :deep(.p-password-input.auth-input.auth-input--invalid:enabled:focus) {
  box-shadow: 0 0 0 3px rgba(239, 108, 74, 0.15);
}

/* Password component */
.auth-password {
  width: 100%;
}

.auth-password :deep(.p-password) {
  width: 100%;
}

.auth-password :deep(.p-password-input) {
  width: 100%;
}

.auth-password :deep(.p-password-toggle-mask-icon) {
  display: none;
}

/* Primary button — Gold gradient CTA, pill shape */
.auth-btn-primary.p-button {
  width: 100%;
  padding: 13px;
  border-radius: var(--radius-round);
  border: none;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
  transition: all var(--transition-bounce);
  justify-content: center;
  box-shadow: var(--shadow-accent-glow);
  letter-spacing: 0.02em;
}

.auth-btn-primary.p-button:hover {
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 210, 63, 0.5);
}

.auth-btn-primary.p-button:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-accent-glow);
}

/* Secondary button */
.auth-btn-secondary.p-button {
  width: 100%;
  background: transparent;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  margin-top: -4px;
  justify-content: center;
  transition: all var(--transition-base);
}

.auth-btn-secondary.p-button:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* Actions layout */
.auth-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.auth-actions--inline {
  flex-direction: row-reverse;
  align-items: center;
}

.auth-actions--inline .auth-btn-primary.p-button,
.auth-actions--inline .auth-btn-secondary.p-button {
  width: 50%;
  margin-top: 0;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-card {
    padding: var(--space-xl);
  }

  .auth-actions--inline {
    flex-direction: column;
  }

  .auth-actions--inline .auth-btn-primary.p-button,
  .auth-actions--inline .auth-btn-secondary.p-button {
    width: 100%;
  }
}

.auth-wrapper {
  background: radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.14), transparent 34%), var(--color-background);
}

.auth-card {
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.auth-logo__icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  color: #ffffff;
  font-size: 1.25rem;
}

.auth-logo__text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-title {
  color: var(--color-text);
  letter-spacing: 0;
}

.auth-btn-primary.p-button {
  border-radius: var(--radius-md) !important;
  background: var(--color-primary) !important;
  color: #ffffff !important;
  box-shadow: var(--shadow-teal-glow) !important;
  letter-spacing: 0;
}

.auth-btn-primary.p-button:hover {
  background: var(--color-primary-hover) !important;
  box-shadow: 0 10px 22px rgba(20, 184, 166, 0.24) !important;
  transform: translateY(-1px);
}

.auth-btn-primary.p-button:active {
  transform: translateY(0);
}

.auth-error-box,
:deep(.p-inputtext.auth-input.auth-input--invalid),
.auth-password :deep(.p-password-input.auth-input.auth-input--invalid) {
  border-color: var(--color-danger);
}

.auth-field-error,
.auth-error-box,
.auth-error-box i {
  color: var(--color-danger);
}
</style>
