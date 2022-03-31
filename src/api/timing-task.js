import http from './http.js'
export default {
  timingTask_list(data) {
    return http.post('/spc/timing/task/list', data)
  },
  timingTask_save(data) {
    return http.post('/spc/timing/task/save', data)
  },
  timingTask_update(data) {
    return http.post('/spc/timing/task/update', data)
  },
  timingTask_info(data) {
    return http.post(`/spc/timing/task/info/${data.id}`, data, 'form')
  },
  timingTask_delete(data) {
    return http.post('/spc/timing/task/delete', data)
  },
  timingTask_start(data) {
    return http.post(`/spc/timing/task/start/${data.id}`, data, 'form')
  },
  timingTask_end(data) {
    return http.post(`/spc/timing/task/stop/${data.id}`, data, 'form')
  }
}
