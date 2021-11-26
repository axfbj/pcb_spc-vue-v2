<template>
  <ki-dialog
    :visible="visible"
    :title="title"
    width="25%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
    @keypress.native.enter="confirm"
  >
    <div style="padding: 10px 20px;">
      <el-form
        ref="form"
        :model="form"
        label-width="auto"
      >
        <el-form-item
          prop="inspectionName"
          label="备选值名称:"
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
  computed: {
    title() {
      const statesText = {
        'add': '添加',
        'edit': '修改'
      }
      return `${statesText[this.flag] || ''}备选值`
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.flag = ''
      this.$emit('handleClose')
    },
    async confirm() {
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
    async open({ loading }) {
      this.flag = this.$attrs.flag
      if (this.flag !== 'add') {
        loading(true)
        const { code, data } = await this.$api.inspectionItems_info({ id: this.selectRow.id })
        if (code === '200' && data) {
          this.form.inspectionName = data.inspectionName
        }
        loading(false)
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
