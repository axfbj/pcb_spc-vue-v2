import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// console.log('process.env.VUE_APP_API', process.env.VUE_APP_API)
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: process.env.VUE_APP_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      // config.headers['Cookies'] = `satoken=${getToken()}`
      config.headers['spc-token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    if (response.status === 200) {
      let res = {}
      if (Object.hasOwnProperty.call(response, 'data')) {
        res = response.data
      }

      if (res instanceof Blob) {
        return res
      }
      if (res.code !== '200') {
        if (res.code === '100000') {
          Message({
            message: '会话超时,请重新登录!',
            type: 'error',
            duration: 2 * 1000
          })
          store.dispatch('user/resetToken').then(() => {
            setTimeout(() => {
              location.href = location.pathname
              // location.reload('/login') // 这个会保留重定向路径
            }, 1000)
          })
          // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          //   confirmButtonText: 'Re-Login',
          //   cancelButtonText: 'Cancel',
          //   type: 'warning'
          // }).then(() => {

          // })
          return
        }
        Message({
          message: res.msg,
          type: 'error',
          duration: 5 * 1000
        })
      }
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
