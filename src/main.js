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
import {
    Message
} from "element-ui";

let http = axios.create({
    baseURL: 'https://www.hgc-china.com',
    timeout: 5000,
    headers: {
        platform: "PC",
        version: "1.0.0",
        timestamp: Date.parse(new Date())
    }
})



// 请求头拦截
http.interceptors.request.use(config => {
    // console.log(config)
    NProgress.start()
    if (config.url != "/api/login.pub") {
        config.headers.token = window.sessionStorage.getItem('token') || ''
    }
    if (config.url == "/api/gds/category/findLevel" || config.url == "/api/gds/detail") {
        config.headers["Content-Type"] = "application/json"
    }
    return config
})
//响应拦截
http.interceptors.response.use(config => {
        NProgress.done()
        // console.log(config.data)
        if (config.data.code == "1001" || config.data.code == "1007" || config.data.code == "1008" || config.data.code == "1009" || config.data.code == "1010" || config.data.code == "1012" || config.data.code == "1013" || config.data.code == "1017") {
            window.sessionStorage.clear();
            router.push("/login");
        }
        return config
    },
    err => {
        NProgress.done()
        console.log(err);
        Message.error(err + ",网络开小差了哦，请稍后再试");
        return err;
    })
Vue.prototype.$http = http;


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