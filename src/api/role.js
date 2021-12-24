import request from '@/utils/request'
import http from './http.js'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles(data) {
  return http.post('/spc/role/list', data)
}

export function getRoleInfo(data) {
  return http.post(`/spc/role/info/${data.id}`, data, 'form')
}

export function addRole(data) {
  return http.post('/spc/role/save', data)
}
export function updateRole(data) {
  return http.post('/spc/role/update', data)
}
export function deleteRole(data) {
  return http.post('/spc/role/delete', data)
}
export function getRolePower(data) {
  return http.post(`/spc/role/getRolePower/${data.roleId}`, data, 'form')
}
export function saveRolePower(data) {
  return http.put('/spc/role/saveRolePower', data)
}
export function saveRoleControlGroupPower(data) {
  return http.put('/spc/role/saveRoleControlGroupPower', data)
}

const role = {
  getRoles,
  getRoleInfo,
  addRole,
  updateRole,
  deleteRole,
  getRolePower,
  saveRolePower,
  saveRoleControlGroupPower
}

export default role
