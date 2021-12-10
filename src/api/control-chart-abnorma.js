import http from './http.js'
export default {
  controlChartAbnorma_list(data) {
    return http.post('/spc/controlChartAbnormal/list', data)
  },
  controlChartAbnorma_save(data) {
    return http.post('/spc/controlChartAbnormal/save', data)
  },
  controlChartAbnorma_update(data) {
    return http.post('/spc/controlChartAbnormal/update', data)
  },
  controlChartAbnorma_info(data) {
    return http.post(`/spc/controlChartAbnormal/info/${data.id}`, data, 'form')
  },
  controlChartAbnorma_delete(data) {
    return http.post('/spc/controlChartAbnormal/delete', data)
  }
}
