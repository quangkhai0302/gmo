<template>
  <div class="screen-list">
    <AppHeader />

    <main class="screen-list__main">
      <div class="screen-list__container">
        <SearchForm @search="handleSearch" />

        <div class="table-card">
          <div class="table-card__header">
            <div class="table-card__title">
              <i class="pi pi-th-large"></i>
              Student List
            </div>
            <div class="table-card__actions">
              <button class="btn-export" :disabled="exportingCsv" @click="handleExportCsv">
                <i class="pi pi-download"></i>
                {{ exportingCsv ? 'Exporting...' : 'Export CSV' }}
              </button>
              <button class="btn-add" @click="handleAddStudent">
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
.screen-list {
  min-height: 100vh;
}

.screen-list__main {
  padding: var(--space-xl) var(--space-xl) var(--space-4xl);
}

.screen-list__container {
  max-width: 1280px;
  margin: 0 auto;
}

/* ── Table Card ── */
.table-card {
  background: var(--color-surface-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card), 0 8px 32px rgba(30, 140, 134, 0.06);
  border: 1px solid var(--color-border-light);
}

.table-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-border-light);
}

.table-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.table-card__title i {
  color: var(--color-primary);
}

.table-card__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ── Add Student Button — Teal pill ── */
.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: var(--color-text-on-primary);
  border: none;
  padding: 9px 20px;
  border-radius: var(--radius-round);
  font-size: 0.85rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  box-shadow: var(--shadow-teal-glow);
  transition: all var(--transition-bounce);
  font-family: var(--font-family);
  letter-spacing: 0.01em;
}

.btn-add:hover {
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(43, 168, 162, 0.4);
}

.btn-add:active {
  transform: scale(0.95);
}

/* ── Export CSV Button — Gold accent ── */
.btn-export {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 210, 63, 0.12);
  color: var(--color-accent-dark);
  border: 1.5px solid rgba(255, 210, 63, 0.3);
  padding: 9px 20px;
  border-radius: var(--radius-round);
  font-size: 0.85rem;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-bounce);
  font-family: var(--font-family);
}

.btn-export:hover:not(:disabled) {
  background: rgba(255, 210, 63, 0.2);
  transform: translateY(-1px);
  box-shadow: var(--shadow-accent-glow);
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .screen-list__main {
    padding: var(--space-lg) var(--space-lg) var(--space-3xl);
  }

  .table-card__header {
    flex-direction: column;
    gap: var(--space-md);
    align-items: flex-start;
  }

  .table-card__actions {
    width: 100%;
  }

  .btn-add,
  .btn-export {
    flex: 1;
    justify-content: center;
  }
}
</style>
