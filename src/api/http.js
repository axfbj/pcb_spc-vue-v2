// import axios from 'axios'
import request from './request'
import helper from './helper'
// import { getToken } from '@/utils/auth'
// const qs = require('querystring')

// console.log( process.env.NODE_ENV)
// 判断环境提供baseURL，注意要与后台地址一致
// const root = process.env.NODE_ENV === 'development'
//   // 开发环境api接口
//   // ? `http://192.168.1.245:9527/`
//   ? ``
//   // 生产环境api接口
//   : `http://127.0.0.1:9527`
// // 引用axios，设置头文件

// request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// request.defaults.headers.post['Content-Type'] = 'application/json' // raw 格式

const serialize = data => {
  const list = []
  Object.keys(data).forEach(ele => {
    list.push(`${ele}=${data[ele]}`)
  })
  return list.join('&')
}

async function apiAxios(method, url, params, contentType) {
  if (contentType === 'form') {
    request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  } else {
    request.defaults.headers.post['Content-Type'] = 'application/json'
  }
  // console.log(params)
  // console.log(qs.stringify(params))
  try {
    const p = {
      method: method,
      // 拼接参数
      url: method === 'GET' || method === 'DELETE' ? helper.queryString(url, params) : url,
      data: method === 'POST' || method === 'PUT' ? (contentType === 'form' ? serialize(params) : JSON.stringify(params)) : null,
      // headers: { Authorization: `Bearer ${token}` },
      withCredentials: false
    }
    if (contentType === 'excel') {
      p.responseType = 'blob'
    }
    return await request(p)
  } catch (error) {
    // console.log(error)
    return {
      code: 3000,
      data: false
    }
  }
}

export default {
  get: function(url, params, contentType) {
    return apiAxios('GET', url, params, contentType)
  },
  post: function(url, params, contentType) {
    return apiAxios('POST', url, params, contentType)
  },
  put: function(url, params) {
    return apiAxios('PUT', url, params)
  },
  delete: function(url, params) {
    return apiAxios('DELETE', url, params)
  }
}
