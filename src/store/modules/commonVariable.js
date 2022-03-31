const state = {
  count_graph: ['p', 'np', 'c', 'u', 'y'],
  chartOptions: [
    {
      value: 'Xbar-R',
      label: 'Xbar-R'
    }, {
      value: 'Xbar-s',
      label: 'Xbar-s'
    }, {
      value: 'X-MR',
      label: 'X-MR'
    }, {
      value: 'p',
      label: 'p'
    }, {
      value: 'np',
      label: 'np'
    },
    {
      value: 'u',
      label: 'u'
    },
    {
      value: 'c',
      label: 'c'
    }, {
      value: 'y',
      label: 'y'
    }
  ],
  parseNum: {
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine'
  },
  parseChartType: {
    'Xbar-R': 1,
    'Xbar-s': 2,
    'X-MR': 3,
    'p': 4,
    'np': 5,
    'c': 6,
    'u': 7,
    'y': 8
  }
}

export default {
  namespaced: true,
  state
//   mutations,
//   actions
}

