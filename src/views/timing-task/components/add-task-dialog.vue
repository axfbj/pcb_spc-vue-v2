<template>
  <ki-dialog
    v-bind="$attrs"
    :visible="visible"
    title="定时任务"
    width="30%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <!-- <el-form-item label="月份:" label-width="100px" prop="month">
          <el-date-picker
            v-model="form.month"
            type="month"
            placeholder="选择月份"
            style="width: 100%;"
            @change="month_change"
          />
        </el-form-item>
        <el-form-item
          prop="targetValue"
          label-width="100px"
          label="目标值(%):"
        >
          <el-input-number
            v-model="form.targetValue"
            :controls="false"
            style="width: 100%;"
          />
        </el-form-item> -->

        <el-form-item
          prop="taskCode"
          label="任务编码:"
        >
          <el-input
            v-model="form.taskCode"
            :controls="false"
            style="width: 80%;"
          />
        </el-form-item>
        <el-form-item
          prop="taskName"
          label="任务名称:"
        >
          <el-input
            v-model="form.taskName"
            :controls="false"
            style="width: 80%;"
          />
        </el-form-item>
        <el-form-item
          prop="taskCron"
          label="Cron表达式:"
        >
          <el-input
            v-model="form.taskCron"
            :controls="false"
            style="width: 80%;"
          />
          <ki-button type="warning" style="margin-left: 10px;" @click="setting_target_dialog_btn">设置</ki-button>
        </el-form-item>

        <el-form-item label="状态" prop="taskStatus">
          <el-radio-group v-model="form.taskStatus">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <setting-task-dialog
      :visible="setting_target_dialog"
      @handleClose="setting_target_dialog_close"
      @confirm="setting_target_dialog_confirm"
    />
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import settingTaskDialog from './components/add-task-dialog'
import setting_task_dialog from './mixins/add-task-dialog'
export default {
  name: 'AddTaskDialog',
  components: {
    settingTaskDialog
  },
  mixins: [setting_task_dialog],
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
      flag: '',
      form: {},
      form_data: {
        'taskCode': '',
        'taskName': '',
        'taskCron': '',
        'taskStatus': 0,
        'taskUpdateTime': ''
      },
      rules: {
        'month': [{ required: true, message: '请选择月份', trigger: 'change' }],
        'targetValue': [{ required: true, message: '请输入目标值', trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'username'
    ])
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clean() {
      this.flag = ''
      this.form = {
        month: new Date(),
        targetValue: 0
      }
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.warning('请填写表单中的值')
          return
        }
        loading(true)
        if (this.flag === 'add') {
          this.add(loading)
        } else {
          this.update(loading)
        }
      })
    },
    async add(loading) {
      // const { code, data } = await this.$api.control_target_save({
      //   targetYear: this.targetYear,
      //   targetMonth: this.targetMonth,
      //   targetValue: this.form.targetValue
      // })
      // if (code === '200' && data) {
      //   this.$emit('confirm')
      // }
      // loading(false)
    },
    async update(loading) {
      // const { code, data } = await this.$api.control_target_update({
      //   ...this.form,
      //   targetYear: this.targetYear,
      //   targetMonth: this.targetMonth,
      //   targetValue: this.form.targetValue
      // })
      // if (code === '200' && data) {
      //   this.$emit('confirm')
      // }
      // loading(false)
    },
    async open({ load }) {
      // this.flag = this.$attrs.flag
      // if (this.flag !== 'update') return
      // const { code, data } = await load(() => this.$api.control_target_info({
      //   id: this.selectRow.id
      // }))

      // if (code === '200' && data) {
      //   const { targetYear, targetMonth } = data
      //   this.form = {
      //     ...data,
      //     month: new Date(`${targetYear}-${targetMonth}`)
      //   }
      // }
    },
    closed() {
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
