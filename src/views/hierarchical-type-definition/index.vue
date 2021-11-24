<template>
  <el-row>
    <container-layout ref="contenter">
      <template v-slot:btns>
        <div style="text-align: right;">
          <ki-button
            type="paimary"
            @click="add"
          >添加</ki-button>
          <ki-button
            type="primary"
            @click="edit('1111')"
          >修改</ki-button>
          <el-reference
            v-model="item2"
            type="select-dialog-template"
            style="margin:0 10px"
          >
            <ki-button type="warning">备选值</ki-button>
          </el-reference>

          <ki-message-box
            @next="del"
            @click="del_btn"
          >
            <ki-button type="danger">删除</ki-button>
          </ki-message-box>
        </div>
      </template>
      <template v-slot:custum_content>
        <dynamic-table
          ref="dy_table"
          v-model="select_row"
          :header-list="header_list"
          :request="request_data"
          :page-sizes="[20,60,100]"
          fixed-height="100%"
          :one-page-show-pagination="false"
          @current-change="current_change"
          @select="select_callback"
        />
      </template>
    </container-layout>

    <edit-hierarchical-name-dialog
      :visible="edit_name_dialog"
      @handleClose="handleClose"
      @confirm="confirm"
    />
  </el-row>

</template>

<script>
import EditHierarchicalNameDialog from './components/edit-hierarchicalName'
export default {
  name: 'HierarchicalTypeDefinition',
  components: {
    EditHierarchicalNameDialog
  },
  data() {
    return {
      edit_name_dialog: false,
      item2: {},
      header_list: [
        { prop: 'id', label: '层次类型ID', width: '180' },
        { prop: 'hierarchicalName', label: '类型名称' }
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
      select_row: {
        // id: 1
      },
      tableData: []
    }
  },
  created() {

  },
  methods: {
    confirm() {
      alert(1)
    },
    handleClose() {
      this.edit_name_dialog = false
    },
    add() {
      this.saveList()
    },
    del_btn(open) {
      if (['{}', '[]'].includes(JSON.stringify(this.select_row))) {
        this.$message.warning('请选择一条数据')
        return
      }
      open()
    },
    async del(flag) {
      const ids = typeof this.select_row === 'object' ? [this.select_row.id] : this.select_row.map(item => item.id)
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const res = await this.$api.hierarchicalType_delete(ids)
      if (res === 200) {
        this.$message.success('删除成功！')
      }
      this.$refs.dy_table.refresh()
    },
    async getList() {
      const { data } = await this.$api.hierarchicalType_list({
        page: '1',
        limit: '10',
        sidx: 'id',
        order: 'desc'
      })
      this.tableData = data.list
      console.log(data)
    },
    async saveList() {
      const { data } = await this.$api.hierarchicalType_save({
        id: '9', // 非要传一个0
        hierarchicalName: '3333'
      })
      console.log(data)
      this.$refs.dy_table.refresh()
    },
    edit() {
      this.edit_name_dialog = true
      // setTimeout(() => {
      //   loddingEnd()
      // }, 1000)
    },
    click_link(data) {
      console.log(data)
    },

    current_change(val) {
      console.log('current_change')
      console.log(val)
    },
    async request_data({ page_no, page_size, tableData }) {
      const { data } = await this.$api.hierarchicalType_list({
        page: String(page_no),
        limit: String(page_size),
        sidx: 'id'
        // order: 'desc'
      })
      return {
        data: data.list,
        total: data.totalCount
      }
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    }
  }
}
</script>

