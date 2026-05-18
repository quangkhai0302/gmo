<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm.vue'
import ToastNotification from '../../components/screenList/ToastNotification.vue'
import { registerApi } from '@/api/axios'
import { parseApiError } from '@/utils/apiError'

const router = useRouter()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const form = ref<Record<string, string>>({
  email: '',
  password: '',
  confirmPassword: '',
})
const isRegistering = ref(false)
const registerErrorSummary = ref('')
const registerFieldErrors = ref<Record<string, string>>({})

const fields: AuthField[] = [
  { key: 'email', type: 'email', placeholder: 'Email' },
  { key: 'password', type: 'password', placeholder: 'Password' },
  { key: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
]

function getRegisterErrorMessage(error: unknown): { summary: string; fieldErrors: Record<string, string> } {
  const parsed = parseApiError(error, 'Đăng ký thất bại.')
  if (Object.keys(parsed.fieldErrors).length > 0) {
    return { summary: '', fieldErrors: parsed.fieldErrors }
  }
  return { summary: parsed.summary, fieldErrors: {} }
}

const register = async () => {
  if (isRegistering.value) return

  try {
    isRegistering.value = true
    registerErrorSummary.value = ''
    registerFieldErrors.value = {}
    const email = form.value.email.trim().toLowerCase()

    const response = await registerApi({
      email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
    })

    toast.value?.show(response.message, 'success')
    router.push({
      path: '/login',
      query: { verify: 'sent', email },
    })
  } catch (error) {
    const mapped = getRegisterErrorMessage(error)
    registerErrorSummary.value = mapped.summary
    registerFieldErrors.value = mapped.fieldErrors

    if (mapped.summary) {
      toast.value?.show(mapped.summary, 'error')
    }
  } finally {
    isRegistering.value = false
  }
}

const backToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <AuthForm
    v-model="form"
    title="Register"
    :error-summary="registerErrorSummary"
    :field-errors="registerFieldErrors"
    :fields="fields"
    firstSubmitLabel="Register"
    secondSubmitLabel="Back to login"
    :actions-inline="true"
    :submit-loading="isRegistering"
    @firstSubmitButton="register"
    @secondSubmitButton="backToLogin"
    containerClass="register-form"
    firstButtonClass="btn-register"
    secondButtonClass="btn-back-to-login"
  />
  <ToastNotification ref="toast" />
</template>
