import http from './http.js'
export default {
  login(data, token) {
    return http.post('/login', data, token)
  },
  getUserInfo(data, token) {
    return http.get('/getUserInfo', data, token)
  }
}
