// import request from '@/utils/request'

export async function login(data) {
  return {
    'code': 20000,
    'data': {
      'token': 'admin-token'
    }
  }
  // return new Promise((reject) => {
  //   // reject({
  //   //   'code': 20000,
  //   //   'data': {
  //   //     'token': 'admin-token'
  //   //   }
  //   // })

  // })
  // return request({
  //   url: '/vue-element-admin/user/login',
  //   method: 'post',
  //   data
  // })
}

export async function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
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
  // return new Promise(() => {

  // })
}

export async function logout() {
  return {
    'code': 20000,
    'data': 'success'
  }
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
}
