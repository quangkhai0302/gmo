import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'
import ToastService from 'primevue/toastservice'
import router from './router'

import './style.css'

const app = createApp(App).use(router)

app.use(PrimeVue, { ripple: true })
app.use(ToastService)

app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)
app.component('Card', Card)
app.component('Dialog', Dialog)

app.mount('#app')