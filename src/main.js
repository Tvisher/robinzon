import { createApp } from 'vue'
import router from "@/router/router";
import { createPinia } from 'pinia'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import './assets/scss/main.scss'
import App from './App.vue'
createApp(App)
    .use(router)
    .use(createPinia())
    .use(VueClipboard)
    .mount('#app')
