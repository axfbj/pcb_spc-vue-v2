<template>
  <el-row>
    <container-layout ref="contenter">
      <template v-slot:btns>
        <div style="text-align: right;">
          <!-- <ki-button
            type="primary"
            :auto-loading="true"
            @click="cc(...arguments,'1111')"
          >修改</ki-button>
          <el-reference
            v-model="item2"
            type="select-dialog-template"
            style="margin:0 10px"
          >
            <ki-button type="warning">备选值</ki-button>
          </el-reference> -->

          <ki-button
            type="primary"
            @click="add"
          >添加</ki-button>
          <ki-button
            type="warning"
            @click="edit"
          >修改</ki-button>
          <ki-message-box
            :next="del"
            @click="del_btn"
          >
            <ki-button
              type="danger"
              style="margin-left: 10px;"
              @click="del_btn"
            >删除</ki-button>
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
          @current-change="current_change"
          @select="select_callback"
        />
      </template>
    </container-layout>
    <name-edit-dialog
      :visible="name_edit_dialog"
      :select-row="select_row"
      :flag="dialog_flag"
      @handleClose="dialog_close"
      @confirm="refresh"
    />
  </el-row>

</template>

<script>
import NameEditDialog from './components/name-edit-dialog'
export default {
  name: 'TestItemDefinition',
  components: {
    NameEditDialog
  },
  data() {
    return {
      dialog_flag: 'add',
      name_edit_dialog: false,
      item2: {},
      header_list: [
        { prop: 'id', label: '检测项目ID', width: '180' },
        { prop: 'inspectionName', label: '检测项目名称', width: '280' }
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
      select_row: {}
    }
  },

  methods: {
    add() {
      this.dialog_flag = 'add'
      this.name_edit_dialog = true
    },
    edit() {
      if (!this.$refs.dy_table.one_row_select()) return
      this.dialog_flag = 'edit'
      this.name_edit_dialog = true
    },
    del_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    async del(flag) {
      const ids = typeof this.select_row === 'object' ? [this.select_row.id] : this.select_row.map(item => item.id)
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const { code, data } = await this.$api.inspectionItems_delete(ids)
      if (code === '200' && data) {
        this.$message.success('删除成功！')
      }
      this.refresh()
    },
    cc(loddingEnd, f) {
      setTimeout(() => {
        loddingEnd()
      }, 1000)
    },
    refresh() {
      this.$refs.dy_table.refresh()
    },

    click_link(data) {
      console.log(data)
    },
    dialog_close() {
      this.name_edit_dialog = false
    },
    current_change(val) {
      console.log('current_change')
      console.log(val)
    },
    async request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.inspectionItems_list({
        page: page_no,
        limit: page_size,
        order: 'asc'
      })

      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalPage
        }
      }
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    }
  }
}
</script>

