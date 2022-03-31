import http from './http.js'
export default {
  warningUsergroup_list(data) {
    return http.post('/spc/warning/user/group/list', data)
  },
  warningUsergroup_save(data) {
    return http.post('/spc/warning/user/group/save', data)
  },
  warningUsergroup_update(data) {
    return http.post('/spc/warning/user/group/update', data)
  },
  warningUsergroup_delete(data) {
    return http.post('/spc/warning/user/group/delete', data)
  },
  warningUser_list(data) {
    return http.post(`/spc/warning/user/group/warningUserQuery/${data.groupId}`, data, 'form')
  },
  warningUsergroup_queryByInspectionItemsId(data) {
    return http.post(`/spc/warning/user/group/queryByInspectionItemsId/${data.inspectionItemsId}`, data, 'form')
  }
}
