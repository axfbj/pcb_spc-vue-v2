<template>
  <el-row>
    <container-layout ref="contenter">
      <template v-slot:btns>
        <div style="text-align: right;">
          <ki-button type="primary" :auto-loading="true" @click="cc(...arguments,'1111')">修改</ki-button>
          <ki-button type="warning">备选值</ki-button>
          <el-reference v-model="item2" type="select-dialog-template" />
        </div>
      </template>
      <template v-slot:custum_content>
        <dynamic-table
          v-model="select"
          :header-list="header_list"
          :request="request_data"
          :page-sizes="[20,60,100]"
          fixed-height="100%"
          @current-change="current_change"
          @select="select_callback"
        />
      </template>
    </container-layout>
  </el-row>

</template>

<script>

export default {
  name: 'Test',
  data() {
    return {
      item2: {},
      header_list: [
        { prop: 'doccode', label: '层次类型ID', width: '180' },
        { prop: 'name', label: '层次', width: '180' },
        { prop: 'address', label: '类型名称' }
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
      select: [{
        doccode: 1
      }]
    }
  },

  methods: {
    cc(loddingEnd, f) {
      setTimeout(() => {
        loddingEnd()
      }, 1000)
    },

    click_link(data) {
      console.log(data)
    },

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
      const total = 9
      const list_num = page_no * page_size < total ? page_size : page_size - (page_no * page_size - total)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: Array(list_num).fill({
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }).map((i, index) => {
              const doccode = (page_no - 1) * page_size + index
              console.log(doccode)
              return {
                ...i,
                doccode
              }
            }),
            total
          })
        }, 1000)
      })
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    }
  }
}
</script>

