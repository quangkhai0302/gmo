<script setup lang="ts">
import Card from 'primevue/card'

defineProps<{
  title: string
  subtitle: string
}>()
</script>

<template>
  <div class="wrapper">
    <Card class="auth-card">
      <template #title>
        <h2 class="title">{{ title }}</h2>
      </template>

      <template #subtitle>
        <p class="subtitle">{{ subtitle }}</p>
      </template>

      <template #content>
        <div class="form">
          <slot />
        </div>
      </template>
    </Card>
  </div>
</template>