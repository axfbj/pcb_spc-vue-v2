import http from './http.js'
export default {
  controlChartSon_batchQuery(data) {
    return http.post('/spc/control/chart/son/batchQuery', data)
  },
  controlChartSon_batchUpdate(data) {
    return http.post(`/spc/control/chart/son/batchUpdate`, data)
  },
  controlChartSon_delete(data) {
    return http.post('/spc/control/chart/son/delete', data)
  },
  controlChartSon_info(data) {
    return http.post(`/spc/control/chart/son/info/${data.id}`, data, 'form')
  },
  controlChartSon_generateCode(data) {
    return http.post('/spc/control/chart/son/proGenerateControlChartCode', data)
  },
  controlChartSon_regulatoryCalculation(data) {
    return http.post('/spc/control/chart/son/regulatoryCalculation', data)
  },
  controlChartSon_save(data) {
    return http.post('/spc/control/chart/son/save', data)
  },
  cosaventrolChartSon_update(data) {
    return http.post('/spc/control/chart/son/update', data)
  },
  controlChartSon_data(data) {
    return http.post('/spc/control/chart/son/data', data)
  }
}
