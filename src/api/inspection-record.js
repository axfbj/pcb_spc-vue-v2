import http from './http.js'
export default {
  inspectionRecord_queryByControlChartSonId(data) {
    return http.post('/spc/inspectionRecord/queryByControlChartSonId', data)
  },
  inspectionRecord_save(data) {
    return http.post('/spc/inspectionRecord/save', data)
  },
  inspectionRecord_update(data) {
    return http.post('/spc/inspectionRecord/update', data)
  },
  inspectionRecord_info(data) {
    // id  controlChartSonId
    return http.post(`/spc/inspectionRecord/info/${data.id}`, data, 'form')
  },
  inspectionRecord_delete(data) {
    return http.post('/spc/inspectionRecord/delete', data)
  },
  inspectionRecord_queryInspectionRecordDate(data) {
    // id  controlChartSonId
    return http.post(`/spc/inspectionRecord/queryInspectionRecordDate/${data.id}`, data, 'form')
  }

}
