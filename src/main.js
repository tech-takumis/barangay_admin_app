import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import piniaPersistedState from 'pinia-plugin-persistedstate'
import { getEchoInstance } from './lib/echo'

const app = createApp(App)
const pinia = createPinia()
const echo = getEchoInstance();

app.use(
    pinia.use(({ store }) => {
        store.router = markRaw(router)
    }),
    pinia.use(piniaPersistedState),
)
app.use(router)
app.provide('echo', echo);
app.mount('#app')
