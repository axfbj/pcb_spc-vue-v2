import api from '@/api/api'
const state = {
  hierarchicalTypes: []
}

const mutations = {
  CHANGE_HTYPES: (state, list) => {
    // eslint-disable-next-line no-prototype-builtins
    state.hierarchicalTypes = list
  }
}

const actions = {
  async changeHtypes({ commit }) {
    const { code, data } = await api.hierarchicalType_list({
      page: '1',
      limit: '50',
      sidx: 'id',
      order: 'asc'
    })
    if (code === '200' && data) {
      commit('CHANGE_HTYPES', data.list)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

