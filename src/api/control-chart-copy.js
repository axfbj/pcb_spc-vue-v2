import http from './http.js'
export default {
  copyControlChartContainInspectionRecord(data) {
    return http.post('/spc/control/chart/son/copyControlChartContainInspectionRecord', data)
  },
  copyControlChartNotContainInspectionRecord(data) {
    return http.post('/spc/control/chart/son/copyControlChartNotContainInspectionRecord', data)
  }
}
