import http from './http.js'
export default {
  controlGroup_list(data) {
    return http.post('/spc/control/group/list', data)
  },
  controlGroup_save(data) {
    return http.post('/spc/control/group/save', data)
  },
  controlGroup_update(data) {
    return http.post('/spc/control/group/update', data)
  },
  controlGroup_info(data) {
    return http.post(`/spc/control/group/info/${data.id}`, data, 'form')
  },
  controlGroup_delete(data) {
    return http.post('/spc/control/group/delete', data)
  },
  controlGroup_tree(data) {
    return http.post('/spc/control/group/tree', data)
  }
}
