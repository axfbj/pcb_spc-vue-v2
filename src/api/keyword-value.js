import http from './http.js'
export default {
  keywordValue_list(data) {
    return http.post('/spc/keywordValue/list', data)
  },
  keywordValue_save(data) {
    return http.post('/spc/keywordValue/save', data)
  },
  keywordValue_update(data) {
    return http.post('/spc/keywordValue/update', data)
  },
  keywordValue_info(data) {
    return http.post(`/spc/keywordValue/info/${data.id}`, data, 'form')
  },
  keywordValue_delete(data) {
    return http.post('/spc/keywordValue/delete', data)
  }
}
