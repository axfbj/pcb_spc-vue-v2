import http from './http.js'
export default {
  inspectionItems_list(data) {
    return http.post('/spc/inspectionItems/list', data)
  },
  inspectionItems_save(data) {
    return http.post('/spc/inspectionItems/save', data)
  },
  inspectionItems_update(data) {
    return http.post('/spc/inspectionItems/update', data)
  },
  inspectionItems_info(data) {
    return http.post(`/spc/inspectionItems/info/${data.id}`, data, 'form')
  },
  inspectionItems_delete(data) {
    return http.post('/spc/inspectionItems/delete', data)
  }
}
