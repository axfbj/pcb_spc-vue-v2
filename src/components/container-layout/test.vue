<template>
  <el-row>

    <el-col :span="4" style="border-right: 1px solid #ccc;">
      <container-layout ref="left_tree">
        <template v-slot:btns>
          <el-row>
            <el-col :span="8" style="text-align: left; font-size: 14px;">
              控制组列表
            </el-col>
          </el-row>
        </template>
        <template v-slot:custum_content>
          <control-group-tree
            ref="tree"
            @node-click="node_click"
            @render-after="render_after"
            @path-change="path_change"
          />
        </template>
      </container-layout>
    </el-col>

    <el-col :span="20">
      <container-layout ref="contenter">
        <template v-slot:btns>
          <el-row>
            <el-col :span="8" style="text-align: left; font-size: 14px;">
              {{ path || '' }}
            </el-col>
          </el-row>
        </template>
        <!-- 表格 -->
        <template v-slot:custum_content>
          <dynamic-table
            v-model="select"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[30,60,120]"
            fixed-height="100%"
            @current-change="current_change"
            @select="select_callback"
          />
        </template>
      </container-layout>
    </el-col>
  </el-row>

</template>

<script>
import ControlGroupTree from './components/control-group-tree'
export default {
  name: 'DnamicTableDemo',
  components: {
    ControlGroupTree
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
      select: {},
      current_tree_node_data: {},
      path: ''
      // select: [{
      //   id: 1
      // }, {
      //   id: 22
      // }]
    }
  },

  methods: {
    node_click(data, node) {
      this.current_tree_node_data = data
      // this.$refs.dy_table.refresh()
    },
    render_after(currentData) {
      this.current_tree_node_data = currentData
      // this.$refs.dy_table.refresh({ keep: true })
    },
    path_change(path) {
      this.path = path
    },
    current_change(val) {
      console.log('current_change')
      console.log(val)
    },
    request_data({ page_no, page_size, data }) {
      console.log('------------------', page_no, page_size)
      page_no = Number(page_no)
      page_size = Number(page_size)
      const total = 66
      const list_num = page_no * page_size < total ? page_size : page_size - (page_no * page_size - total)
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
            })

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
