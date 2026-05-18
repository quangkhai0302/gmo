<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import { verifyEmailApi } from '@/api/axios'
import { parseApiError } from '@/utils/apiError'

type VerifyState = 'loading' | 'success' | 'error'

const route = useRoute()
const router = useRouter()
const state = ref<VerifyState>('loading')
const message = ref('Verifying your email...')

const selector = computed(() => String(route.query.selector ?? ''))
const token = computed(() => String(route.query.token ?? ''))

const goToLogin = () => {
  router.push('/login')
}

onMounted(async () => {
  if (!selector.value || !token.value) {
    state.value = 'error'
    message.value = 'Verification link is missing required data.'
    return
  }

  try {
    const response = await verifyEmailApi({
      selector: selector.value,
      token: token.value,
    })
    state.value = 'success'
    message.value = response.message || 'Email verified successfully.'

    window.setTimeout(() => {
      router.push('/login')
    }, 2500)
  } catch (error) {
    const parsed = parseApiError(error, 'Verification link is invalid or expired.')
    state.value = 'error'
    message.value = parsed.summary
  }
})
</script>

<template>
  <main class="verify-page">
    <section class="verify-panel">
      <div :class="['verify-icon', `verify-icon--${state}`]">
        <i v-if="state === 'loading'" class="pi pi-spin pi-spinner"></i>
        <i v-else-if="state === 'success'" class="pi pi-check"></i>
        <i v-else class="pi pi-times"></i>
      </div>

      <h1>{{ state === 'success' ? 'Email verified' : state === 'error' ? 'Verification failed' : 'Checking link' }}</h1>
      <p>{{ message }}</p>

      <Button
        v-if="state !== 'loading'"
        label="Back to login"
        class="verify-button"
        @click="goToLogin"
      />
    </section>
  </main>
</template>

<style scoped>
.verify-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--color-background);
}

.verify-panel {
  width: min(420px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 34px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-card);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.verify-icon {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  font-size: 22px;
}

.verify-icon--loading {
  color: var(--color-primary);
  background: rgba(20, 184, 166, 0.1);
}

.verify-icon--success {
  color: #047857;
  background: rgba(16, 185, 129, 0.12);
}

.verify-icon--error {
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

h1 {
  margin: 0;
  font-size: var(--font-size-h2);
  color: var(--color-text);
}

p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.verify-button.p-button {
  margin-top: 4px;
  justify-content: center;
  min-width: 150px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: #ffffff;
  font-weight: var(--font-weight-bold);
}
</style>
