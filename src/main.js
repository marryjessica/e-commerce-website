import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

axios.defaults.baseURL = 'http://127.0.0.1:8000'

const app = createApp(App)
app.use(store)
app.use(router, axios)
app.use(ElementPlus, { locale })
app.mount('#app')
