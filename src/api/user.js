import http from './http.js'

export function login(data) {
  return http.post('/spc/user/login', data)
}

export async function getInfo(data) {
  return {
    'code': 20000,
    'data': {
      'roles': [
        'admin'
      ],
      'introduction': 'I am a super administrator',
      'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      'name': 'Super Admin'
    }
  }
  // return http.post(`/spc/user/info/${data.id}`, data, 'form')
}

export function logout(data) {
  return http.post('/spc/user/loginOut', data)
}

// export login(data) {
//   return http.post('/spc/user/login', data)
// }
// export logout(data) {
//   return http.post('/spc/user/loginOut', data)
// }
// export getInfo(data) {
//   return http.post(`/spc/user/info/${data.id}`, data, 'form')
// }
