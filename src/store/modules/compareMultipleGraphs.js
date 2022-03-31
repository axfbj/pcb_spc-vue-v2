
const state = {
  // count: { count: 0 },
  rows: []
}

const mutations = {
  increment: state => state.count.count++,
  decrement: state => state.count.count--,
  setChartRows: (state, rows) => {
    state.rows = rows
    // console.log('data', data)
    // console.log('state.data', state.data)
  }
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

