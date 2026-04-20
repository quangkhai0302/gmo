<script setup lang="ts">
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import AuthCard from './../components/AuthCard.vue';

const username = ref('');
const password = ref('');

const login = () => {
    alert(`Đăng nhập thành công!`);
};
</script>

<template>
  <AuthCard title="Login" subtitle="Please login to your account">
    <div class="input-row">
      <i class="pi pi-user"></i>
      <InputText v-model="username" placeholder="Username" class="input-field"/>
    </div>

    <div class="input-row">
      <i class="pi pi-clock"></i>
      <InputText type="password" v-model="password" placeholder="Password" class="input-field"/>
    </div>

    <Button label="Login" class="p-button-primary" @click="login" />
    <Button label="Create account" class="p-button-text" />
  </AuthCard>
</template>
