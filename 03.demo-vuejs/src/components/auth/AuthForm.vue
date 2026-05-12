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
  <div class="wrapper">
    <div :class="containerClass">
      <h2 class="title">{{ title }}</h2>
      <p class="subtitle">{{ subtitle }}</p>
      <div v-if="errorSummary" class="auth-error-box" role="alert">
        <p v-if="errorSummary" class="auth-error-summary">{{ errorSummary }}</p>
      </div>

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

          <p v-if="fieldErrors?.[field.key]" class="auth-field-error">{{ fieldErrors[field.key] }}</p>
        </div>
      </template>

      <div :class="['actions-row', { 'actions-row-inline': actionsInline }]">
        
        <Button
          :label="firstSubmitLabel"
          :class="['auth-primary-btn', firstButtonClass]"
          @click="emit('firstSubmitButton')"
        />

        <Button
          v-if="secondSubmitLabel"
          :label="secondSubmitLabel"
          text
          :class="['auth-secondary-btn', secondButtonClass]"
          @click="emit('secondSubmitButton')"
        />

      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
}

.login-form,
.register-form {
  width: 400px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
}

.title {
  margin: 0;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.subtitle {
  margin: 0;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.auth-error-box {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #991b1b;
  border-radius: 10px;
  padding: 10px 12px;
}

.auth-error-summary {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-field-error {
  margin: 0;
  font-size: 12px;
  color: #dc2626;
  font-weight: 600;
}

:deep(.p-inputtext.auth-input) {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    outline: none;
    font-size: 14px;
    transition: all 0.2s ease;
    background: #f9fafb;
}
:deep(.p-inputtext.auth-input)::placeholder {
  color: #9ca3af !important;
  opacity: 0.65;
}
:deep(.p-inputtext.auth-input:enabled:focus) {
    background: white;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

:deep(.p-inputtext.auth-input.auth-input--invalid),
.auth-password :deep(.p-password-input.auth-input.auth-input--invalid) {
  border-color: #ef4444;
  background: #fff1f2;
}

:deep(.p-inputtext.auth-input.auth-input--invalid:enabled:focus),
.auth-password :deep(.p-password-input.auth-input.auth-input--invalid:enabled:focus) {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.16);
}


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

.auth-primary-btn.p-button {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-content: center;
}

.btn-login.p-button,
.btn-register.p-button {
  background: #4f46e5;
}

.btn-login.p-button:hover,
.btn-register.p-button:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.btn-login.p-button:active,
.btn-register.p-button:active {
  transform: scale(0.98);
}

.auth-secondary-btn.p-button {
  width: 100%;
  background: transparent;
  border: none;
  color: #4f46e5;
  font-size: 14px;
  cursor: pointer;
  margin-top: -5px;
  justify-content: center;
}

.auth-secondary-btn.p-button:hover {
  text-decoration: underline;
}

.actions-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.actions-row-inline {
  flex-direction: row-reverse;
  align-items: center;
}

.actions-row-inline .auth-primary-btn.p-button,
.actions-row-inline .auth-secondary-btn.p-button {
  width: 50%;
  margin-top: 0;
}
</style>
