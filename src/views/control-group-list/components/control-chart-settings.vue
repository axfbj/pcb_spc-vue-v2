<template>
  <ki-dialog
    :visible="visible"
    title="控制图设置"
    @handleClose="handleClose"
    @confirm="confirm"
    @opened="opened"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="auto"
    >
      <el-form-item
        prop="hierarchicalName"
        label="类型名称:"
      >
        <el-input v-model="form.hierarchicalName" />
      </el-form-item>

    </el-form>
  </ki-dialog>
</template>

<script>
export default {
  name: 'ControlChartSettings',
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
      form: {
        hierarchicalName: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    confirm() {
      this.$emit('confirm')
    },
    opened() {
      this.form.hierarchicalName = this.selectRow.hierarchicalName
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
