import Vue from 'vue'

import 'normalize.css/normalize.css'// css reset

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.styl' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // 国际化
import './icons' // icon
import './errorLog'// error log
import './permission' // 权限控制
import './mock' // mock数据

import * as filters from './filters' // 全局filter

Vue.use(Element, {
  size: 'medium', 
  i18n: (key, value) => i18n.t(key, value)
})
//注册全局filter
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
