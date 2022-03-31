import api from '@/api/api'
const state = {
  abnormalMessage: {}
}

const mutations = {
  CHANGE_ABNORMALMESSAGE: (state, msg) => {
    state.abnormalMessage = msg
  }
}

const actions = {
  async changeAbnormalMessage({ commit }) {
    const { code, data } = await api.abnormalMessageByCurrentLogin()
    if (code === '200') {
      commit('CHANGE_ABNORMALMESSAGE', data || 0)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

