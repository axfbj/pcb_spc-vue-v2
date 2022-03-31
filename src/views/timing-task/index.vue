<template>
  <container-layout>
    <template v-slot:btns>
      <el-row>
        <span style="float: right;">
          <ki-message-box
            :next="start"
            :text="{
              title:'提示',
              content: '是否开启此定时任务'
            }"
            @click="start_btn"
          >
            <ki-button
              type="success"
              style="margin-left: 10px;"
              icon="el-icon-video-play"
            >开始任务</ki-button>
          </ki-message-box>
          <ki-message-box
            :next="stop"
            :text="{
              title:'提示',
              content: '是否停止此定时任务'
            }"
            @click="stop_btn"
          >
            <ki-button
              type="warning"
              style="margin-left: 10px;"
              icon="el-icon-video-pause"
            >停止任务</ki-button>
          </ki-message-box>
          <ki-button style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="setting_target_dialog_btn('add')">添加</ki-button>
          <ki-button type="warning" icon="el-icon-edit" @click="setting_target_dialog_btn('update')">修改</ki-button>
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
        <template v-slot:cell-template="data">
          <template v-if="data.list.template === 'states'">
            <el-tag v-if="data.cellValue === 0" type="warning">关闭</el-tag>
            <el-tag v-else-if="data.cellValue === 1" type="success">开启</el-tag>
          </template>
          <template v-else>{{ data.cellValue }}</template>
        </template>
      </dynamic-table>
    </template>
    <setting-task-dialog
      :flag="flag"
      :visible="setting_target_dialog"
      :select-row="select_row"
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
      flag: '',
      select_row: {},
      header_list: [
        { prop: 'taskCode', label: '任务编码', width: '150' },
        { prop: 'taskName', label: '任务名称', width: '150' },
        { prop: 'taskStatus', label: '任务状态', width: '80', align: 'center', template: 'states' },
        { prop: 'taskCron', label: 'Cron表达式', width: '150' },
        { prop: 'taskUpdateTime', label: '更新时间', width: '150' }
      ]
    }
  },
  methods: {
    async request_data({ page_no, page_size }) {
      const params = {
        'limit': page_size,
        'page': page_no
        // 'order': 'asc',
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
    start_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    async start(flag) {
      if (flag !== 'Y') return
      const { code, data } = await this.$api.timingTask_start({
        id: this.select_row.id
      })
      if (code === '200' && data) {
        this.$message.success('开始成功')
        this.$refs.dy_table.refresh({ keep: true })
      }
    },
    stop_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    async stop(flag) {
      if (flag !== 'Y') return
      const { code, data } = await this.$api.timingTask_stop({
        id: this.select_row.id
      })
      if (code === '200' && data) {
        this.$message.success('已停止任务')
        this.$refs.dy_table.refresh({ keep: true })
      }
    },
    del_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    async del(flag) {
      if (flag !== 'Y') return
      const { code, data } = await this.$api.timingTask_delete([this.select_row.id])
      if (code === '200' && data) {
        this.$message.success('删除成功')
        this.$refs.dy_table.refresh()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
