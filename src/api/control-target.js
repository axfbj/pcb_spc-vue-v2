import http from './http.js'
export default {
  control_target_list(data) {
    return http.post('/spc/control/target/list', data)
  },
  control_target_save(data) {
    return http.post('/spc/control/target/save', data)
  },
  control_target_update(data) {
    return http.post('/spc/control/target/update', data)
  },
  control_target_info(data) {
    return http.post(`/spc/control/target/info/${data.id}`, data, 'form')
  },
  control_target_delete(data) {
    return http.post('/spc/control/target/delete', data)
  }
}
