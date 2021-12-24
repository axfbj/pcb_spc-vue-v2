import http from './http.js'

export function login(data) {
  return http.post('/spc/user/login', data)
}
export function isLogin(data) {
  return http.post('/spc/user/isLogin', data)
}

export async function getInfo(currentUser) {
  // return {
  //   'code': 20000,
  //   'data': {
  //     'roles': [
  //       'admin'
  //     ],
  //     'introduction': 'I am a super administrator',
  //     'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
  //     'name': 'Super Admin'
  //   }
  // }
  return { data: currentUser }
  // return http.post(`/spc/user/info/${data.id}`, data, 'form')
}

export function logout(data) {
  return http.post('/spc/user/loginOut', data)
}
export function userList(data) {
  return http.post('/spc/user/list', data)
}

export function getCurrentUserInfo(data) {
  return http.post(`/spc/user/getCurrentUserInfo`, data)
}
export function userInfo(data) {
  return http.post(`/spc/user/info/${data.id}`, data, 'form')
}
export function resetPwd(data) {
  return http.post(`/spc/user/resetPwd/${data.userId}`, data, 'form')
}
export function updatePwd(data) {
  return http.put(`/spc/user/updatePwd/${data.userId}`, data, 'form')
}
export function user_add_or_update(data) {
  return http.post('/spc/user', data)
}
export function userDelete(data) {
  return http.post('/spc/user/delete', data)
}

const user = {
  userList,
  userInfo,
  resetPwd,
  updatePwd,
  user_add_or_update,
  userDelete
}

export default user
