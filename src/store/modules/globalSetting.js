const state = {
  globalSetting: {
  }
}

const mutations = {
  CHANGE_GLOBALSETTINGS: (state, { key, value }) => {
    state.globalSetting[key] = value
  }
}

const actions = {
  async changeGlobalSettings({ commit }, { key, value }) {
    commit('CHANGE_GLOBALSETTINGS', { key, value })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
