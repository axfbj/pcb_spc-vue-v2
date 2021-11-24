import http from './http.js'
export default {
  // login(data, token) {
  //   return http.post('/login', data, token)
  // },
  // getUserInfo(data, token) {
  //   return http.get('/getUserInfo', data, token)
  // },
  hierarchicalType_list(data, token) {
    return http.post('/spc/hierarchicalType/list', data)
  },
  hierarchicalType_save(data, token) {
    return http.post('/spc/hierarchicalType/save', data)
  },
  hierarchicalType_delete(data, token) {
    return http.post('/spc/hierarchicalType/delete', data)
  }
}
