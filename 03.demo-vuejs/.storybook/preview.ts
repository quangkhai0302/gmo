import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3-vite'
import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'

import '../src/style.css'
import 'primeicons/primeicons.css'

setup((app) => {
  app.use(PrimeVue, { ripple: true })
  app.component('InputText', InputText)
  app.component('Password', Password)
  app.component('Button', Button)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
}

export default preview
