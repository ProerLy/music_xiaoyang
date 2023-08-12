import { createApp } from 'vue'
import App from './App.vue'
// 引入路由
import router from './router/index'

// 引入element组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入axios 
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:81/music_qyx/api'

// 引入jq
import jQuery from 'jquery'
// 引入config
// import { QYX_URL } from './config'

// 创建app实例
const app = createApp(App);
// 注册icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
import '@/assets/css/all.css'
// 全局注册axios
app.config.globalProperties.$axios = axios;
// 全局注册jq
app.config.globalProperties.$ = jQuery;
// 全局注册后端接口路径
// app.config.globalProperties.$url = QYX_URL
// axios.defaults.baseURL = '/api';
app.config.productionTip = false;
app.config.errorHandler = () => false;
// 使用路由 use(Router)
app.use(router)
// 使用ElementPlus组件
app.use(ElementPlus)
// 挂载app
app.mount('#app')
