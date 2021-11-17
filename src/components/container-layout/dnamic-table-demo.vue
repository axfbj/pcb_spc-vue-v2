<template>
  <el-row>
    <container-layout ref="contenter">
      <!-- 筛选表单 -->
      <template v-slot:form>
        <el-form-item label="单据日期:">
          <el-col :span="11">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
          <el-col class="line" :span="1">至</el-col>
          <el-col :span="11">
            <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-col>
        </el-form-item>
        <el-form-item label="单据编号:">
          <el-input v-model="form.name" style="width:150px" />
        </el-form-item>
        <el-form-item label="保险类别:">
          <el-input v-model="form.name" style="width:150px" />
        </el-form-item>
        <el-form-item label="员工编号:">
          <el-input v-model="form.name" style="width:150px" />
        </el-form-item>

        <el-form-item label="单据状态:">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="未提交" />
            <el-checkbox label="待审批" />
            <el-checkbox label="已审批" />
            <el-checkbox label="已退回" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="dialogVisible = true">查询</el-button>
        </el-form-item>
      </template>
      <!-- 表格 -->
      <template v-slot:custum_content>
        <!-- fixed-height="100%" -->
        <dynamic-table
          v-model="select"
          :header-list="header_list"
          :request="request_data"
          :page-sizes="[30,60,120]"
          fixed-height="50%"
          @current-change="current_change"
          @select="select_callback"
        />
        <dynamic-table
          v-model="select2"
          :header-list="header_list"
          :request="request_data"
          :page-sizes="[30,60,120]"
          fixed-height="50%"
          @current-change="current_change"
          @select="select_callback"
        />
      </template>

      <template v-slot:footer>
        <h3 style="text-align:center;">
          footer插槽 自定义内容与高度
        </h3>
      </template>
    </container-layout>
  </el-row>

</template>

<script>

export default {
  name: 'DnamicTableDemo',
  data() {
    return {
      header_list: [
        { prop: 'doccode', label: 'doccode', width: '180' },
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
      select: [{
        doccode: 1
      }, {
        doccode: 22
      }]
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
    },
    click_link(data) {
      console.log(data)
    }
  }
}
</script>
