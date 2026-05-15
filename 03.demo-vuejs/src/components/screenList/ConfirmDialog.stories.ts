import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import ConfirmDialog from './ConfirmDialog.vue'

const meta = {
  title: 'ScreenList/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs'],
  args: {
    visible: true,
    studentName: 'Nguyen Van A',
  },
  render: (args) => ({
    components: { ConfirmDialog },
    setup() {
      const visible = ref(args.visible)
      const message = ref('Waiting for action')

      watch(
        () => args.visible,
        (value) => {
          visible.value = value
        }
      )

      const onConfirm = () => {
        visible.value = false
        message.value = `Confirmed delete: ${args.studentName}`
      }

      const onCancel = () => {
        visible.value = false
        message.value = 'Canceled'
      }

      const reopen = () => {
        visible.value = true
      }

      return { args, visible, message, onConfirm, onCancel, reopen }
    },
    template: `
      <div style="min-height: 220px; width: 500px; max-width: 100%;">
        <button
          style="padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; cursor: pointer;"
          @click="reopen"
        >
          Open dialog
        </button>
        <p style="margin: 10px 0 0; color: #6b7280; font-size: 13px;">{{ message }}</p>
        <ConfirmDialog
          :visible="visible"
          :studentName="args.studentName"
          @confirm="onConfirm"
          @cancel="onCancel"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof ConfirmDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {}
