<template>
    <div class="wrapper">
        <div class="login-form">
            <h2 class="title">Login</h2>
            <p class="subtitle">Please login to your account</p>

            <input type="text" placeholder="Username" v-model="username" />
            <input type="password" placeholder="Password" v-model="password" />
            
            <button class="btn-login" @click="login">Login</button>
            <button class="btn-register">Create account</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const login = () => {
    alert('Đăng nhập thành công!');
}

</script>

<style scoped>
    .wrapper {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(135deg, #eef2ff, #f8fafc);
    }
    .login-form {
        width: 400px;
        padding: 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 18px;

        background: white;
        /* border: 1px solid red; */
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

    input {
        width: 100%;
        padding: 12px 14px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        outline: none;
        font-size: 14px;
        transition: all 0.2s ease;
        background: #f9fafb;
    }

    input::placeholder {
        color: #9ca3af;
    }

    input:focus {
        background: white;
        border-color: #4f46e5;
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
    }

    .btn-login {
        width: 100%;
        padding: 12px;
        border-radius: 12px;
        border: none;

        background: #4f46e5;
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;

        transition: all 0.2s ease;
    }
    .btn-login:hover {
        background: #4338ca;
        transform: translateY(-1px);
    }
    .btn-login:active {
        transform: scale(0.98);
    }

    .btn-register {
        width: 100%;
        background: transparent;
        border: none;
        color: #4f46e5;
        font-size: 14px;
        cursor: pointer;
        margin-top: -5px;
    }
    .btn-register:hover {
        text-decoration: underline;
    }

</style>