import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


axios.defaults.baseURL = 'http://192.168.101.233:11000';
axios.defaults.withCredentials = true;
let headers = {
    platform: "PC",
    version: "1.0.0",
    timestamp: Date.parse(new Date())
}
let that = this;

// 请求头拦截
axios.interceptors.request.use(config => {
    console.log(config)
    NProgress.start()
    config.headers = headers;
    if(config.url != "/api/login.pub") {
    config.headers.token = window.sessionStorage.getItem('token')
    }
    if(config.url == "/api/gds/category/findLevel") {
        config.headers["Content-Type"] = "application/json"
    }

    return config
})
//响应拦截
axios.interceptors.response.use(config => {
    
    NProgress.done()
    console.log(config.data)
    if(config.data.code == "1001" || config.data.code == "1007" || config.data.code == "1008" || config.data.code == "1009" || config.data.code == "1010" || config.data.code == "1012" || config.data.code == "1013" || config.data.code == "1017") {
        window.sessionStorage.clear();
        
      that.$router.push("/login");
    }
    return config
})
Vue.prototype.$http = axios


Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', (originVal) => {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + 1 + '').padStart(2, '0')
    const hh = (dt.getHours() + 1 + '').padStart(2, '0')
    const mm = (dt.getMinutes() + 1 + '').padStart(2, '0')
    const ss = (dt.getSeconds() + 1 + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')