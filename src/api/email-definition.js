import http from './http.js'
export default {
  email_list(data) {
    return http.post('/spc/email/list', data)
  },
  email_save(data) {
    return http.post('/spc/email/save', data)
  },
  email_update(data) {
    return http.post('/spc/email/update', data)
  },
  email_delete(data) {
    return http.post('/spc/email/delete', data)
  }
}
