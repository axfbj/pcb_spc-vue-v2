<template>
  <ki-dialog
    :visible="visible"
    title="修改层次类型名称"
    width="25%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
  >
    <div style="padding: 10px 20px;">
      <el-form
        ref="form"
        :model="form"
        label-width="auto"
      >
        <el-form-item
          prop="hierarchicalName"
          label="类型名称:"
        >
          <el-input
            ref="ipt"
            v-model="form.hierarchicalName"
          />
        </el-form-item>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'EditHierarchicalName',
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
    async confirm({ loading }) {
      loading(true)
      const res = await this.$api.hierarchicalType_update({
        id: this.selectRow.id,
        hierarchicalName: this.form.hierarchicalName
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async open({ load }) {
      const { code, data } = await load(() => this.$api.hierarchicalType_info({ id: this.selectRow.id }))
      if (code === '200' && data) {
        this.form.hierarchicalName = data.hierarchicalName
      }
      this.$refs['ipt'].focus()
    },
    async opened({ loading }) {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
