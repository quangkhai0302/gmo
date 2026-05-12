<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm.vue'
import { useRouter } from 'vue-router'
import { registerApi } from '@/api/axios'
import { tokenStorage } from '@/utils/tokenStorage'

const router = useRouter()

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

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string> | null
}

function getRegisterErrorMessage(error: unknown): { summary: string; fieldErrors: Record<string, string> } {
  if (!axios.isAxiosError(error)) {
    return { summary: 'Đăng ký thất bại.', fieldErrors: {} }
  }

  const data = error.response?.data as ApiErrorResponse | undefined
  const errors = data?.errors ?? null

  if (errors && Object.keys(errors).length > 0) {
    return { summary: '', fieldErrors: errors }
  }

  return { summary: data?.message ?? 'Đăng ký thất bại.', fieldErrors: {} }
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
    )

    alert(response.message)
    router.push('/students')
  } catch (error: any) {
    const mapped = getRegisterErrorMessage(error)
    registerErrorSummary.value = mapped.summary
    registerFieldErrors.value = mapped.fieldErrors
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
</template>
