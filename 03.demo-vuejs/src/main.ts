import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Card from 'primevue/card'

const app = createApp(App)

app.use(PrimeVue)

// register component
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Button', Button)
app.component('Card', Card)

app.mount('#app')