<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm.vue'
import ToastNotification from '../../components/screenList/ToastNotification.vue'
import { registerApi } from '@/api/axios'
import { parseApiError } from '@/utils/apiError'
import { tokenStorage } from '@/utils/tokenStorage'

const router = useRouter()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const form = ref<Record<string, string>>({
  username: '',
  password: '',
  confirmPassword: '',
})
const registerErrorSummary = ref('')
const registerFieldErrors = ref<Record<string, string>>({})

const fields: AuthField[] = [
  { key: 'username', type: 'text', placeholder: 'username' },
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
  try {
    registerErrorSummary.value = ''
    registerFieldErrors.value = {}

    const response = await registerApi({
      username: form.value.username,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword,
    })

    tokenStorage.setTokens(
      response.result.accessToken,
      response.result.refreshToken,
      response.result.user?.username,
    )

    toast.value?.show(response.message, 'success')
    router.push('/students')
  } catch (error) {
    const mapped = getRegisterErrorMessage(error)
    registerErrorSummary.value = mapped.summary
    registerFieldErrors.value = mapped.fieldErrors

    if (mapped.summary) {
      toast.value?.show(mapped.summary, 'error')
    }
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
    @firstSubmitButton="register"
    @secondSubmitButton="backToLogin"
    containerClass="register-form"
    firstButtonClass="btn-register"
    secondButtonClass="btn-back-to-login"
  />
  <ToastNotification ref="toast" />
</template>
