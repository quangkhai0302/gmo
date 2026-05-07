<template>
  <div class="sd-screen">
    <AppHeader 
      :username="username" 
      :show-username="mode === 'edit'" 
      @logout="handleLogout" 
    />
    
    <main class="sd-main">
      <div class="sd-container">
        <StudentDetailForm
          :mode="mode"
          :initial-data="initialData"
          @save="handleSave"
          @back="handleBack"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '../../components/screenList/Header.vue'
import StudentDetailForm from '../../components/screenList/StudentDetailForm.vue'

const route = useRoute()
const router = useRouter()

const mode = computed<'add' | 'edit'>(() => (route.params.id ? 'edit' : 'add'))

// Mock user information
const username = 'NguyenVanA' // Using the ID from the mockup image / requirements

const initialData = ref<any>(null)

onMounted(() => {
  if (mode.value === 'edit') {
    // Mock data for edit mode
    initialData.value = {
      studentId: Number(route.params.id) || 1,
      studentCode: "STU12345",
      studentName: "Nguyen Van A",
      birthday: "2000-01-01",
      address: "Hà Nội",
      averageScore: 8.5
    }
  }
})

function handleSave(formData: any) {
  if (mode.value === 'add') {
    console.log("Insert student", formData)
  } else {
    console.log("Update student", formData)
  }
  router.push('/students')
}

function handleBack() {
  router.push('/students')
}

function handleLogout() {
  console.log("Logout")
  router.push('/login')
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
