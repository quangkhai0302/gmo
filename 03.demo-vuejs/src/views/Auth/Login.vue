<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm.vue'
import ToastNotification from '../../components/screenList/ToastNotification.vue'
import { loginApi } from '@/api/axios'
import { parseApiError } from '@/utils/apiError'
import { tokenStorage } from '@/utils/tokenStorage'

const router = useRouter()
const route = useRoute()
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const form = ref<Record<string, string>>({
  username: '',
  password: '',
})

const loginErrorSummary = ref('')
const loginFieldErrors = ref<Record<string, string>>({})

const fields: AuthField[] = [
  { key: 'username', type: 'text', placeholder: 'Username' },
  { key: 'password', type: 'password', placeholder: 'Password' },
]

function getLoginErrorMessage(error: unknown): { summary: string; fieldErrors: Record<string, string> } {
  const parsed = parseApiError(error, 'Đăng nhập thất bại.')
  if (Object.keys(parsed.fieldErrors).length > 0) {
    return { summary: '', fieldErrors: parsed.fieldErrors }
  }
  return { summary: parsed.summary, fieldErrors: {} }
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
      response.result.user?.username,
    )

    toast.value?.show(response.message, 'success')
    router.push('/students')
  } catch (error) {
    const mapped = getLoginErrorMessage(error)
    loginErrorSummary.value = mapped.summary
    loginFieldErrors.value = mapped.fieldErrors

    if (mapped.summary) {
      toast.value?.show(mapped.summary, 'error')
    }
  }
}

const createAccount = () => {
  router.push('/register')
}

onMounted(() => {
  if (route.query.expired === '1') {
    toast.value?.show('Thời gian đăng nhập hết hạn', 'error')
    router.replace('/login')
  }
})
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
  <ToastNotification ref="toast" />
</template>
