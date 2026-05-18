<template>
  <form class="student-form" @submit.prevent="submitForm">
    <div class="student-form__header">
      <div>
        <span>{{ mode === 'edit' ? 'Edit record' : 'New record' }}</span>
        <h2>{{ mode === 'edit' ? 'Thông tin sinh viên' : 'Tạo hồ sơ sinh viên' }}</h2>
        <p>Thông tin được chia theo nhóm để dễ rà soát trước khi lưu vào hệ thống.</p>
      </div>
      <button class="app-button app-button--secondary" type="button" @click="$emit('back')">
        <i class="pi pi-arrow-left"></i>
        Quay lại
      </button>
    </div>

    <section class="form-section">
      <div class="form-section__title">
        <i class="pi pi-user"></i>
        <div>
          <h3>Thông tin cá nhân</h3>
          <p>Dữ liệu nhận diện cơ bản của sinh viên.</p>
        </div>
      </div>

      <div class="form-grid">
        <label v-if="mode === 'edit'" class="form-field">
          <span>ID hệ thống</span>
          <div class="readonly-box">
            <i class="pi pi-lock"></i>
            {{ formData.studentId }}
          </div>
        </label>

        <label :class="['form-field', { 'form-field--full': mode === 'add' }]">
          <span>Mã sinh viên</span>
          <div class="input-with-action">
            <InputText v-model="formData.studentCode" disabled class="font-mono" placeholder="SV00001" />
            <button v-if="mode === 'add'" class="app-button app-button--outline" type="button" @click="$emit('generateCode')">
              <i class="pi pi-bolt"></i>
              Tạo mã
            </button>
          </div>
          <small>Mã sinh viên được sinh tự động để tránh trùng lặp.</small>
        </label>

        <label class="form-field">
          <span>Họ và tên <b>*</b></span>
          <InputText v-model="formData.studentName" :class="{ 'is-invalid': !!errors.studentName }" placeholder="Nhập họ tên đầy đủ" />
          <small v-if="errors.studentName" class="field-error">{{ errors.studentName }}</small>
        </label>

        <label class="form-field">
          <span>Ngày sinh <b>*</b></span>
          <DatePicker
            v-model="birthdayDate"
            :class="['app-datepicker', { 'is-invalid': !!errors.birthday }]"
            date-format="dd/mm/yy"
            show-icon
            icon-display="button"
            placeholder="Chọn ngày sinh"
            :manual-input="false"
          />
          <small v-if="errors.birthday" class="field-error">{{ errors.birthday }}</small>
        </label>
      </div>
    </section>

    <section class="form-section">
      <div class="form-section__title">
        <i class="pi pi-chart-line"></i>
        <div>
          <h3>Thông tin học tập</h3>
          <p>Theo dõi điểm trung bình và trạng thái học vụ.</p>
        </div>
      </div>

      <div class="form-grid form-grid--two">
        <label class="form-field">
          <span>Điểm trung bình</span>
          <div class="score-wrapper">
            <InputText
              v-model="formData.averageScore"
              :class="{ 'is-invalid': !!errors.averageScore }"
              inputmode="decimal"
              placeholder="0.0 - 10.0"
            />
            <span v-if="scorePreview" :class="['score-preview', scoreClass(Number(formData.averageScore))]">{{ scorePreview }}</span>
          </div>
          <small v-if="errors.averageScore" class="field-error">{{ errors.averageScore }}</small>
          <small v-else>Để trống nếu chưa có điểm tổng kết.</small>
        </label>

        <div class="academic-note">
          <i class="pi pi-info-circle"></i>
          <div>
            <strong>Quy chuẩn đánh giá</strong>
            <p>Điểm từ 8.5 trở lên được đánh dấu xuất sắc, dưới 5.5 cần theo dõi học vụ.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="form-section">
      <div class="form-section__title">
        <i class="pi pi-map-marker"></i>
        <div>
          <h3>Thông tin liên hệ</h3>
          <p>Địa chỉ hoặc ghi chú liên hệ phục vụ quản trị hồ sơ.</p>
        </div>
      </div>

      <label class="form-field">
        <span>Địa chỉ</span>
        <InputText v-model="formData.address" placeholder="Nhập địa chỉ liên hệ" />
        <small>Thông tin này có thể cập nhật sau.</small>
      </label>
    </section>

    <div class="student-form__actions">
      <button class="app-button app-button--secondary" type="button" @click="$emit('back')">Hủy</button>
      <button class="app-button app-button--primary" type="submit">
        <i class="pi pi-check"></i>
        {{ mode === 'edit' ? 'Lưu thay đổi' : 'Tạo sinh viên' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import DatePicker from 'primevue/datepicker'

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
  studentId: null,
  studentCode: '',
  studentName: '',
  birthday: '',
  address: '',
  averageScore: null,
})

const errors = reactive<Record<string, string>>({})

const scorePreview = computed(() => {
  const value = formData.averageScore?.trim()
  if (!value || Number.isNaN(Number(value))) return ''
  return Number(value).toFixed(1)
})

const birthdayDate = computed<Date | null>({
  get() {
    return parseDateValue(formData.birthday)
  },
  set(value) {
    formData.birthday = value ? formatDateValue(value) : ''
  },
})

watch(
  () => props.initialData,
  (newVal) => {
    if (!newVal) return
    formData.studentId = newVal.studentId ?? formData.studentId
    formData.studentCode = newVal.studentCode ?? formData.studentCode
    formData.studentName = newVal.studentName ?? formData.studentName
    formData.birthday = newVal.birthday ?? formData.birthday
    formData.address = newVal.address ?? formData.address
    formData.averageScore = newVal.averageScore != null ? String(newVal.averageScore) : formData.averageScore
  },
  { immediate: true },
)

function scoreClass(score: number) {
  if (score >= 8.5) return 'score-preview--excellent'
  if (score >= 7.0) return 'score-preview--good'
  if (score >= 5.5) return 'score-preview--average'
  return 'score-preview--poor'
}

function validateForm() {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!formData.studentName.trim()) {
    errors.studentName = 'Vui lòng nhập họ tên sinh viên.'
  }

  if (!formData.birthday) {
    errors.birthday = 'Vui lòng chọn ngày sinh.'
  }

  const scoreValue = formData.averageScore?.trim()
  if (scoreValue) {
    const score = Number(scoreValue)
    if (Number.isNaN(score) || score < 0 || score > 10) {
      errors.averageScore = 'Điểm trung bình phải nằm trong khoảng 0 đến 10.'
    }
  }

  return Object.keys(errors).length === 0
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

function submitForm() {
  if (!validateForm()) return
  const submitData = { ...formData }
  if (submitData.averageScore === '') submitData.averageScore = null
  emit('save', submitData)
}

function setStudentCode(code: string) {
  formData.studentCode = code
}

defineExpose({ setStudentCode })
</script>

<style scoped>
.student-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.student-form__header,
.form-section,
.student-form__actions {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.student-form__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  padding: var(--space-xl);
}

.student-form__header span {
  color: var(--color-primary-hover);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
}

.student-form__header h2 {
  margin: 4px 0;
  font-size: 20px;
  letter-spacing: 0;
}

.student-form__header p,
.form-section__title p,
.form-field small,
.academic-note p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.form-section {
  padding: var(--space-xl);
}

.form-section__title {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.form-section__title > i {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: var(--color-primary-subtle);
  color: var(--color-primary-hover);
  flex: 0 0 auto;
}

.form-section__title h3 {
  margin: 0 0 2px;
  font-size: 16px;
  letter-spacing: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xl);
}

.form-grid--two {
  grid-template-columns: minmax(0, 1fr) 360px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  min-width: 0;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field span {
  color: var(--color-text);
  font-size: 13px;
  font-weight: var(--font-weight-bold);
}

.form-field b {
  color: var(--color-danger);
}

.field-error {
  color: var(--color-danger) !important;
  font-weight: var(--font-weight-semibold);
}

.is-invalid,
:deep(.is-invalid.p-inputtext) {
  border-color: var(--color-danger) !important;
  background: var(--color-danger-soft) !important;
}

.input-with-action {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--space-md);
}

.readonly-box,
.academic-note {
  min-height: 42px;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-bold);
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  color: var(--color-primary-hover) !important;
  font-weight: var(--font-weight-bold) !important;
}

.score-wrapper {
  position: relative;
}

.score-wrapper :deep(.p-inputtext) {
  padding-right: 82px !important;
}

.score-preview {
  position: absolute;
  right: 9px;
  top: 50%;
  transform: translateY(-50%);
  min-width: 54px;
  min-height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-round);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
}

.score-preview--excellent,
.score-preview--good {
  background: var(--color-success-soft);
  color: #15803d;
}

.score-preview--average {
  background: var(--color-info-soft);
  color: #2563eb;
}

.score-preview--poor {
  background: var(--color-danger-soft);
  color: var(--color-danger);
}

.academic-note {
  align-items: flex-start;
  min-height: 100%;
  padding: var(--space-lg);
  background: var(--color-background);
  font-weight: var(--font-weight-normal);
}

.academic-note i {
  margin-top: 2px;
  color: var(--color-primary-hover);
}

.academic-note strong {
  display: block;
  margin-bottom: 4px;
  color: var(--color-text);
  font-size: 13px;
}

.student-form__actions {
  position: sticky;
  bottom: var(--space-lg);
  z-index: 5;
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-xl);
}

@media (max-width: 900px) {
  .form-grid,
  .form-grid--two {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .student-form__header {
    align-items: stretch;
    flex-direction: column;
  }

  .input-with-action {
    grid-template-columns: 1fr;
  }

  .student-form__actions {
    position: static;
    flex-direction: column-reverse;
  }

  .student-form__actions .app-button,
  .student-form__header .app-button {
    width: 100%;
  }
}
</style>
