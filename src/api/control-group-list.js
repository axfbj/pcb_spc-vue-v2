import http from './http.js'
export default {
  hierarchicalType_list(data) {
    return http.post('/spc/hierarchicalType/list', data)
  },
  hierarchicalType_save(data) {
    return http.post('/spc/hierarchicalType/save', data)
  },
  hierarchicalType_update(data) {
    return http.post('/spc/hierarchicalType/update', data)
  },
  hierarchicalType_info(data) {
    return http.post(`/spc/hierarchicalType/info/${data.id}`, data, 'form')
  },
  hierarchicalType_delete(data) {
    return http.post('/spc/hierarchicalType/delete', data)
  }
}
