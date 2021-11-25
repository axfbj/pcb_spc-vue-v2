<template>
  <ki-dialog
    :visible="visible"
    title="修改备选值"
    width="25%"
    @handleClose="handleClose"
    @confirm="confirm"
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
          prop="keywordName"
          label="备选值名称:"
        >
          <el-input
            ref="ipt"
            v-model="form.keywordName"
          />
        </el-form-item>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'EditKeywordName',
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
        keywordName: ''
      }
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
      const res = await this.$api.keywordValue_save({
        hierarchicalTypeId: this.$attrs.parentId,
        keywordName: this.form.keywordName,
        id: 0
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.$emit('handleClose')
    },
    async update() {
      const res = await this.$api.keywordValue_update({
        hierarchicalTypeId: this.$attrs.parentId,
        id: this.selectRow.id,
        keywordName: this.form.keywordName
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.$emit('handleClose')
    },
    async opened({ loading }) {
      this.flag = this.$attrs.flag
      if (this.flag === 'add') return
      loading(true)
      const res = await this.$api.keywordValue_info({ id: this.selectRow.id })
      if (res.code === '200') {
        this.form.keywordName = res.data.keywordName
      }
      this.$refs['ipt'].focus()
      loading(false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
