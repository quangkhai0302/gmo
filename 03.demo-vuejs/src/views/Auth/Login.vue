<script setup lang="ts">
import { ref } from 'vue'
import AuthForm, { type AuthField } from '../../components/auth/AuthForm.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref<Record<string, string>>({
  username: '',
  password: '',
})

const fields: AuthField[] = [
  { key: 'username', type: 'text', placeholder: 'Username' },
  { key: 'password', type: 'password', placeholder: 'Password' },
]

const login = () => {
  alert('Đăng nhập thành công!')
}

const createAccount = () => {
  router.push('/register')
}
</script>

<template>
  <AuthForm
    v-model="form"
    
    title="Login" 

    :fields="fields"
    
    firstSubmitLabel="Login"
    secondSubmitLabel="Don't have an account? Register"
    
    containerClass="login-form"
    firstButtonClass="btn-login"
    secondButtonClass="btn-create-account"

    @firstSubmitButton="login"
    @secondSubmitButton="createAccount"
  />
</template>