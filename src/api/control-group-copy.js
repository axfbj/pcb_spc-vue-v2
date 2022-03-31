import http from './http.js'
export default {
  copyControlGroupNotContainControlChart(data) {
    return http.post('/spc/control/group/copyControlGroupNotContainControlChart', data)
  },
  copyControlGroupContainControlChart(data) {
    return http.post('/spc/control/group/copyControlGroupContainControlChart', data)
  },
  copyControlGroupContainControlChartAndInspectionRecord(data) {
    return http.post('/spc/control/group/copyControlGroupContainControlChartAndInspectionRecord', data)
  }
}
