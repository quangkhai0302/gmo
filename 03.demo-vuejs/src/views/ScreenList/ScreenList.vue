<template>
  <div class="sl-screen">
    <AppHeader />

    <main class="sl-main">
      <div class="sl-container">
        <SearchForm @search="handleSearch" />

        <div class="sl-table-card">
          <div class="sl-table-card__header">
            <div class="sl-table-card__title">
              <i class="pi pi-th-large"></i>
              Student List
            </div>
            <div class="sl-table-actions">
              <button class="sl-export-btn" :disabled="exportingCsv" @click="handleExportCsv">
                <i class="pi pi-download"></i>
                {{ exportingCsv ? 'Exporting...' : 'Export CSV' }}
              </button>
              <button class="sl-add-btn" @click="handleAddStudent">
                <i class="pi pi-plus"></i>
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { deleteStudentApi, getStudentsApi, runStudentExportBatchApi } from '@/api/axios'
import { parseApiError } from '@/utils/apiError'
import type { SearchForm as ISearchForm, SortState, Student, StudentSortField } from '../../types/student'
import AppHeader from '../../components/screenList/Header.vue'
import ConfirmDialog from '../../components/screenList/ConfirmDialog.vue'
import Pagination from '../../components/screenList/Pagination.vue'
import SearchForm from '../../components/screenList/SearchForm.vue'
import StudentTable from '../../components/screenList/StudentTable.vue'
import ToastNotification from '../../components/screenList/ToastNotification.vue'

const PAGE_SIZE = 10
const router = useRouter()
const route = useRoute()

const students = ref<Student[]>([])
const currentPage = ref(1)
const filteredTotal = ref(0)
const toast = ref<InstanceType<typeof ToastNotification> | null>(null)
const exportingCsv = ref(false)

const searchCriteria = reactive<ISearchForm>({ code: '', name: '', birthday: '' })
const sortState = reactive<SortState>({ field: null, order: null })
const dialog = reactive({ visible: false, studentId: 0, studentName: '' })

const startIndex = computed(() => (currentPage.value - 1) * PAGE_SIZE)
const pagedStudents = computed(() => students.value)

function getErrorMessage(error: unknown, fallback: string) {
  return parseApiError(error, fallback).summary
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
    showToastFromRouteQuery()
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
    if (sortState.order === 'asc') {
      sortState.order = 'desc'
    } else if (sortState.order === 'desc') {
      sortState.field = null
      sortState.order = null
    } else {
      sortState.order = 'asc'
    }
  } else {
    sortState.field = field
    sortState.order = 'asc'
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

async function handleExportCsv() {
  if (exportingCsv.value) {
    return
  }

  try {
    exportingCsv.value = true
    const response = await runStudentExportBatchApi()
    const fileName = extractFileName(response.result.outputFile)
    toast.value?.show(`Xuất CSV thành công: ${fileName}`, 'success')
  } catch (error) {
    toast.value?.show(getErrorMessage(error, 'Xuất CSV thất bại'), 'error')
  } finally {
    exportingCsv.value = false
  }
}

function showToastFromRouteQuery() {
  if (route.query.toast === 'created') {
    toast.value?.show('Tạo sinh viên thành công', 'success')
    router.replace('/students')
    return
  }

  if (route.query.toast === 'updated') {
    toast.value?.show('Cập nhật sinh viên thành công', 'success')
    router.replace('/students')
  }
}

function extractFileName(path: string) {
  if (!path) {
    return 'student_export.csv'
  }

  const normalized = path.replace(/\\/g, '/')
  const parts = normalized.split('/')
  const fileName = parts[parts.length - 1]
  return fileName || 'student_export.csv'
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

.sl-table-card__title i {
  color: #4f46e5;
}

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

.sl-export-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sl-export-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(34, 197, 94, 0.2);
}

.sl-export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
