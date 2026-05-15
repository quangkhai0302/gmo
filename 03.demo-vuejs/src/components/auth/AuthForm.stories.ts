import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import AuthForm, { type AuthField } from './AuthForm.vue'

const loginFields: AuthField[] = [
  { key: 'username', type: 'text', placeholder: 'Username' },
  { key: 'password', type: 'password', placeholder: 'Password' },
]

const meta = {
  title: 'Auth/AuthForm',
  component: AuthForm,
  tags: ['autodocs'],
  args: {
    title: 'Login',
    subtitle: 'Sign in to continue',
    fields: loginFields,
    modelValue: { username: '', password: '' },
    firstSubmitLabel: 'Login',
    secondSubmitLabel: 'Create account',
    containerClass: 'login-form',
    firstButtonClass: 'btn-login',
    secondButtonClass: '',
    actionsInline: false,
    buttonOrderReversed: false,
  },
  argTypes: {
    onFirstSubmitButton: { action: 'firstSubmitButton' },
    onSecondSubmitButton: { action: 'secondSubmitButton' },
  },
  render: (args) => ({
    components: { AuthForm },
    setup() {
      const model = ref({ ...args.modelValue })

      watch(
        () => args.modelValue,
        (value) => {
          model.value = { ...value }
        },
        { deep: true }
      )

      return { args, model }
    },
    template: `
      <AuthForm
        v-bind="args"
        :modelValue="model"
        @update:modelValue="model = $event"
      />
    `,
  }),
} satisfies Meta<typeof AuthForm>

export default meta
type Story = StoryObj<typeof meta>

export const Login: Story = {}

export const Register: Story = {
  args: {
    title: 'Register',
    subtitle: '',
    fields: [
      { key: 'username', type: 'text', placeholder: 'username' },
      { key: 'password', type: 'password', placeholder: 'Password' },
      { key: 'confirmPassword', type: 'password', placeholder: 'Confirm Password' },
    ],
    modelValue: { username: '', password: '', confirmPassword: '' },
    firstSubmitLabel: 'Register',
    secondSubmitLabel: 'Back to login',
    containerClass: 'register-form',
    firstButtonClass: 'btn-register',
    secondButtonClass: 'btn-back-to-login',
    actionsInline: true,
  },
}

export const WithErrors: Story = {
  args: {
    errorSummary: 'Please review the highlighted fields.',
    fieldErrors: {
      username: 'Username is required.',
      password: 'Password must be at least 8 characters.',
    },
    modelValue: { username: '', password: '123' },
  },
}
