import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

// CSS
import 'primeicons/primeicons.css'
import './assets/auth.css'

const app = createApp(App)

app.use(PrimeVue, {
	theme: {
		preset: Aura,
		options: {
			darkModeSelector: false
		}
	}
})

app.mount('#app')