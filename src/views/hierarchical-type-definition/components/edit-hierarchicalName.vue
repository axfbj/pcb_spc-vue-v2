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
        :rules="rules"
        @submit.native.prevent
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
      },
      rules: {
        // hierarchicalName: [{ required: true, message: '类型名称不能为空', trigger: 'change' }]
        // badName: [{ required: true, message: '不良名称不能为空', trigger: 'change' }]
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
      const { code, data } = await this.$api.hierarchicalType_update({
        id: this.selectRow.id,
        hierarchicalName: this.form.hierarchicalName
      })
      if (code === '200' && data) {
        this.$store.dispatch('hierarchicalTypesDefinition/changeHtypes')
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
