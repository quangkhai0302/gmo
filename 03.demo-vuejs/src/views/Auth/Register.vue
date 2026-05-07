<script setup lang="ts">
import { ref } from 'vue'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref<Record<string, string>>({
  email: '',
  password: '',
  confirmPassword: '',
})

const fields: AuthField[] = [
  { key: 'email', type: 'email', placeholder: 'Email' },
  { key: 'password', type: 'password', placeholder: 'Password' },
  { key: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
]

const register = () => {
  alert('Đăng ký thành công!')
}

const backToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <AuthForm
    v-model="form"

    title="Register"

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