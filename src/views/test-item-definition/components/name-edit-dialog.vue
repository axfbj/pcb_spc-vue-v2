<template>
  <ki-dialog
    :visible="visible"
    title="检测项目"
    :flag="$attrs.flag"
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
          prop="inspectionName"
          label="检测项目名称:"
        >
          <el-input
            ref="ipt"
            v-model="form.inspectionName"
          />
        </el-form-item>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'NameEditDialog',
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
        inspectionName: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.flag = ''
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      loading(true)
      if (this.flag === 'add') {
        this.add()
      } else {
        this.update()
      }
    },
    async add() {
      const res = await this.$api.inspectionItems_save({
        inspectionName: this.form.inspectionName
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async update() {
      const res = await this.$api.inspectionItems_update({
        id: this.selectRow.id,
        inspectionName: this.form.inspectionName
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async open({ load }) {
      this.flag = this.$attrs.flag
      if (this.flag !== 'add') {
        const { code, data } = await load(() => this.$api.inspectionItems_info({ id: this.selectRow.id }))
        if (code === '200' && data) {
          this.form.inspectionName = data.inspectionName
        }
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
