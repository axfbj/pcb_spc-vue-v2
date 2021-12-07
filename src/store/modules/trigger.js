
const state = {
  triggerRandom: Math.random()
}

const mutations = {
  CHANGE_RANDOM(state) {
    state['triggerRandom'] = Math.random()
  }
}

const actions = {
  changeRandom({ commit }) {
    commit('CHANGE_RANDOM')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

