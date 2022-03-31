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
  },
  controlChartAbnorma_handle(data) { // 批量处理
    return http.post('/spc/controlChartAbnormal/handle', data)
  },
  controlChartAbnorma_audit(data) { // 批量审核
    return http.post('/spc/controlChartAbnormal/audit', data)
  },
  controlChartAbnorma_auditReversal(data) { // 批量反审核
    return http.post('/spc/controlChartAbnormal/auditReversal', data)
  },
  abnormalMessageByCurrentLogin(data) { // 当前用户登录铃铛信息
    return http.post('/spc/controlChartAbnormal/abnormalMessageByCurrentLogin', data)
  },
  abnormalControlChart_list(data) { // 异常列表主表
    return http.post('/spc/control/chart/abnormalControlChart', data)
  },

  // 3月22日 改动
  listGroupByInspectionRecord(data) {
    return http.post('/spc/controlChartAbnormal/listGroupByInspectionRecord', data)
  },
  abnormalHandleByInspectionRecordId(data) { // 检验单异常处理
    return http.post('/spc/controlChartAbnormal/abnormalHandleByInspectionRecordId', data)
  },
  abnormalHandleReversalByInspectionRecordId(data) { // 检验单异常反处理
    return http.post('/spc/controlChartAbnormal/abnormalHandleReversalByInspectionRecordId', data)
  },
  auditByInspectionRecordId(data) { // 检验单审核
    return http.post('/spc/controlChartAbnormal/auditByInspectionRecordId', data)
  },
  auditReversalByInspectionRecordId(data) { // 检验单反审核
    return http.post('/spc/controlChartAbnormal/auditReversalByInspectionRecordId', data)
  },
  abnormalByInspectionRecordId(data) { // 检验单查询异常
    return http.post(`/spc/controlChartAbnormal/abnormalByInspectionRecordId/${data.inspectionRecordId}`, data, 'form')
  }
}
