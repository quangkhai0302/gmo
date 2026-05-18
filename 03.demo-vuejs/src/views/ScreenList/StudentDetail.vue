<template>
  <DashboardLayout
    :title="mode === 'edit' ? 'Cập nhật sinh viên' : 'Thêm sinh viên'"
    breadcrumb="Sinh viên"
    :subtitle="mode === 'edit' ? 'Cập nhật thông tin học tập và liên hệ của hồ sơ hiện có.' : 'Tạo hồ sơ sinh viên mới với mã sinh viên được sinh tự động.'"
  >
    <StudentDetailForm
      ref="formRef"
      :mode="mode"
      :initial-data="initialData"
      @save="handleSave"
      @back="handleBack"
      @generateCode="generateCode"
    />
    <ToastNotification ref="toast" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import StudentDetailForm, { type StudentFormData } from '../../components/screenList/StudentDetailForm.vue'
import ToastNotification from '../../components/screenList/ToastNotification.vue'
import {
  createStudentApi,
  generateStudentCodeApi,
  getStudentDetailApi,
  updateStudentApi,
} from '@/api/axios'
import { parseApiError } from '@/utils/apiError'

const route = useRoute()
const router = useRouter()
const formRef = ref<InstanceType<typeof StudentDetailForm> | null>(null)
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)

const mode = computed<'add' | 'edit'>(() => (route.params.id ? 'edit' : 'add'))

type StudentDetailInitialData = Partial<StudentFormData> | null
const initialData = ref<StudentDetailInitialData>(null)

function mapErrorMessage(error: unknown, fallback: string) {
  return parseApiError(error, fallback).summary
}

async function loadStudentDetail(studentId: number) {
  const response = await getStudentDetailApi(studentId)
  initialData.value = {
    studentId: response.result.studentId,
    studentCode: response.result.studentCode,
    studentName: response.result.studentName,
    birthday: response.result.birthday,
    address: response.result.address ?? '',
    averageScore: response.result.averageScore != null ? String(response.result.averageScore) : null,
  }
}

async function generateCode() {
  try {
    const response = await generateStudentCodeApi()
    formRef.value?.setStudentCode(response.result)
  } catch (error) {
    toast.value?.show(mapErrorMessage(error, 'Không thể tạo mã sinh viên'), 'error')
  }
}

onMounted(async () => {
  try {
    if (mode.value === 'edit') {
      const studentId = Number(route.params.id)
      if (!Number.isFinite(studentId) || studentId <= 0) {
        router.push('/students')
        return
      }
      await loadStudentDetail(studentId)
      return
    }

    await generateCode()
  } catch (error) {
    toast.value?.show(mapErrorMessage(error, 'Không thể tải dữ liệu sinh viên'), 'error')
    router.push('/students')
  }
})

async function handleSave(formData: StudentFormData) {
  const normalizedScore = normalizeAverageScore(formData.averageScore)

  try {
    if (mode.value === 'add') {
      await createStudentApi({
        studentCode: formData.studentCode,
        studentName: formData.studentName,
        birthday: formData.birthday,
        address: formData.address,
        averageScore: normalizedScore,
      })
      router.push({ path: '/students', query: { toast: 'created' } })
      return
    }

    const studentId = Number(route.params.id)
    if (!Number.isFinite(studentId) || studentId <= 0) {
      router.push('/students')
      return
    }

    await updateStudentApi(studentId, {
      studentName: formData.studentName,
      birthday: formData.birthday,
      address: formData.address,
      averageScore: normalizedScore,
    })
    router.push({ path: '/students', query: { toast: 'updated' } })
  } catch (error) {
    toast.value?.show(mapErrorMessage(error, 'Lưu sinh viên thất bại'), 'error')
  }
}

function handleBack() {
  router.push('/students')
}

function normalizeAverageScore(value: string | null): number | null {
  if (value == null) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  const score = Number(trimmed)
  return Number.isNaN(score) ? null : score
}
</script>
