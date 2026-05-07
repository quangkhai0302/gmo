<template>
  <div class="sd-form-card">
    <div class="sd-form-header">
      <h2 class="sd-form-title">{{ mode === 'edit' ? 'Edit Student' : 'Add Student' }}</h2>
      <span class="sd-form-subtitle">
        {{ mode === 'edit' ? 'Update the details for the existing student.' : 'Fill in the forms below to register a new student.' }}
      </span>
    </div>

    <form @submit.prevent="submitForm" class="sd-form">
      
      <!-- Student ID: Only in edit mode -->
      <div v-if="mode === 'edit'" class="sd-field">
        <label for="studentId">Student ID</label>
        <div class="sd-readonly-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
          {{ formData.studentId }}
        </div>
      </div>

      <!-- Student Code -->
      <div class="sd-field">
        <label for="studentCode">Student Code <span v-if="mode === 'add'" class="required">*</span></label>
        <div class="sd-input-with-action">
          <InputText
            id="studentCode"
            v-model="formData.studentCode"
            disabled
            maxlength="10"
            class="sd-input w-full font-mono"
            :invalid="!!errors.studentCode"
            placeholder="e.g. STU12345"
          />
          <Button
            v-if="mode === 'add'"
            type="button"
            label="Generate Code"
            icon="pi pi-bolt"
            @click="generateCode"
            severity="secondary"
            class="sd-generate-btn"
          >
            <template #icon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </template>
          </Button>
        </div>
        <small v-if="errors.studentCode" class="p-error">{{ errors.studentCode }}</small>
      </div>

      <!-- Student Name -->
      <div class="sd-field">
        <label for="studentName">Student Name <span class="required">*</span></label>
        <InputText
          id="studentName"
          v-model="formData.studentName"
          maxlength="20"
          :invalid="!!errors.studentName"
          placeholder="Enter student name"
          class="sd-input"
        />
        <small v-if="errors.studentName" class="p-error">{{ errors.studentName }}</small>
      </div>

      <!-- Birthday -->
      <div class="sd-field">
        <label for="birthday">Birthday <span class="required">*</span></label>
        <input
          id="birthday"
          type="date"
          v-model="formData.birthday"
          :max="todayStr"
          :class="['sd-native-date', { 'sd-native-date--error': !!errors.birthday }]"
        />
        <small v-if="errors.birthday" class="p-error">{{ errors.birthday }}</small>
      </div>

      <!-- Address -->
      <div class="sd-field">
        <label for="address">Address</label>
        <InputText
          id="address"
          v-model="formData.address"
          maxlength="255"
          :invalid="!!errors.address"
          placeholder="Enter student address (optional)"
          class="sd-input"
        />
        <small v-if="errors.address" class="p-error">{{ errors.address }}</small>
      </div>

      <!-- Average Score -->
      <div class="sd-field">
        <label for="averageScore">Average Score</label>
        <div class="sd-score-wrapper">
          <InputText
            id="averageScore"
            type="number"
            step="0.1"
            min="0"
            max="10"
            :invalid="!!errors.averageScore"
            placeholder="0.0 - 10.0"
            class="sd-input"
          />
          <div class="sd-score-indicator" v-if="formData.averageScore !== null && formData.averageScore !== '' && !errors.averageScore">
            <span :class="scoreClass(Number(formData.averageScore))">{{ Number(formData.averageScore).toFixed(1) }}</span>
          </div>
        </div>
        <small v-if="errors.averageScore" class="p-error">{{ errors.averageScore }}</small>
      </div>

      <div class="sd-form-divider"></div>

      <!-- Actions -->
      <div class="sd-form-actions">
        <Button 
          type="button" 
          label="Back" 
          severity="secondary" 
          outlined
          @click="$emit('back')" 
          class="sd-btn-back"
        />
        <Button 
          type="submit" 
          :label="mode === 'edit' ? 'Save Changes' : 'Create Student'" 
          severity="primary" 
          class="sd-btn-save"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed } from 'vue'

const props = defineProps<{
  mode: 'add' | 'edit'
  initialData: any
}>()

const emit = defineEmits(['save', 'back'])

// Today string for max date on native input
const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const formData = reactive({
  studentId: null as number | null,
  studentCode: '',
  studentName: '',
  birthday: '',  // YYYY-MM-DD string for native <input type="date">
  address: '',
  averageScore: null as number | string | null
})

const errors = reactive<Record<string, string>>({})

watch(() => props.initialData, (newVal) => {
  if (newVal && props.mode === 'edit') {
    formData.studentId = newVal.studentId
    formData.studentCode = newVal.studentCode
    formData.studentName = newVal.studentName
    formData.birthday = newVal.birthday || ''
    formData.address = newVal.address || ''
    formData.averageScore = newVal.averageScore ?? null
  }
}, { immediate: true })

function generateCode() {
  const random = Math.floor(Math.random() * 90000) + 10000
  formData.studentCode = `STU${random}`
  delete errors.studentCode
}

function scoreClass(score: number) {
  if (score >= 8.5) return 'sd-score--excellent'
  if (score >= 7.0) return 'sd-score--good'
  if (score >= 5.5) return 'sd-score--average'
  return 'sd-score--poor'
}

function validate() {
  let isValid = true
  Object.keys(errors).forEach(k => delete errors[k])

  // Student Code Rule
  if (props.mode === 'add' && (!formData.studentCode || formData.studentCode.trim() === '')) {
    errors.studentCode = 'Student code is required. Please compute a generated code.'
    isValid = false
  }

  // Student Name Rule
  if (!formData.studentName || formData.studentName.trim() === '') {
    errors.studentName = 'Student name is required.'
    isValid = false
  } else if (formData.studentName.length > 20) {
    errors.studentName = 'Maximum length is 20 characters.'
    isValid = false
  }

  // Birthday Rule
  if (!formData.birthday || formData.birthday.trim() === '') {
    errors.birthday = 'Birthday is required.'
    isValid = false
  } else {
    const bdayObj = new Date(formData.birthday)
    if (isNaN(bdayObj.getTime())) {
      errors.birthday = 'Invalid date format.'
      isValid = false
    } else if (formData.birthday > todayStr.value) {
      errors.birthday = 'Birthday cannot be in the future.'
      isValid = false
    }
  }

  // Address Rule
  if (formData.address && formData.address.length > 255) {
    errors.address = 'Maximum length is 255 characters.'
    isValid = false
  }

  // Average Score Rule
  if (formData.averageScore !== null && formData.averageScore !== '') {
    const score = Number(formData.averageScore)
    if (isNaN(score) || score < 0 || score > 10) {
      errors.averageScore = 'Score must be a number between 0 and 10.'
      isValid = false
    }
  }

  return isValid
}

function submitForm() {
  if (validate()) {
    const submitData = { ...formData }
    
    // Format numeric conversions
    if (submitData.averageScore !== null && submitData.averageScore !== '') {
      submitData.averageScore = Number(submitData.averageScore)
    } else {
      submitData.averageScore = null
    }

    emit('save', submitData)
  }
}
</script>

<style scoped>
.sd-form-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.sd-form-header {
  padding: 32px 40px 24px;
  background: linear-gradient(to right, #fbfbfe, #ffffff);
  border-bottom: 1px solid #f3f4f6;
}

.sd-form-title {
  margin: 0 0 6px 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.01em;
}

.sd-form-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
}

.sd-form {
  padding: 32px 40px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sd-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sd-field label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ef4444;
  font-weight: black;
}

/* Base input overrides */
:deep(.sd-input), 
:deep(.sd-datepicker),
.sd-input {
  width: 100%;
}

:deep(.p-inputtext) {
  border-radius: 12px;
  padding: 12px 16px;
  font-family: inherit;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  background-color: #f9fafb;
  border-color: #e5e7eb;
}

:deep(.p-inputtext:enabled:focus) {
  background-color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15) !important;
}

:deep(.p-inputtext:enabled:hover) {
  border-color: #d1d5db;
}

:deep(.p-inputtext:disabled) {
  background-color: #f3f4f6;
  opacity: 1;
  color: #6b7280;
  cursor: not-allowed;
}

:deep(.p-datepicker) {
  width: 100%;
}

.sd-input-with-action {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.sd-input-with-action > :first-child {
  flex: 1;
}

.sd-generate-btn {
  height: 48px;
  padding: 0 20px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
  background-color: #f0fdf4 !important;
  color: #166534 !important;
  border: 1px solid #bbf7d0 !important;
  transition: all 0.2s ease;
}

.sd-generate-btn:hover {
  background-color: #dcfce7 !important;
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.15) !important;
  transform: translateY(-1px);
}

.sd-readonly-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background-color: #f3f4f6;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  color: #4b5563;
  font-weight: 700;
  font-family: monospace;
  font-size: 0.95rem;
}

.sd-readonly-box svg {
  color: #9ca3af;
}

.font-mono {
  font-family: monospace;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #4f46e5 !important;
}

.sd-score-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.sd-score-indicator {
  position: absolute;
  right: 12px;
  pointer-events: none;
}

.sd-score-indicator span {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.sd-score--excellent { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
.sd-score--good      { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
.sd-score--average   { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.sd-score--poor      { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

.p-error {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 4px;
}

.sd-form-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 12px 0;
}

.sd-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.sd-btn-back,
.sd-btn-save {
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.sd-btn-back {
  background-color: transparent;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.sd-btn-back:hover {
  background-color: #f9fafb;
  color: #111827;
  border-color: #9ca3af;
}

.sd-btn-save {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
}

.sd-btn-save:hover {
  background: linear-gradient(135deg, #4338ca, #6d28d9);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
  transform: translateY(-1px);
}


.sd-btn-save:active {
  transform: translateY(0);
}

/* Native date input - styled to match PrimeVue InputText */
.sd-native-date {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #f9fafb;
  font-family: inherit;
  font-size: 0.95rem;
  color: #374151;
  outline: none;
  transition: all 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.sd-native-date:focus {
  background-color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.sd-native-date:hover {
  border-color: #d1d5db;
}

.sd-native-date--error {
  border-color: #ef4444;
}

.sd-native-date--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.sd-native-date::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sd-native-date::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
