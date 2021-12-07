<template>
  <ki-dialog
    :visible="visible"
    title="备选值"
    width="40%"
    :footer="false"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
  >
    <!-- 按钮组 -->
    <template v-slot:btns>
      <div style="text-align: right; ">
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
          >删除</ki-button>
        </ki-message-box>
      </div>
    </template>
    <dynamic-table
      ref="dy_table"
      v-model="select_row"
      :auto-init="false"
      :header-list="header_list"
      :request="request_data"
      :page-sizes="[20,60,100]"
      fixed-height="40vh"
      @current-change="current_change"
      @select="select_callback"
    />
    <cu-dialog
      :visible="cu_dialog"
      :select-row="select_row"
      :flag="cu_flag"
      :parent-id="selectRow.id"
      @handleClose="cu_close"
      @confirm="refresh"
    />
  </ki-dialog>
</template>

<script>
import CuDialog from './components/cu-dialog'
export default {
  name: 'KeywordDialog',
  components: {
    CuDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    }
  },
  data() {
    return {
      cu_flag: 'add',
      cu_dialog: false,
      header_list: [
        { prop: 'id', label: '备选值ID', width: '180' },
        { prop: 'keywordName', label: '备选值名称' }
      ],
      select_row: {}
    }
  },
  methods: {
    one_row_select() {
      if (!this.$refs.dy_table.isSelect) {
        this.$message.warning('请选择一条数据')
        return false
      }
      return true
    },
    add() {
      this.cu_flag = 'add'
      this.cu_dialog = true
    },
    edit() {
      if (!this.one_row_select()) return
      this.cu_flag = 'edit'
      this.cu_dialog = true
    },
    del_btn(open) {
      if (!this.one_row_select()) return
      open()
    },
    async del(flag) {
      const ids = Array.isArray(this.select_row) ? this.select_row.map(item => item.id) : [this.select_row.id]
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const { code, data } = await this.$api.keywordValue_delete(ids)
      if (code === '200' && data) {
        this.$message.success('删除成功！')
      }
      this.$refs.dy_table.refresh()
    },
    refresh(params) {
      this.$refs.dy_table.refresh(params)
    },
    current_change(val) {
      console.log('current_change')
      console.log(val)
    },
    async request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.keywordValue_list({
        page: page_no,
        limit: page_size,
        hierarchicalTypeId: Number(this.selectRow.id),
        order: 'asc'
      })
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    },
    click_link(data) {
      console.log(data)
    },
    handleClose() {
      this.$emit('handleClose')
    },
    cu_close() {
      this.cu_dialog = false
    },
    async confirm() {
      this.refresh()
    },
    open({ loading }) {
      this.refresh({ keep: true })
    },
    async opened({ loading }) {
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
