
const state = {
  count1: 0
}

const mutations = {
  increment: state => state.count1++,
  decrement: state => state.count1--
}

// const actions = {
//   async increment({ commit }) {
//     commit('increment')
//   }
// }

export default {
  namespaced: true,
  state,
  mutations
  // actions,
}

