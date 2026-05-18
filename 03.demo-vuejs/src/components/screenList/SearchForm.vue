<template>
  <section class="filter-panel">
    <div class="filter-panel__header">
      <div>
        <h2>Bộ lọc dữ liệu</h2>
        <p>Tìm nhanh theo mã sinh viên, họ tên hoặc ngày sinh.</p>
      </div>
      <button class="filter-panel__reset" type="button" @click="handleReset">
        <i class="pi pi-filter-slash"></i>
        Xóa lọc
      </button>
    </div>

    <div class="filter-panel__grid">
      <label class="filter-field" for="search-student-code">
        <span>Mã sinh viên</span>
        <InputText
          id="search-student-code"
          v-model="form.code"
          placeholder="Ví dụ: SV0001"
          @keydown.enter="handleSearch"
        />
      </label>

      <label class="filter-field" for="search-name">
        <span>Họ và tên</span>
        <InputText
          id="search-name"
          v-model="form.name"
          placeholder="Nhập tên sinh viên"
          @keydown.enter="handleSearch"
        />
      </label>

      <label class="filter-field" for="search-birthday">
        <span>Ngày sinh</span>
        <DatePicker
          id="search-birthday"
          v-model="birthdayDate"
          class="app-datepicker"
          date-format="dd/mm/yy"
          show-icon
          icon-display="button"
          placeholder="Chọn ngày sinh"
          :manual-input="false"
          show-button-bar
        />
      </label>

      <button class="app-button app-button--primary filter-panel__submit" type="button" @click="handleSearch">
        <i class="pi pi-search"></i>
        Tìm kiếm
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import InputText from 'primevue/inputtext'
import DatePicker from 'primevue/datepicker'
import type { SearchForm } from '../../types/student'

const emit = defineEmits<{
  search: [form: SearchForm]
  reset: []
}>()

const SEARCH_DEBOUNCE_MS = 400
const MIN_TEXT_SEARCH_LENGTH = 2
const form = reactive<SearchForm>({ code: '', name: '', birthday: '' })
let searchTimer: number | null = null
let lastSearchKey = toSearchKey({ code: '', name: '', birthday: '' })

const birthdayDate = computed<Date | null>({
  get() {
    return parseDateValue(form.birthday)
  },
  set(value) {
    form.birthday = value ? formatDateValue(value) : ''
  },
})

watch(() => [form.code, form.name, form.birthday], scheduleAutoSearch)

onBeforeUnmount(clearSearchTimer)

function handleSearch() {
  clearSearchTimer()
  const payload = buildSearchPayload()
  lastSearchKey = toSearchKey(payload)

  if (isEmptySearch(payload)) {
    emit('reset')
    return
  }

  emit('search', payload)
}

function handleReset() {
  clearSearchTimer()
  form.code = ''
  form.name = ''
  form.birthday = ''
  lastSearchKey = toSearchKey({ code: '', name: '', birthday: '' })
  emit('reset')
}

function scheduleAutoSearch() {
  clearSearchTimer()
  searchTimer = window.setTimeout(() => {
    const payload = buildSearchPayload()
    const nextSearchKey = toSearchKey(payload)

    if (nextSearchKey === lastSearchKey) return

    lastSearchKey = nextSearchKey
    if (isEmptySearch(payload)) {
      emit('reset')
      return
    }

    emit('search', payload)
  }, SEARCH_DEBOUNCE_MS)
}

function clearSearchTimer() {
  if (searchTimer == null) return
  window.clearTimeout(searchTimer)
  searchTimer = null
}

function buildSearchPayload(): SearchForm {
  const code = form.code.trim()
  const name = form.name.trim()

  return {
    code: code.length >= MIN_TEXT_SEARCH_LENGTH ? code : '',
    name: name.length >= MIN_TEXT_SEARCH_LENGTH ? name : '',
    birthday: form.birthday.trim(),
  }
}

function isEmptySearch(value: SearchForm) {
  return !value.code && !value.name && !value.birthday
}

function toSearchKey(value: SearchForm) {
  return JSON.stringify(value)
}

function parseDateValue(value: string) {
  if (!value) return null
  const parts = value.split(/[/-]/).map(Number)
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null

  if (String(parts[0]).length === 4) {
    return new Date(parts[0], parts[1] - 1, parts[2])
  }

  return new Date(parts[2], parts[1] - 1, parts[0])
}

function formatDateValue(value: Date) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style scoped>
.filter-panel {
  margin-bottom: var(--space-xl);
  padding: var(--space-xl);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.filter-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.filter-panel__header h2 {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0;
}

.filter-panel__header p {
  margin: 4px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.filter-panel__reset {
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-panel__reset:hover {
  background: var(--color-surface-muted);
  color: var(--color-text);
}

.filter-panel__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr)) auto;
  gap: var(--space-lg);
  align-items: end;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filter-field span {
  color: var(--color-text);
  font-size: 13px;
  font-weight: var(--font-weight-bold);
}

.filter-panel__submit {
  min-width: 132px;
}

@media (max-width: 1024px) {
  .filter-panel__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filter-panel__submit {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .filter-panel {
    padding: var(--space-lg);
  }

  .filter-panel__header,
  .filter-panel__grid {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .filter-panel__reset {
    width: 100%;
    justify-content: center;
  }
}
</style>
