<template>
  <el-row>
    <el-col :span="4" style="">
      <container-layout>
        <template v-slot:custum_content>
          <menu-tree
            ref="tree"
            @node-click="node_click"
            @render-after="render_after"
            @path-change="path_change"
          />
        </template>
      </container-layout>
    </el-col>
    <el-col :span="20">
      <container-layout>
        <!-- 表格 -->
        <template v-slot:custum_content>
          <dynamic-table
            v-model="select"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[30,60,120]"
            fixed-height="100%"
            @select="select_callback"
          />
        </template>
      </container-layout>
    </el-col>
  </el-row>

</template>

<script>
import MenuTree from './components/menu-tree'
export default {
  name: 'MenuManagement',
  components: {
    MenuTree
  },
  data() {
    return {
      header_list: [
        { prop: 'id', label: 'id', width: '180' },
        { prop: 'name', label: '姓名', width: '180' },
        { prop: 'address', label: '地址' }
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      checkList: ['选中且禁用', '复选框 A'],
      select2: [],
      select: {}
      // select: [{
      //   id: 1
      // }, {
      //   id: 22
      // }]
    }
  },

  methods: {
    node_click() {},
    render_after() {},
    path_change() {},
    request_data({ page_no, page_size, data }) {
      console.log('------------------', page_no, page_size)
      page_no = Number(page_no)
      page_size = Number(page_size)
      const total = 66
      const list_num = page_no * page_size < total ? page_size : page_size - (page_no * page_size - total)
      console.log(list_num)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: Array(list_num).fill({
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }).map((i, index) => {
              const id = (page_no - 1) * page_size + index
              console.log(id)
              return {
                ...i,
                id
              }
            }),
            total
          })
        }, 10)
      })
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    },
    click_link(data) {
      console.log(data)
    }
  }
}
</script>
