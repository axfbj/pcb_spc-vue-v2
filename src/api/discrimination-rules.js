import http from './http.js'
export default {
  discriminationRules_list(data) {
    return http.post('/spc/discriminationRules/list', data)
  },
  discriminationRules_save(data) {
    return http.post('/spc/discriminationRules/save', data)
  },
  discriminationRules_update(data) {
    return http.post('/spc/discriminationRules/update', data)
  },
  discriminationRules_info(data) {
    return http.post(`/spc/discriminationRules/info/${data.id}`, data, 'form')
  },
  discriminationRules_delete(data) {
    return http.post('/spc/discriminationRules/delete', data)
  }
}
