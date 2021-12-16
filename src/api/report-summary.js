import http from './http.js'
export default {
  abnormalPointExcel(data) {
    return http.post('/spc/excel/abnormalPointExcel', data, 'excel')
  },
  abnormalPointExcelQuery(data) {
    return http.post('/spc/excel/abnormalPointExcelQuery', data)
  },
  inspectionRecordExcel(data) {
    return http.post('/spc/excel/inspectionRecordExcel', data, 'excel')
  },
  processCapabilityExcel(data) {
    return http.post('/spc/excel/processCapabilityExcel', data, 'excel')
  },
  processCapabilityExcelQuery(data) {
    return http.post('/spc/excel/processCapabilityExcelQuery', data)
  },
  yieldRateReportExcel(data) {
    return http.post('/spc/excel/yieldRateReportExcel', data, 'excel')
  },
  yieldRateReportExcelQuery(data) {
    return http.post('/spc/excel/yieldRateReportExcelQuery', data)
  }
}
