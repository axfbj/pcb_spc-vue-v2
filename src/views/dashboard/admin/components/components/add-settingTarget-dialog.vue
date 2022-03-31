<template>
  <ki-dialog
    v-bind="$attrs"
    :visible="visible"
    title="目标值"
    width="24%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="月份:" label-width="100px" prop="month">
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
        </el-form-item>
      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
import { dateformat } from '@/utils/date-method'
import { mapGetters } from 'vuex'
export default {
  name: 'AddSettingTargetDialog',

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
      form: {
        month: new Date(),
        targetValue: 0
      },
      rules: {
        'month': [{ required: true, message: '请选择月份', trigger: 'change' }],
        'targetValue': [{ required: true, message: '请输入目标值', trigger: 'change' }]
      }
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
      return typeof year === 'string' ? parseInt(year) : false
    },
    targetMonth() {
      const month = dateformat(this.form.month, 'MM')
      return typeof month === 'string' ? parseInt(month) : false
    }
  },
  created() {

  },
  methods: {
    clean() {
      this.flag = ''
      this.form = {
        month: new Date(),
        targetValue: 0
      }
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
      const { code, data } = await this.$api.control_target_save({
        targetYear: this.targetYear,
        targetMonth: this.targetMonth,
        targetValue: this.form.targetValue
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      loading(false)
    },
    async update(loading) {
      const { code, data } = await this.$api.control_target_update({
        ...this.form,
        targetYear: this.targetYear,
        targetMonth: this.targetMonth,
        targetValue: this.form.targetValue
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      loading(false)
    },
    async open({ load }) {
      this.flag = this.$attrs.flag
      if (this.flag !== 'update') return
      const { code, data } = await load(() => this.$api.control_target_info({
        id: this.selectRow.id
      }))

      if (code === '200' && data) {
        const { targetYear, targetMonth } = data
        this.form = {
          ...data,
          month: new Date(`${targetYear}-${targetMonth}`)
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
