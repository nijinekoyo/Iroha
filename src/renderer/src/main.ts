import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from '@renderer/plugins/router/index'

// 修复naive-ui样式被覆盖的问题
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

createApp(App)
    .use(router)
    .mount('#app')
