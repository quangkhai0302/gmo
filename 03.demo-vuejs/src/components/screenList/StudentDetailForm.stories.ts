import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import StudentDetailForm from './StudentDetailForm.vue'
import type { StudentFormData } from './StudentDetailForm.vue'

const meta = {
  title: 'ScreenList/StudentDetailForm',
  component: StudentDetailForm,
  tags: ['autodocs'],
  args: {
    mode: 'add',
    initialData: {
      studentId: null,
      studentCode: 'STU90001',
      studentName: '',
      birthday: '',
      address: '',
      averageScore: null,
    } as Partial<StudentFormData>,
  },
  parameters: {
    layout: 'padded',
  },
  render: (args) => ({
    components: { StudentDetailForm },
    setup() {
      const formRef = ref<InstanceType<typeof StudentDetailForm> | null>(null)
      const message = ref('No action yet')
      const generatedCount = ref(1)

      const onSave = (payload: StudentFormData) => {
        message.value = `Saved: ${JSON.stringify(payload)}`
      }

      const onBack = () => {
        message.value = 'Back clicked'
      }

      const onGenerateCode = () => {
        generatedCount.value += 1
        const code = `STU${String(90000 + generatedCount.value).padStart(5, '0')}`
        formRef.value?.setStudentCode(code)
        message.value = `Generated code: ${code}`
      }

      return { args, formRef, message, onSave, onBack, onGenerateCode }
    },
    template: `
      <div style="width: 920px; max-width: 100%;">
        <p style="margin: 0 0 10px; color: #6b7280; font-size: 13px;">{{ message }}</p>
        <StudentDetailForm
          ref="formRef"
          :mode="args.mode"
          :initialData="args.initialData"
          @save="onSave"
          @back="onBack"
          @generate-code="onGenerateCode"
        />
      </div>
    `,
  }),
} satisfies Meta<typeof StudentDetailForm>

export default meta
type Story = StoryObj<typeof meta>

export const AddMode: Story = {}

export const EditMode: Story = {
  args: {
    mode: 'edit',
    initialData: {
      studentId: 25,
      studentCode: 'STU00025',
      studentName: 'Nguyen Thi Story',
      birthday: '2001-04-22',
      address: 'Ha Noi',
      averageScore: '8.2',
    },
  },
}
