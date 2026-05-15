<template>
  <div class="detail-card">
    <div class="detail-card__header">
      <h2 class="detail-card__title">{{ mode === 'edit' ? 'Edit Student' : 'Add Student' }}</h2>
      <span class="detail-card__subtitle">
        {{ mode === 'edit' ? 'Update the details for the existing student.' : 'Fill in the forms below to register a new student.' }}
      </span>
    </div>

    <form @submit.prevent="submitForm" class="detail-form">
      
      <!-- Student ID: Only in edit mode -->
      <div v-if="mode === 'edit'" class="form-field">
        <label for="studentId">Student ID</label>
        <div class="readonly-box">
          <i class="pi pi-lock"></i>
          {{ formData.studentId }}
        </div>
      </div>

      <!-- Student Code -->
      <div class="form-field">
        <label for="studentCode">Student Code</label>
        <div class="input-with-action">
          <InputText
            id="studentCode"
            v-model="formData.studentCode"
            disabled
            class="form-input font-mono"
            placeholder="e.g. STU12345"
          />
          <Button
            v-if="mode === 'add'"
            type="button"
            label="Generate Code"
            icon="pi pi-bolt"
            @click="generateCode"
            severity="secondary"
            class="generate-btn"
          />
        </div>
      </div>

      <!-- Student Name -->
      <div class="form-field">
        <label for="studentName">Student Name</label>
        <InputText
          id="studentName"
          v-model="formData.studentName"
          placeholder="Enter student name"
          class="form-input"
        />
      </div>

      <!-- Birthday -->
      <div class="form-field">
        <label for="birthday">Birthday</label>
        <input
          id="birthday"
          type="date"
          v-model="formData.birthday"
          class="native-date"
        />
      </div>

      <!-- Address -->
      <div class="form-field">
        <label for="address">Address</label>
        <InputText
          id="address"
          v-model="formData.address"
          placeholder="Enter student address (optional)"
          class="form-input"
        />
      </div>

      <!-- Average Score -->
      <div class="form-field">
        <label for="averageScore">Average Score</label>
        <div class="score-wrapper">
          <InputText
            id="averageScore"
            type="text"
            inputmode="decimal"
            v-model="formData.averageScore"
            placeholder="0.0 - 10.0"
            class="form-input"
          />
          <div class="score-indicator" v-if="formData.averageScore !== null && formData.averageScore !== ''">
            <span :class="scoreClass(Number(formData.averageScore))">{{ Number(formData.averageScore).toFixed(1) }}</span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- Actions -->
      <div class="form-actions">
        <Button 
          type="button" 
          label="Back" 
          severity="secondary" 
          outlined
          @click="$emit('back')" 
          class="btn-back"
        />
        <Button 
          type="submit" 
          :label="mode === 'edit' ? 'Save Changes' : 'Create Student'" 
          severity="primary" 
          class="btn-save"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface StudentFormData {
  studentId: number | null
  studentCode: string
  studentName: string
  birthday: string
  address: string
  averageScore: string | null
}

const props = defineProps<{
  mode: 'add' | 'edit'
  initialData: Partial<StudentFormData> | null
}>()

const emit = defineEmits<{
  save: [data: StudentFormData]
  back: []
  generateCode: []
}>()

const formData = reactive<StudentFormData>({
  studentId: null as number | null,
  studentCode: '',
  studentName: '',
  birthday: '', 
  address: '',
  averageScore: null as string | null
})

watch(() => props.initialData, (newVal) => {
  if (!newVal) return
  formData.studentId = newVal.studentId ?? formData.studentId
  formData.studentCode = newVal.studentCode ?? formData.studentCode
  formData.studentName = newVal.studentName ?? formData.studentName
  formData.birthday = newVal.birthday ?? formData.birthday
  formData.address = newVal.address ?? formData.address
  formData.averageScore = newVal.averageScore != null ? String(newVal.averageScore) : formData.averageScore
}, { immediate: true })

function generateCode() {
  emit('generateCode')
}

function scoreClass(score: number) {
  if (score >= 8.5) return 'score--excellent'
  if (score >= 7.0) return 'score--good'
  if (score >= 5.5) return 'score--average'
  return 'score--poor'
}

function submitForm() {
  const submitData = { ...formData }
  
  if (submitData.averageScore === '') {
    submitData.averageScore = null
  }

  emit('save', submitData)
}

function setStudentCode(code: string) {
  formData.studentCode = code
}

defineExpose({ setStudentCode })
</script>

<style scoped>
.detail-card {
  background: var(--color-surface-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card), 0 8px 32px rgba(30, 140, 134, 0.06);
  overflow: hidden;
  border: 1px solid var(--color-border-light);
}

.detail-card__header {
  padding: var(--space-2xl) var(--space-3xl) var(--space-xl);
  background: linear-gradient(to right, var(--color-primary-bg), var(--color-surface-card));
  border-bottom: 1px solid var(--color-border-light);
}

.detail-card__title {
  margin: 0 0 6px 0;
  font-size: 1.5rem;
  font-weight: var(--font-weight-extrabold);
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
}

.detail-card__subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.detail-form {
  padding: var(--space-2xl) var(--space-3xl) var(--space-3xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-field label {
  font-size: 0.875rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Inputs use global PrimeVue overrides (cream bg, teal focus) */

.input-with-action {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.input-with-action > :first-child {
  flex: 1;
}

/* Generate Code button — Gold/Accent themed */
.generate-btn {
  height: 48px;
  padding: 0 20px;
  border-radius: var(--radius-round) !important;
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark)) !important;
  color: var(--color-text-primary) !important;
  border: none !important;
  transition: all var(--transition-bounce);
  box-shadow: var(--shadow-accent-glow);
}

.generate-btn:hover {
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent)) !important;
  box-shadow: 0 4px 16px rgba(255, 210, 63, 0.5) !important;
  transform: translateY(-1px);
}

.generate-btn:active {
  transform: scale(0.95) !important;
}

/* Readonly box */
.readonly-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background-color: var(--color-primary-bg);
  border: 1.5px dashed rgba(43, 168, 162, 0.3);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-bold);
  font-family: monospace;
  font-size: 0.95rem;
}

.readonly-box i {
  color: var(--color-text-muted);
}

.font-mono {
  font-family: monospace;
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.05em;
  color: var(--color-primary-dark) !important;
}

/* Score */
.score-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.score-indicator {
  position: absolute;
  right: 12px;
  pointer-events: none;
}

.score-indicator span {
  display: inline-block;
  padding: 4px 12px;
  border-radius: var(--radius-round);
  font-size: 0.8rem;
  font-weight: var(--font-weight-bold);
}

.score--excellent {
  background: rgba(39, 174, 96, 0.12);
  color: #1a7a42;
  border: 1px solid rgba(39, 174, 96, 0.25);
}

.score--good {
  background: rgba(93, 173, 226, 0.12);
  color: #2471a3;
  border: 1px solid rgba(93, 173, 226, 0.25);
}

.score--average {
  background: rgba(255, 210, 63, 0.15);
  color: #9a7d0a;
  border: 1px solid rgba(255, 210, 63, 0.3);
}

.score--poor {
  background: rgba(239, 108, 74, 0.1);
  color: var(--color-coral-dark);
  border: 1px solid rgba(239, 108, 74, 0.25);
}

/* Divider */
.form-divider {
  height: 1px;
  background-color: var(--color-border-light);
  margin: var(--space-sm) 0;
}

/* Action buttons */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-lg);
}

.btn-back,
.btn-save {
  padding: 12px 28px;
  border-radius: var(--radius-round);
  font-weight: var(--font-weight-bold);
  font-size: 0.95rem;
  transition: all var(--transition-bounce);
}

.btn-back {
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1.5px solid var(--color-border);
}

.btn-back:hover {
  background-color: var(--color-primary-bg);
  color: var(--color-primary-dark);
  border-color: var(--color-primary-light);
}

.btn-back:active {
  transform: scale(0.95);
}

/* Save — Gold gradient CTA */
.btn-save {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-text-primary);
  border: none;
  box-shadow: var(--shadow-accent-glow);
  letter-spacing: 0.02em;
}

.btn-save:hover {
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
  box-shadow: 0 4px 16px rgba(255, 210, 63, 0.5);
  transform: translateY(-2px);
}

.btn-save:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-accent-glow);
}

/* Native date input — styled to match design system */
.native-date {
  width: 100%;
  padding: 11px 16px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-cream);
  font-family: var(--font-family);
  font-size: 0.95rem;
  color: var(--color-text-primary);
  outline: none;
  transition: all var(--transition-base);
  -webkit-appearance: none;
  appearance: none;
}

.native-date:focus {
  background-color: var(--color-surface-card);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.native-date:hover {
  border-color: var(--color-primary-light);
}

.native-date::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.native-date::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Responsive */
@media (max-width: 640px) {
  .detail-card__header,
  .detail-form {
    padding-left: var(--space-xl);
    padding-right: var(--space-xl);
  }

  .input-with-action {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-back,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>
