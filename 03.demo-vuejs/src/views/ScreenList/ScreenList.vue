<template>
  <DashboardLayout
    title="Sinh viên"
    breadcrumb="Sinh viên"
    eyebrow="Student Records"
    subtitle="Quản lý hồ sơ sinh viên, tìm kiếm, sắp xếp, xuất dữ liệu và thao tác nhanh trên từng bản ghi."
  >
    <template #actions>
      <button class="app-button app-button--secondary" :disabled="exportingCsv" @click="handleExportCsv">
        <i :class="exportingCsv ? 'pi pi-spin pi-spinner' : 'pi pi-download'"></i>
        {{ exportingCsv ? 'Đang xuất' : 'Xuất CSV' }}
      </button>
      <button class="app-button app-button--primary" @click="handleAddStudent">
        <i class="pi pi-plus"></i>
        Thêm sinh viên
      </button>
    </template>

    <SearchForm @search="handleSearch" @reset="handleResetSearch" />

    <section class="student-card">
      <div class="student-card__header">
        <div>
          <h2>Danh sách sinh viên</h2>
          <p>{{ filteredTotal }} hồ sơ trong hệ thống</p>
        </div>

        <div class="student-card__actions">
          <div v-if="selectedIds.length" class="bulk-bar">
            <span>{{ selectedIds.length }} đã chọn</span>
            <button type="button" @click="selectedIds = []">Bỏ chọn</button>
          </div>
          <button class="icon-action" type="button" title="Làm mới" @click="fetchStudents(currentPage)">
            <i class="pi pi-refresh"></i>
          </button>
        </div>
      </div>

      <StudentTable
        :students="pagedStudents"
        :sort="sortState"
        :start-index="startIndex"
        :loading="loading"
        :selected-ids="selectedIds"
        @sort="handleSort"
        @selectionChange="selectedIds = $event"
        @requestEdit="handleRequestEdit"
        @requestDelete="openDeleteDialog"
      />

      <Pagination
        :current-page="currentPage"
        :total-items="filteredTotal"
        :page-size="PAGE_SIZE"
        @changePage="handlePageChange"
      />
    </section>

    <ConfirmDialog
      :visible="dialog.visible"
      :student-name="dialog.studentName"
      @confirm="handleConfirmDelete"
      @cancel="dialog.visible = false"
    />

    <ToastNotification ref="toast" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { deleteStudentApi, getStudentsApi, runStudentExportBatchApi } from '@/api/axios'
import { parseApiError } from '@/utils/apiError'
import type { SearchForm as ISearchForm, SortState, Student, StudentSortField } from '../../types/student'
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
const loading = ref(false)
const selectedIds = ref<number[]>([])

const searchCriteria = reactive<ISearchForm>({ code: '', name: '', birthday: '' })
const sortState = reactive<SortState>({ field: null, order: null })
const dialog = reactive({ visible: false, studentId: 0, studentName: '' })

const startIndex = computed(() => (currentPage.value - 1) * PAGE_SIZE)
const pagedStudents = computed(() => students.value)

function getErrorMessage(error: unknown, fallback: string) {
  return parseApiError(error, fallback).summary
}

async function fetchStudents(page = currentPage.value) {
  loading.value = true
  try {
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
    selectedIds.value = []
  } finally {
    loading.value = false
  }
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

async function handleResetSearch() {
  try {
    Object.assign(searchCriteria, { code: '', name: '', birthday: '' })
    await fetchStudents(1)
  } catch (error) {
    toast.value?.show(getErrorMessage(error, 'Không thể làm mới bộ lọc'), 'error')
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
  if (exportingCsv.value) return

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
  if (!path) return 'student_export.csv'
  const normalized = path.replace(/\\/g, '/')
  const parts = normalized.split('/')
  return parts[parts.length - 1] || 'student_export.csv'
}
</script>

<style scoped>
.student-card {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.student-card__header {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}

.student-card__header h2 {
  margin: 0;
  font-size: 16px;
  letter-spacing: 0;
}

.student-card__header p {
  margin: 3px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.student-card__actions {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.bulk-bar {
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: 0 var(--space-md);
  border: 1px solid rgba(20, 184, 166, 0.24);
  border-radius: var(--radius-md);
  background: var(--color-primary-subtle);
  color: var(--color-primary-hover);
  font-size: 13px;
  font-weight: var(--font-weight-bold);
}

.bulk-bar button {
  border: 0;
  background: transparent;
  color: var(--color-primary-hover);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
}

.icon-action {
  width: 38px;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.icon-action:hover {
  color: var(--color-text);
  border-color: var(--color-border-strong);
  background: var(--color-surface-muted);
}

@media (max-width: 640px) {
  .student-card__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .student-card__actions,
  .bulk-bar {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
