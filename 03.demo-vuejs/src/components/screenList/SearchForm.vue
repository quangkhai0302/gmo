<template>
  <div class="sl-search-form">
    <div class="sl-search-form__grid">
      <!-- Student Code -->
      <div class="sl-field">
        <label class="sl-field__label" for="search-student-code">Student Code</label>
        <InputText
          id="search-student-code"
          v-model="form.code"
          placeholder="Enter Student Code"
          class="sl-field__input"
        />
      </div>

      <!-- Student Name -->
      <div class="sl-field">
        <label class="sl-field__label" for="search-name">Student Name</label>
        <InputText
          id="search-name"
          v-model="form.name"
          placeholder="Enter student name"
          class="sl-field__input"
        />
      </div>

      <!-- Birthday -->
      <div class="sl-field">
        <label class="sl-field__label" for="search-birthday">Birthday (YYYY/MM/DD)</label>
        <InputText
          id="search-birthday"
          v-model="form.birthday"
          placeholder="YYYY/MM/DD"
          class="sl-field__input"
        />
      </div>

      <!-- Search Button -->
      <div class="sl-field sl-field--btn">
        <button class="sl-btn-search" @click="handleSearch">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
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
.sl-search-form {
  background: #ffffff;
  border-radius: 18px;
  padding: 22px 26px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.sl-search-form__title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #4f46e5;
  margin: 0 0 18px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.sl-search-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 14px;
  align-items: end;
}

.sl-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sl-field--btn { justify-content: flex-end; }

.sl-field__label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Input — khớp với auth-input */
.sl-field__input {
  width: 100%;
  padding: 12px 14px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  background: #f9fafb !important;
  color: #111827 !important;
  transition: all 0.2s ease !important;
}
.sl-field__input:focus {
  background: #ffffff !important;
  border-color: #4f46e5 !important;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15) !important;
}
/* Button — khớp với btn-login */
.sl-btn-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 12px 20px;
  background: #4f46e5;
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}
.sl-btn-search:hover {
  background: #4338ca;
  transform: translateY(-1px);
}
.sl-btn-search:active { transform: scale(0.98); }

</style>
