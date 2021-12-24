// import { login, logout, getInfo, userInfo } from '@/api/user'
import { login, logout, getCurrentUserInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  currentUser: {},
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_CURRENTUSER: (state, currentUser) => {
  //   state.currentUser = currentUser
  // },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // login({ username: username.trim(), password: password }).then(response => {
      login({ userName: username.trim(), loginPassword: password }).then(response => {
        // const { data } = response
        const { tokenInfo } = response.data
        console.log(tokenInfo)
        commit('SET_TOKEN', tokenInfo.tokenValue)
        setToken(tokenInfo.tokenValue)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // userInfo(state.token).then(response => {
      // console.log('state.loginId', state.loginId)
      getCurrentUserInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const d = {
          roles: data.roleIds.split(','),
          roleCodes: data.roleCodes.split(','),
          name: data.userName || '',
          avatar: '',
          introduction: ''
        }

        if (d.roles.includes('1') || d.roleCodes.includes('admin')) {
          d.roles.push('admin')
        }
        const { roles, name, avatar, introduction } = d
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          // reject('getInfo: roles must be a non-null array!')
          reject('此账户没有分配角色')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(d)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
