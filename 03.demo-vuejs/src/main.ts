import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import router from './router'

import './style.css'
import 'primeicons/primeicons.css'

const app = createApp(App).use(router)

app.use(PrimeVue, { ripple: true })

app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)

app.mount('#app')
