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

  async changeHtypes({ dispatch, commit }) {
    function saveList(p) {
      return api.hierarchicalType_save(p)
    }
    const list = [ // 针对没有的时候
      {
        'id': 1,
        'hierarchicalName': '产品型号',
        'serialNumber': 1
      },
      {
        'id': 2,
        'hierarchicalName': '产品名称',
        'serialNumber': 2
      },
      {
        'id': 3,
        'hierarchicalName': '产线',
        'serialNumber': 3
      },
      {
        'id': 4,
        'hierarchicalName': '班次',
        'serialNumber': 4
      },
      {
        'id': 5,
        'hierarchicalName': '设备',
        'serialNumber': 5
      },
      {
        'id': 6,
        'hierarchicalName': '供应商',
        'serialNumber': 6
      },
      {
        'id': 7,
        'hierarchicalName': '客户',
        'serialNumber': 7
      },
      {
        'id': 8,
        'hierarchicalName': '批次',
        'serialNumber': 8
      },
      {
        'id': 9,
        'hierarchicalName': '工商单号',
        'serialNumber': 9
      }
    ]

    const { code, data } = await api.hierarchicalType_list({
      page: '1',
      limit: '50',
      sidx: 'id',
      order: 'asc'
    })

    if (code === '200' && data) {
      if (Number(data.totalCount) < 9) {
        const l = list.filter(item1 => {
          return data.list.every(item2 => item1.serialNumber !== item2.serialNumber)
        })
        const arr = []
        l.forEach(async(item) => {
          arr.push(saveList(item))
        })
        Promise.all(arr).then((res) => {
          dispatch('changeHtypes')
        })
      } else {
        commit('CHANGE_HTYPES', data.list)
      }
    }

    // const { code, data } = {
    //   'data': {
    //     'totalCount': '9',
    //     'pageSize': '50',
    //     'totalPage': '1',
    //     'currPage': '1',
    //     'list': [
    //       {
    //         'id': 1,
    //         'hierarchicalName': '产品型号',
    //         'serialNumber': 1
    //       },
    //       {
    //         'id': 2,
    //         'hierarchicalName': '产品名称',
    //         'serialNumber': 2
    //       },
    //       {
    //         'id': 3,
    //         'hierarchicalName': '产线',
    //         'serialNumber': 3
    //       },
    //       {
    //         'id': 4,
    //         'hierarchicalName': '班次',
    //         'serialNumber': 4
    //       },
    //       {
    //         'id': 5,
    //         'hierarchicalName': '设备',
    //         'serialNumber': 5
    //       },
    //       {
    //         'id': 6,
    //         'hierarchicalName': '供应商',
    //         'serialNumber': 6
    //       },
    //       {
    //         'id': 7,
    //         'hierarchicalName': '客户',
    //         'serialNumber': 7
    //       },
    //       {
    //         'id': 8,
    //         'hierarchicalName': '批次',
    //         'serialNumber': 8
    //       },
    //       {
    //         'id': 9,
    //         'hierarchicalName': '工商单号',
    //         'serialNumber': 9
    //       }
    //     ]
    //   },
    //   'code': '200',
    //   'msg': '操作成功'
    // }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

