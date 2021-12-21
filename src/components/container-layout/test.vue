<template>
  <el-row>
    <el-col :span="4" style="">
      1
    </el-col>
    <el-col :span="20">
      <container-layout ref="contenter">
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

export default {
  name: 'DnamicTableDemo',
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
    async copy(name, title) {
      if (!this.can_copy) return

      await this.can_copy.writeText(`<icon name="${name}" title="${title}" />`)
      this.$message.success('按钮已到剪贴板')
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
      console.log(list_num)
      const d = {
        'data': [
          {
            'id': '1',
            'pid': '0',
            'title': '统计过程控制',
            'href': '',
            'openType': '',
            'type': 0,
            'powerCode': '',
            'children': [
              {
                'id': '2',
                'pid': '1',
                'title': '控制组列表',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '3',
                'pid': '1',
                'title': '层次信息定义',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '4',
                'pid': '1',
                'title': '检测项目定义',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '5',
                'pid': '1',
                'title': '不良项目定义',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '6',
                'pid': '1',
                'title': '失控点处理',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '7',
                'pid': '1',
                'title': '报表汇总',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              }
            ]
          },
          {
            'id': '8',
            'pid': '0',
            'title': '系统管理',
            'href': '',
            'openType': '',
            'type': 0,
            'powerCode': '',
            'children': [
              {
                'id': '9',
                'pid': '8',
                'title': '用户管理',
                'href': '',
                'openType': '',
                'type': 0,
                'powerCode': ''
              },
              {
                'id': '10',
                'pid': '8',
                'title': '权限管理',
                'href': '',
                'openType': '',
                'type': 0,
                'powerCode': ''
              },
              {
                'id': '11',
                'pid': '8',
                'title': '角色管理',
                'href': '',
                'openType': '',
                'type': 0,
                'powerCode': ''
              }
            ]
          },
          {
            'id': '298',
            'pid': '0',
            'title': '',
            'href': '',
            'openType': '',
            'type': 0,
            'powerCode': ''
          }
        ],
        'code': '200',
        'msg': '操作成功'
      }
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: d.data,
            // data: Array(list_num).fill({
            //   date: '2016-05-02',
            //   name: '王小虎',
            //   address: '上海市普陀区金沙江路 1518 弄'
            // }).map((i, index) => {
            //   const id = (page_no - 1) * page_size + index
            //   console.log(id)
            //   return {
            //     ...i,
            //     id
            //   }
            // }),
            total: d.data.length
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
