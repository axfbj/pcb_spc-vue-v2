<template>
  <ki-dialog
    :visible="visible"
    title="目标值"
    v-bind="$attrs"
    width="38%"
    :default-footer="false"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <!-- 按钮组 -->
    <template v-slot:btns>
      <div style="text-align: right; ">
        <!-- v-permission="['control.target.save']" -->
        <ki-button
          v-permission="['control.target.save']"
          type="primary"
          @click="add"
        >添加</ki-button>
        <ki-button
          v-permission="['control.target.update']"
          type="warning"
          @click="update"
        >修改</ki-button>
        <ki-message-box
          :next="del"
          @click="del_btn"
        >
          <ki-button
            v-permission="['control.target.delete']"
            type="danger"
            style="margin-left: 10px;"
          >删除</ki-button>
        </ki-message-box>
      </div>
    </template>
    <el-form ref="form" :model="form" inline>
      <el-form-item label="月份:" label-width="60px" prop="month" style="margin: 5px 10px 5px 5px">
        <el-date-picker
          v-model="form.month"
          type="month"
          placeholder="选择月份"
          style="width: 140px;"
        />
      </el-form-item>
      <el-form-item style="margin: 5px 10px;">
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search_btn"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div style="padding: 0">
      <dynamic-table
        ref="dy_table"
        v-model="select_row"
        :header-list="header_list"
        :request="request_data"
        :page-sizes="[30,60,120]"
        fixed-height="400px"
        :auto-init="false"
      >
        <template v-slot:cell-template="data">
          <template v-if="data.list.template === 'yearAndMonth'">
            {{ data.row.targetYear }}-{{ data.row.targetMonth &lt; 10 ? `0${data.row.targetMonth}`: data.row.targetMonth }}
          </template>
          <template v-else>{{ data.cellValue }}</template>
        </template>
      </dynamic-table>
    </div>
    <add-setting-target-dialog
      :flag="flag"
      :select-row="select_row"
      :visible="add_settingTarget_dialog"
      @handleClose="add_settingTarget_dialog_close"
      @confirm="add_settingTarget_dialog_confirm"
    />
  </ki-dialog>
</template>

<script>
import { dateformat } from '@/utils/date-method'

import { mapGetters } from 'vuex'
import addSettingTargetDialog from './components/add-settingTarget-dialog'
import add_setting_target_dialog from './mixins/add-settingTarget-dialog'
export default {
  name: 'SettingTargetDialog',
  flag: '',
  components: {
    addSettingTargetDialog
  },
  mixins: [add_setting_target_dialog],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flag: '',
      select_row: {},
      form: {
        month: ''
      },
      header_list: [
        { prop: 'yearAndMonth', label: '年月', width: '180', template: 'yearAndMonth' },
        { prop: 'targetValue', label: '目标值' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'hierarchicalTypes',
      'userId',
      'username'
    ]),
    targetYear() {
      const year = dateformat(this.form.month, 'YYYY')
      return typeof year === 'string' ? parseInt(year) : ''
    },
    targetMonth() {
      const month = dateformat(this.form.month, 'MM')
      return typeof month === 'string' ? parseInt(month) : ''
    }
  },
  created() {

  },
  methods: {
    async  request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.control_target_list({
        page: page_no,
        limit: page_size,
        // ...this.form
        targetYear: this.targetYear,
        targetMonth: this.targetMonth
      })
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    },
    search_btn() {
      this.$refs.dy_table.refresh()
    },
    clean() {
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$emit('confirm')
    },

    async add(loading) {
      this.flag = 'add'
      this.add_settingTarget_dialog = true
    },
    async update(loading) {
      if (!this.$refs.dy_table.one_row_select()) return
      this.flag = 'update'
      this.add_settingTarget_dialog = true
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
      const { code, data } = await this.$api.control_target_delete(ids)
      if (code === '200' && data) {
        this.$message.success('删除成功！')
      }
      this.$refs.dy_table.refresh()
    },
    async open({ load }) {
      this.$refs.dy_table.refresh({ keep: true })
    },
    closed() {
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
