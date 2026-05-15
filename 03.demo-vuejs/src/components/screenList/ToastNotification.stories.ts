import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { onMounted, ref } from 'vue'
import ToastNotification from './ToastNotification.vue'

const meta = {
  title: 'ScreenList/ToastNotification',
  component: ToastNotification,
  tags: ['autodocs'],
  render: () => ({
    components: { ToastNotification },
    setup() {
      const toastRef = ref<InstanceType<typeof ToastNotification> | null>(null)

      const showSuccess = () => {
        toastRef.value?.show('Student profile updated successfully.', 'success')
      }

      const showError = () => {
        toastRef.value?.show('Unable to save student. Please try again.', 'error')
      }

      onMounted(() => {
        showSuccess()
      })

      return { toastRef, showSuccess, showError }
    },
    template: `
      <div style="width: 560px; max-width: 100%; min-height: 200px;">
        <div style="display: flex; gap: 8px;">
          <button
            style="padding: 8px 12px; border: 1px solid #10b981; border-radius: 8px; color: #065f46; background: #ecfdf5; cursor: pointer;"
            @click="showSuccess"
          >
            Show success
          </button>
          <button
            style="padding: 8px 12px; border: 1px solid #ef4444; border-radius: 8px; color: #991b1b; background: #fef2f2; cursor: pointer;"
            @click="showError"
          >
            Show error
          </button>
        </div>
        <ToastNotification ref="toastRef" />
      </div>
    `,
  }),
} satisfies Meta<typeof ToastNotification>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
