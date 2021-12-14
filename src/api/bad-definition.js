import http from './http.js'
export default {
  badDefinition_list(data) {
    return http.post('/spc/badDefinition/list', data)
  },
  badDefinition_save(data) {
    return http.post('/spc/badDefinition/save', data)
  },
  badDefinition_update(data) {
    return http.post('/spc/badDefinition/update', data)
  },
  badDefinition_info(data) {
    return http.post(`/spc/badDefinition/info/${data.id}`, data, 'form')
  },
  badDefinition_delete(data) {
    return http.post('/spc/badDefinition/delete', data)
  },
  badDefinitionGroup_info(data) {
    return http.post(`/spc/badDefinitionGroup/info/${data.id}`, data, 'form')
  },
  badDefinitionGroup_saveOrUpdateBatch(data) {
    return http.post(`/spc/badDefinitionGroup/saveOrUpdateBatch`, data)
  }
}
