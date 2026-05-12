<template>
  <div class="sd-screen">
    <AppHeader 
      :username="username" 
      :show-username="mode === 'edit'" 
    />
    
    <main class="sd-main">
      <div class="sd-container">
        <StudentDetailForm
          ref="formRef"
          :mode="mode"
          :initial-data="initialData"
          @save="handleSave"
          @back="handleBack"
          @generateCode="generateCode"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import AppHeader from '../../components/screenList/Header.vue'
import StudentDetailForm, { type StudentFormData } from '../../components/screenList/StudentDetailForm.vue'
import {
  createStudentApi,
  generateStudentCodeApi,
  getStudentDetailApi,
  updateStudentApi,
} from '@/api/axios'

const route = useRoute()
const router = useRouter()
const formRef = ref<InstanceType<typeof StudentDetailForm> | null>(null)

const mode = computed<'add' | 'edit'>(() => (route.params.id ? 'edit' : 'add'))

// Mock user information
const username = 'NguyenVanA' // Using the ID from the mockup image / requirements

type StudentDetailInitialData = Partial<StudentFormData> | null
const initialData = ref<StudentDetailInitialData>(null)

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string> | null
}

function mapErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback
  const data = error.response?.data as ApiErrorResponse | undefined
  const firstFieldError = data?.errors ? Object.values(data.errors)[0] : undefined
  return firstFieldError ?? data?.message ?? fallback
}

async function loadStudentDetail(studentId: number) {
  const response = await getStudentDetailApi(studentId)
  initialData.value = {
    studentId: response.result.studentId,
    studentCode: response.result.studentCode,
    studentName: response.result.studentName,
    birthday: response.result.birthday,
    address: response.result.address ?? '',
    averageScore: response.result.averageScore,
  }
}

async function generateCode() {
  try {
    const response = await generateStudentCodeApi()
    formRef.value?.setStudentCode(response.result)
  } catch (error) {
    alert(mapErrorMessage(error, 'Không thể tạo mã sinh viên'))
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
    alert(mapErrorMessage(error, 'Không thể tải dữ liệu sinh viên'))
    router.push('/students')
  }
})

async function handleSave(formData: StudentFormData) {
  try {
    if (mode.value === 'add') {
      const response = await createStudentApi({
        studentCode: formData.studentCode,
        studentName: formData.studentName,
        birthday: formData.birthday,
        address: formData.address,
        averageScore: typeof formData.averageScore === 'number' ? formData.averageScore : null,
      })
      alert(response.message)
      router.push('/students')
      return
    }

    const studentId = Number(route.params.id)
    if (!Number.isFinite(studentId) || studentId <= 0) {
      router.push('/students')
      return
    }
    const response = await updateStudentApi(studentId, {
      studentName: formData.studentName,
      birthday: formData.birthday,
      address: formData.address,
      averageScore: typeof formData.averageScore === 'number' ? formData.averageScore : null,
    })
    alert(response.message)
    router.push('/students')
  } catch (error) {
    alert(mapErrorMessage(error, 'Lưu sinh viên thất bại'))
  }
}

function handleBack() {
  router.push('/students')
}

</script>

<style scoped>
.sd-screen {
  min-height: 100vh;
  background: #f9fafb;
}

.sd-main {
  padding: 40px 24px 60px;
}

.sd-container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
