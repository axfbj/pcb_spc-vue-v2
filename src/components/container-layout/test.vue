<template>
  <el-row>
    <container-title v-if="can_copy"><h2 style="color: red; text-align:center; width: 100%;">---点击复制按钮---</h2></container-title>
    <container-layout style="background: #d9e8ff;">
      <el-button-group v-for="item in icon_list" :key="item.name">
        <template v-for="(title,text) in item">
          <icon :key="text" :name="text" :title="title" @click.native="copy(text,title)" />
        </template>
      </el-button-group>
    </container-layout>
    <container-layout v-model="select" :request="request_data" :page-sizes="[60,80,120]" @current-change="current_change" @select="select_callback">

      <!-- 按钮组 -->
      <!-- <template v-slot:btns>
        <el-button-group>
          <icon name="batch" title="批量" />
          <icon name="excel" title="导入excel" />
          <icon name="forcedel" title="强制删除" />

          <icon name="upload" title="上传" />
          <icon name="open" title="打开" />
          <icon name="see" title="查看" />
          <icon name="shrink" title="收缩" />

          <icon name="spreadout" title="展开" />
          <icon name="returnclose" title="返回" />
          <icon name="approvalform" title="审批表" />
          <icon name="calc" title="计算" />
          <icon name="shift_group" title="分组" />
          <icon name="addtable" title="生成表" />
          <icon name="save" title="保存" />
          <icon name="option" title="选项2" @click.native="copy($event)" />
        </el-button-group>
      </template> -->
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
      <template v-slot:table>
        <el-table-column
          prop="doccode"
          label="doccode"
          width="180"
        >
          <template slot-scope="scope">
            <el-link type="primary" @click="click_link">{{ scope.row.doccode }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180"
        />
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip
        />
      </template>
      <template v-slot:main_footer>
        1111111111111111
      </template>
    </container-layout>
  </el-row>

</template>

<script>
import ContainerLayout from './index'
import icon from '@/components/img-icon'

export default {
  name: 'Test',
  components: {
    ContainerLayout,
    icon
  },
  data() {
    return {
      can_copy: navigator.clipboard,
      icon_list: [
        { 'add': '新增' },
        { 'edit': '编辑' },
        { 'del': '删除' },
        { 'submit': '提交' },
        { 'unsubmit': '取消提交' },
        { 'approval': '审批信息' },
        { 'export': '导出' },
        { 'import': '导入' },
        { 'rolad': '刷新' },
        { 'first': '首单' },
        { 'up': '上单' },
        { 'last': '末单' },
        { 'sure': '确定' },
        { 'clear': '取消' },
        { 'search': '查询' },
        { 'select': '选项' },
        { 'approv': '审核' },
        { 'unapprov': '反审核' },
        { 'returns': '退回' },
        { 'batch': '批量' },
        { 'excel': '导入excel' },
        { 'forcedel': '强制删除' },
        { 'upload': '上传' },
        { 'open': '打开' },
        { 'see': '查看' },
        { 'shrink': '收缩' },
        { 'spreadout': '展开' },
        { 'returnclose': '返回' },
        { 'approvalform': '审批表' },
        { 'calc': '计算' },
        { 'shift_group': '分组' },
        { 'generation_table': '生成表' },
        { 'save': '保存' },
        { 'option': '选项2' },
        { 'lock': '锁定' },
        { 'lock_key': '解锁' },
        { 'calc2': '计算2' }
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
      // select: [{
      //   doccode: 1
      // }, {
      //   doccode: 22
      // }]
      select: { doccode: 30 }
    }
  },

  methods: {
    async copy(name, title) {
      if (!this.can_copy) return

      await this.can_copy.writeText(`<icon name="${name}" title="${title}" />`)
      this.$message.success('按钮已到剪贴板')
    },
    current_change(val) {
      console.log(val)
    },
    request_data({ page_no, page_size, data }) {
      console.log('------------------', page_no, page_size)
      const total = 166
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
