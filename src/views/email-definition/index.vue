<template>
  <el-row>
    <container-layout ref="contenter">
      <template v-slot:btns>
        <div style="text-align: right;">
          <!-- v-permission="['badDefinition.save']" -->
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
      <!-- <template v-slot:form>
        <el-form-item
          label="不良代码："
          prop="badCode"
        >
          <el-input
            v-model="form.badCode"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item
          label="不良名称："
          prop="badName"
        >
          <el-input
            v-model="form.badName"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="query"
          >查询</el-button>
        </el-form-item>
      </template> -->
      <template v-slot:custum_content>
        <dynamic-table
          ref="dy_table"
          v-model="select_row"
          :header-list="header_list"
          :request="request_data"
          :page-sizes="[20,60,100]"
          fixed-height="100%"
          @select="select_callback"
        >
          <template v-slot:cell-template="data">
            <template v-if="data.list.template === 'emailUse'">
              <span v-if="data.cellValue === 1">失控审核</span>
              <span v-else type="warning">其他</span>
            </template>
            <template v-else>{{ data.cellValue }}</template>
          </template>

        <!--  -->
        </dynamic-table>
      </template>
    </container-layout>
    <bad-item-dialog
      :visible="bad_item_dialog"
      :select-row="select_row"
      :flag="dialog_flag"
      @handleClose="dialog_close"
      @confirm="refresh"
    />
  </el-row>

</template>

<script>
import badItemDialog from './components/bad-item-dialog'
export default {
  name: 'TestItemDefinition',
  components: {
    badItemDialog
  },
  data() {
    return {
      dialog_flag: 'add',
      bad_item_dialog: false,
      item2: {},
      header_list: [
        { prop: 'emailSmtp', label: 'SMTP服务器', width: '180' },
        { prop: 'emailPort', label: '端口', width: '180' },
        { prop: 'emailAddress', label: '邮箱', width: '180' }
      ],
      form: {
        badCode: '',
        badName: ''
      },
      select_row: {}
    }
  },

  methods: {
    query() {
      this.$refs.dy_table.refresh()
    },
    add() {
      this.dialog_flag = 'add'
      this.bad_item_dialog = true
    },
    edit() {
      if (!this.$refs.dy_table.one_row_select()) return
      this.dialog_flag = 'edit'
      this.bad_item_dialog = true
    },
    del_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    async del(flag) {
      const ids = Array.isArray(this.select_row) ? this.select_row.map(item => item.id) : [this.select_row.id]
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const { code, data } = await this.$api.email_delete(ids)
      if (code === '200' && data) {
        this.$message.success('删除成功！')
      }
      this.refresh()
    },
    refresh() {
      this.$refs.dy_table.refresh()
    },
    dialog_close() {
      this.bad_item_dialog = false
    },
    async request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.email_list({
        // badCode: this.form.badCode || '',
        // badName: this.form.badName || '',
        page: page_no,
        limit: page_size
        // order: 'asc'
      })
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    },
    select_callback(data) {
      // console.log('select_callback：  ', JSON.stringify(data))
    }
  }
}
</script>

