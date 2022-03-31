<template>
  <container-layout>
    <template v-slot:btns>
      <el-row>
        <span style="float: right;">
          <!-- v-permission="['control.delete']" -->
          <ki-button type="primary" @click="setting_target_dialog_btn">添加</ki-button>

          <ki-message-box
            :next="del"
            @click="del_btn"
          >
            <ki-button
              type="danger"
              style="margin-left: 10px;"
              icon="el-icon-delete"
            >删除</ki-button>
          </ki-message-box>
        </span>
      </el-row>

    </template>
    <template v-slot:custum_content>
      <dynamic-table
        ref="dy_table"
        v-model="select_row"
        :header-list="header_list"
        :request="request_data"
        :page-sizes="[20,60,100]"
        fixed-height="100%"
      >
        <template slot="cell-template" slot-scope="data">
          <status-flag v-if="data.list.template === 'states'" :states="data.cellValue" />
          <!-- <el-link v-if="data.list.template === 'link'" type="primary" @click="detail_dialog(data.scope)">{{ data.cellValue }}</el-link> -->
          <template v-else>{{ data.cellValue }}</template>
        </template>
      </dynamic-table>
    </template>
    <setting-task-dialog
      :visible="setting_target_dialog"
      @handleClose="setting_target_dialog_close"
      @confirm="setting_target_dialog_confirm"
    />
  </container-layout>
</template>

<script>
import settingTaskDialog from './components/add-task-dialog'
import setting_task_dialog from './mixins/add-task-dialog'
export default {
  name: 'TimingTask',
  components: {
    settingTaskDialog
  },
  mixins: [setting_task_dialog],
  data() {
    return {
      select_row: {},
      header_list: [
        { prop: 'taskCode', label: '任务编码', width: '150' },
        { prop: 'taskName', label: '任务名称', width: '150' },
        { prop: 'taskStatus', label: '任务状态', width: '150' },
        { prop: 'taskCron', label: 'Cron表达式', width: '150' },
        { prop: 'taskUpdateTime', label: '更新时间', width: '150' }
      ]
    }
  },
  methods: {
    async request_data({ page_no, page_size, table_data }) {
      const params = {
        'limit': page_size,
        // 'order': 'asc',
        'page': page_no
        // 'sidx': '',
      }
      const { code, data } = await this.$api.timingTask_list(params)
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    },
    del_btn() {},
    del() {}
  }
}
</script>

<style lang="scss" scoped>

</style>
