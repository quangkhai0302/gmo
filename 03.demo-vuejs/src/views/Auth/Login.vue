<script setup lang="ts">
import { ref } from 'vue'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm.vue'
import { useRouter } from 'vue-router'
import { loginApi } from '@/api/axios'
import axios from 'axios'
import { tokenStorage } from '@/utils/tokenStorage'

const router = useRouter()

const form = ref<Record<string, string>>({
  username: '',
  password: '',
})

const loginErrorSummary = ref('');
const loginFieldErrors = ref<Record<string, string>>({});

const fields: AuthField[] = [
  { key: 'username', type: 'text', placeholder: 'Username' },
  { key: 'password', type: 'password', placeholder: 'Password' },
]

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string> | null
}

function getLoginErrorMessage(error: unknown): { summary: string; fieldErrors: Record<string, string> } {
  if (!axios.isAxiosError(error)) {
    return { summary: 'Đăng nhập thất bại.', fieldErrors: {} }
  }

  const data = error.response?.data as ApiErrorResponse | undefined
  const errors = data?.errors ?? null

  if (errors && Object.keys(errors).length > 0) {
    return { summary: '', fieldErrors: errors }
  }

  return { summary: data?.message ?? 'Đăng nhập thất bại.', fieldErrors: {} }
}

const login = async () => {
  try {
    loginErrorSummary.value = ''
    loginFieldErrors.value = {}

    const response = await loginApi({
      username: form.value.username,
      password: form.value.password,
    })
    tokenStorage.setTokens(
      response.result.accessToken,
      response.result.refreshToken,
    )
    alert(response.message)
    router.push('/students')
  } 
  catch (error: any) {
    const mapped = getLoginErrorMessage(error)
    loginErrorSummary.value = mapped.summary
    loginFieldErrors.value = mapped.fieldErrors
  }
}

const createAccount = () => {
  router.push('/register')
}
</script>

<template>
  <AuthForm
    v-model="form"
    :error-summary="loginErrorSummary"
    :field-errors="loginFieldErrors"
    :fields="fields"
    title="Login"    
    firstSubmitLabel="Login"
    secondSubmitLabel="Don't have an account? Register"
    containerClass="login-form"
    firstButtonClass="btn-login"
    secondButtonClass="btn-create-account"
    @firstSubmitButton="login"
    @secondSubmitButton="createAccount"
  />
</template>