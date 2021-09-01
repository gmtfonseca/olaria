import { createApp } from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import primeComponents from '@/plugins/prime-components'
import globals from '@/plugins/globals'
import './registerServiceWorker'
import 'animate.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(primeComponents)
app.use(globals)

app.mount('#app')
