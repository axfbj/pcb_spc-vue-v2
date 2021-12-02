import http from './http.js'
export default {
  controlChart_list(data) {
    return http.post('/spc/control/chart/queryByControlGroupId', data)
  },
  controlChart_chartType(data) {
    return http.post(`/spc/control/chart/queryControlChartTypeByControlGroupId/${data.controlGroupId}`, data, 'form')
  },
  controlChart_hierarchicalType(data) {
    return http.post('/spc/control/chart/queryHierarchicalTypeByControlGroupId', data)
  },
  controlChart_inspectionItems(data) {
    return http.post(`/spc/control/chart/queryInspectionItemsByControlGroupId/${data.controlGroupId}`, data, 'form')
  }
}
