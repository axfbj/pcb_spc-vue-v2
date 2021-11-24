// import axios from 'axios'
import request from './request'
import helper from './helper'
// const qs = require('querystring')

// console.log( process.env.NODE_ENV)
// 判断环境提供baseURL，注意要与后台地址一致
const root = process.env.NODE_ENV === 'development'
  // 开发环境api接口
  ? `http://192.168.1.245:9527/`
  // 生产环境api接口
  : `http://127.0.0.1:9527`
// 引用axios，设置头文件
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
request.defaults.headers.post['Content-Type'] = 'application/json' // raw 格式

function apiAxios(method, url, params, token) {
  // console.log(params)
  // console.log(qs.stringify(params))
  return request({
    method: method,
    // 拼接参数
    url: method === 'GET' || method === 'DELETE' ? helper.queryString(url, params) : url,
    data: method === 'POST' || method === 'PUT' ? JSON.stringify(params) : null,
    baseURL: root,
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: false
  })
}

export default {
  get: function(url, params, token) {
    return apiAxios('GET', url, params, token)
  },
  post: function(url, params, token) {
    return apiAxios('POST', url, params, token)
  },
  put: function(url, params, token) {
    return apiAxios('PUT', url, params, token)
  },
  delete: function(url, params, token) {
    return apiAxios('DELETE', url, params, token)
  }
}
