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
            @click="edit"
          >修改</ki-button>
          <!-- <el-reference
            v-model="item2"
            type="select-dialog-template"
            style="margin:0 10px"
          >
            <ki-button
              type="warning"
              @click="keyword"
            >备选值</ki-button>
          </el-reference> -->

          <ki-button
            type="warning"
            @click="keyword_btn"
          >备选值</ki-button>

          <ki-message-box
            :next="del"
            @click="del_btn"
          >
            <ki-button
              type="danger"
              style="margin-left: 10px;"
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
          :one-page-show-pagination="false"
          @current-change="current_change"
          @select="select_callback"
        />
      </template>
    </container-layout>

    <edit-hierarchical-name-dialog
      :visible="edit_name_dialog"
      :select-row="select_row"
      @handleClose="handleClose"
      @confirm="refresh"
    />
    <keyword-dialog
      :visible="keyword_dialog"
      :select-row="select_row"
      @handleClose="keywordClose"
    />
  </el-row>

</template>

<script>
import EditHierarchicalNameDialog from './components/edit-hierarchicalName'
import { KeywordDialog } from '@/components/ki-reference'
export default {
  name: 'HierarchicalTypeDefinition',
  components: {
    EditHierarchicalNameDialog,
    KeywordDialog
  },
  data() {
    return {
      edit_name_dialog: false,
      keyword_dialog: false,
      item2: {},
      header_list: [
        { prop: 'id', label: '层次类型ID', width: '150' },
        { prop: 'hierarchicalName', label: '类型名称', width: '260' }
      ],
      select_row: {},
      tableData: []
    }
  },
  created() {
  },
  methods: {
    refresh() {
      this.$refs.dy_table.refresh()
    },

    handleClose() {
      this.edit_name_dialog = false
    },
    keywordClose() {
      this.keyword_dialog = false
    },
    add() {
      this.saveList()
    },
    edit() {
      if (!this.$refs.dy_table.one_row_select()) return
      this.edit_name_dialog = true
    },
    keyword_btn() {
      if (!this.$refs.dy_table.one_row_select()) return
      this.keyword_dialog = true
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
      const { code, data } = await this.$api.hierarchicalType_delete(ids)
      if (code === '200' && data) {
        this.$message.success('删除成功！')
      }
      this.$refs.dy_table.refresh()
    },
    async getList() {
      const { data } = await this.$api.hierarchicalType_list({
        page: '1',
        limit: '20',
        sidx: 'id',
        order: 'desc'
      })
      this.tableData = data.list
    },
    async saveList() {
      const { data } = await this.$api.hierarchicalType_save({
        id: '9',
        hierarchicalName: '工商单号'
      })
      console.log(data)
      this.$refs.dy_table.refresh()
    },
    current_change(val) {
      console.log('current_change')
      console.log(val)
    },
    async request_data({ page_no, page_size, table_data }) {
      const { data } = await this.$api.hierarchicalType_list({
        page: page_no,
        limit: page_size,
        sidx: 'id',
        order: 'asc'
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

