import http from './http.js'
export default {
  dashboard_getControlChartType(data) {
    return http.post('/spc/index/getControlChartType', data)
  },
  dashboard_getPageByDate(data) {
    return http.post('/spc/index/getPageByDate', data)
  },
  dashboard_getAbnormalGroupByControlGroup(data) { // 按控制组查看异常率
    return http.post('/spc/index/getAbnormalGroupByControlGroup', data)
  },
  dashboard_getAbnormal(data) { // 按图查看异常率
    return http.post('/spc/index/getAbnormal', data)
  },
  getAbnormalGroupByControlGroupId(data) { // 按树查看异常
    return http.post('/spc/index/getAbnormalGroupByControlGroupId', data)
  }
}
