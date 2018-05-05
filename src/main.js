// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)

// Vue.prototype.$baseUrl = 'http://127.0.0.1:8080'
Vue.prototype.$baseUrl = ''
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.getUrlKey = function (name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || ['', ''])[1].replace(/\+/g, '%20')) || null
}

let loading
// 发起网络请求拦截器
axios.interceptors.request.use(config => {
  loading = ElementUI.Loading.service({
    lock: true,
    text: 'Loading',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  const token = sessionStorage.getItem('token')
  if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = 'Bearer ' + token
  }
  config.headers.Accept = 'application/json'
  return config
}, error => {
  loading.close()
  return Promise.reject(error)
})

// 网络请求返回结果拦截器
axios.interceptors.response.use(response => {
  loading.close()
  return response
}, error => {
  loading.close()
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // 返回 401 清除token信息并跳转到登录页面
        sessionStorage.removeItem('token')
        router.replace({
          path: '/',
          query: {redirect: router.currentRoute.fullPath}
        })
        break
      case 403:
        console.debug(error.response)
        console.debug('无操作权限')
        break
      case 500:
        ElementUI.Message.error(error.response.data)
    }
  } else {
    ElementUI.Message.error('网络连接失败，请检查')
    console.debug('网络连接失败，请检查', error)
  }
  return Promise.reject(error)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
