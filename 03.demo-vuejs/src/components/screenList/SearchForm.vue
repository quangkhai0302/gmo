<template>
  <div class="search-card">
    <div class="search-card__grid">
      <!-- Student Code -->
      <div class="search-field">
        <label class="search-field__label" for="search-student-code">Student Code</label>
        <InputText
          id="search-student-code"
          v-model="form.code"
          placeholder="Enter Student Code"
          class="search-field__input"
        />
      </div>

      <!-- Student Name -->
      <div class="search-field">
        <label class="search-field__label" for="search-name">Student Name</label>
        <InputText
          id="search-name"
          v-model="form.name"
          placeholder="Enter student name"
          class="search-field__input"
        />
      </div>

      <!-- Birthday -->
      <div class="search-field">
        <label class="search-field__label" for="search-birthday">Birthday (YYYY/MM/DD)</label>
        <InputText
          id="search-birthday"
          v-model="form.birthday"
          placeholder="YYYY/MM/DD"
          class="search-field__input"
        />
      </div>

      <!-- Search Button -->
      <div class="search-field search-field--btn">
        <button class="search-btn" @click="handleSearch">
          <i class="pi pi-search"></i>
          Search
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import InputText from 'primevue/inputtext'
import type { SearchForm } from '../../types/student'

const emit = defineEmits<{ search: [form: SearchForm] }>()

const form = reactive<SearchForm>({ code: '', name: '', birthday: '' })
function handleSearch() {
  emit('search', { ...form })
}
</script>

<style scoped>
.search-card {
  background: var(--color-surface-card);
  border-radius: var(--radius-lg);
  padding: var(--space-xl) var(--space-xl);
  margin-bottom: var(--space-xl);
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);
}

.search-card__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  align-items: end;
}

.search-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.search-field--btn {
  justify-content: flex-end;
}

.search-field__label {
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-dark);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Inputs inherit global PrimeVue overrides (cream bg, teal focus) */

/* Search Button — Teal pill */
.search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  border: none;
  border-radius: var(--radius-round);
  color: var(--color-text-on-primary);
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-bounce);
  font-family: var(--font-family);
  box-shadow: var(--shadow-teal-glow);
  letter-spacing: 0.01em;
}

.search-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(43, 168, 162, 0.4);
}

.search-btn:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-teal-glow);
}

/* Responsive */
@media (max-width: 640px) {
  .search-card {
    padding: var(--space-lg);
  }

  .search-card__grid {
    grid-template-columns: 1fr;
  }
}
</style>
