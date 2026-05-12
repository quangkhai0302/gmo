<template>
  <div class="sl-screen">
    <AppHeader username="Admin" />

    <main class="sl-main">
      <div class="sl-container">
        <!-- Search form -->
        <SearchForm @search="handleSearch" />

        <!-- Table card -->
        <div class="sl-table-card">
          <div class="sl-table-card__header">
            <div class="sl-table-card__title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Student List
            </div>
            <div class="sl-table-actions">
              <button class="sl-add-btn" @click="handleAddStudent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Student
              </button>
            </div>
          </div>

          <StudentTable
            :students="pagedStudents"
            :sort="sortState"
            :start-index="startIndex"
            @sort="handleSort"
            @requestEdit="handleRequestEdit"
            @requestDelete="openDeleteDialog"
          />

          <Pagination
            :current-page="currentPage"
            :total-items="filteredTotal"
            :page-size="PAGE_SIZE"
            @changePage="handlePageChange"
          />
        </div>

      </div>
    </main>

    <ConfirmDialog
      :visible="dialog.visible"
      :student-name="dialog.studentName"
      @confirm="handleConfirmDelete"
      @cancel="dialog.visible = false"
    />

    <ToastNotification ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import AppHeader         from '../../components/screenList/Header.vue'
import SearchForm        from '../../components/screenList/SearchForm.vue'
import StudentTable      from '../../components/screenList/StudentTable.vue'
import Pagination        from '../../components/screenList/Pagination.vue'
import ConfirmDialog     from '../../components/screenList/ConfirmDialog.vue'
import ToastNotification from '../../components/screenList/ToastNotification.vue'

import { deleteStudentApi, getStudentsApi } from '@/api/axios'
import type { Student, SearchForm as ISearchForm, SortState, StudentSortField } from '../../types/student'

const PAGE_SIZE = 10
const router = useRouter()

const students    = ref<Student[]>([])
const currentPage = ref(1)
const filteredTotal = ref(0)
const toast       = ref<InstanceType<typeof ToastNotification> | null>(null)

const searchCriteria = reactive<ISearchForm>({ code: '', name: '', birthday: '' })
const sortState      = reactive<SortState>({ field: null, order: null })
const dialog         = reactive({ visible: false, studentId: 0, studentName: '' })

const startIndex    = computed(() => (currentPage.value - 1) * PAGE_SIZE)
const pagedStudents = computed(() => students.value)

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string> | null
}

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback
  const data = error.response?.data as ApiErrorResponse | undefined
  const firstFieldError = data?.errors ? Object.values(data.errors)[0] : undefined
  return firstFieldError ?? data?.message ?? fallback
}

async function fetchStudents(page = currentPage.value) {
  const response = await getStudentsApi({
    studentCode: searchCriteria.code.trim() || undefined,
    studentName: searchCriteria.name.trim() || undefined,
    birthday: searchCriteria.birthday.trim() || undefined,
    page,
    size: PAGE_SIZE,
    sortField: sortState.field ?? undefined,
    sortOrder: sortState.order ?? undefined,
  })

  students.value = response.result.items
  currentPage.value = response.result.page
  filteredTotal.value = response.result.totalItems
}

onMounted(async () => {
  try {
    await fetchStudents(1)
  } catch (error) {
    toast.value?.show(getErrorMessage(error, 'Không thể tải danh sách sinh viên'), 'error')
  }
})

async function handleSearch(form: ISearchForm) {
  try {
    Object.assign(searchCriteria, form)
    await fetchStudents(1)
  } catch (error) {
    toast.value?.show(getErrorMessage(error, 'Tìm kiếm thất bại'), 'error')
  }
}

async function handleSort(field: StudentSortField) {
  if (sortState.field === field) {
    if      (sortState.order === 'asc')  { sortState.order = 'desc' }
    else if (sortState.order === 'desc') { sortState.field = null; sortState.order = null }
    else    { sortState.order = 'asc' }
  } else {
    sortState.field = field; sortState.order = 'asc'
  }

  try {
    await fetchStudents(1)
  } catch (error) {
    toast.value?.show(getErrorMessage(error, 'Sắp xếp thất bại'), 'error')
  }
}

async function handlePageChange(page: number) {
  try {
    await fetchStudents(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    toast.value?.show(getErrorMessage(error, 'Không thể chuyển trang'), 'error')
  }
}

function openDeleteDialog(student: Student) {
  dialog.studentId = student.id
  dialog.studentName = student.name
  dialog.visible = true
}

async function handleConfirmDelete() {
  try {
    await deleteStudentApi(dialog.studentId)

    const expectedTotal = Math.max(0, filteredTotal.value - 1)
    const maxPageAfterDelete = Math.max(1, Math.ceil(expectedTotal / PAGE_SIZE))
    const targetPage = Math.min(currentPage.value, maxPageAfterDelete)

    await fetchStudents(targetPage)
    toast.value?.show(`Đã xóa sinh viên "${dialog.studentName}" thành công`, 'success')
  } catch (error) {
    toast.value?.show(getErrorMessage(error, 'Xóa sinh viên thất bại'), 'error')
  } finally {
    dialog.visible = false
  }
}

function handleAddStudent() {
  router.push('/students/new')
}

function handleRequestEdit(id: number) {
  router.push(`/students/${id}/edit`)
}
</script>

<style scoped>
.sl-screen {
  min-height: 100vh;
}

.sl-main {
  padding: 28px 24px 60px;
}

.sl-container {
  max-width: 1280px;
  margin: 0 auto;
}
.sl-table-card {
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
}

.sl-table-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.sl-table-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #374151;
}

.sl-table-card__title svg { color: #4f46e5; }

.sl-table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sl-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
  transition: all 0.2s ease;
}

.sl-add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(79, 70, 229, 0.3);
}

.sl-result-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 12px;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #4f46e5;
}
</style>
