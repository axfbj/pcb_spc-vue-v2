import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Element.Dialog.props.closeOnClickModal.default = false

Vue.use(Element, {
  size: Cookies.get('size') || 'mini'// set element-ui default size
  // locale: enLang // 如果使用中文，无需设置，请删除
})

import api from './api/api.js'
// 定义全局变量
Vue.prototype.$api = api

import echarts from './utils/echartsUi'
Vue.prototype.$echarts = echarts

import ContainerLayout from '@/components/container-layout'
import ContainerTitle from '@/components/container-title'
import DynamicTable from '@/components/dynamic-table'
import DialogLayout from '@/components/dialog-layout'
import ElReference from '@/components/el-reference'
import KiMessageBox from '@/components/ki-message-box'
import KiButton from '@/components/ki-button'
import KiDialog from '@/components/ki-dialog'
import KiTree from '@/components/ki-tree'
Vue.use((Vue) => {
  Vue.component('container-layout', ContainerLayout)
  Vue.component('container-title', ContainerTitle)
  Vue.component('dynamic-table', DynamicTable)
  Vue.component('dialog-layout', DialogLayout)
  Vue.component('el-reference', ElReference)
  Vue.component('ki-message-box', KiMessageBox)
  Vue.component('ki-button', KiButton)
  Vue.component('ki-dialog', KiDialog)
  Vue.component('ki-tree', KiTree)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
