<template>
  <ki-dialog
    v-bind="$attrs"
    :visible="visible"
    title="定时任务"
    width="34%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
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
          <ki-button type="warning" style="margin-left: 10px;" @click="setting_cron_dialog_btn">设置</ki-button>
        </el-form-item>

        <el-form-item label="状态" prop="taskStatus">
          <el-radio-group v-model="form.taskStatus">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <setting-cron-dialog
      :visible="setting_cron_dialog"
      @handleClose="setting_cron_dialog_close"
      @confirm="setting_cron_dialog_confirm"
    />
  </ki-dialog>
</template>

<script>
import { dateformat } from '@/utils/date-method'
import { mapGetters } from 'vuex'
import settingCronDialog from './components/setting-cron-dialog'
import setting_cron_dialog from './mixins/setting-cron-dialog'
export default {
  name: 'AddTaskDialog',
  components: {
    settingCronDialog
  },
  mixins: [setting_cron_dialog],
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
        'taskCode': [{ required: true, message: '请输入编码', trigger: 'change' }],
        'taskName': [{ required: true, message: '请输入名称', trigger: 'change' }],
        'taskCron': [{ required: true, message: '请输入Cron 表达式', trigger: 'change' }]
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
      const { code, data } = await this.$api.timingTask_save({
        ...this.form,
        'taskUpdateTime': dateformat(new Date())
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      loading(false)
    },
    async update(loading) {
      const { code, data } = await this.$api.control_target_update({
        ...this.form,
        'taskUpdateTime': dateformat(new Date())
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      loading(false)
    },
    async open({ load }) {
      this.flag = this.$attrs.flag
      // alert(this.flag)
      if (this.flag !== 'update') return
      const { code, data } = await load(() => this.$api.timingTask_info({
        id: this.selectRow.id
      }))

      if (code === '200' && data) {
        this.form = {
          ...data
        }
      }
    },
    closed() {
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
