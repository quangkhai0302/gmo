<script setup lang="ts">
import { ref } from 'vue'

import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import AuthCard from './../components/AuthCard.vue'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const register = () => {
  alert('Đăng ký thành công!')
}
</script>

<template>
  <AuthCard title="Register" subtitle="Create your account">
    <div class="input-row">
      <i class="pi pi-envelope"></i>
      <InputText v-model="email" placeholder="Email" type="email" class="input-field" />
    </div>

    <div class="input-row">
      <i class="pi pi-lock"></i>
      <Password v-model="password" placeholder="Password" class="input-field" />
    </div>

    <div class="input-row">
      <i class="pi pi-lock"></i>
      <Password v-model="confirmPassword" placeholder="Confirm Password" class="input-field" />
    </div>

    <Button label="Register" class="p-button-primary" @click="register" />
  </AuthCard>
</template>
