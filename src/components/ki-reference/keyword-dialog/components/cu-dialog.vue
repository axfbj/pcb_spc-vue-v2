<template>
  <ki-dialog
    :visible="visible"
    title="备选值"
    width="25%"
    v-bind="$attrs"
    :flag="$attrs.flag"
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
    },
    parentId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      form: {
        keywordName: ''
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
      if (this.flag === 'add') {
        this.add()
      } else {
        this.update()
      }
    },
    async add() {
      const { code, data } = await this.$api.keywordValue_save({
        hierarchicalTypeId: this.parentId,
        keywordName: this.form.keywordName
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async update() {
      const res = await this.$api.keywordValue_update({
        hierarchicalTypeId: this.parentId,
        id: this.selectRow.id,
        keywordName: this.form.keywordName
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async open({ load }) {
      this.flag = this.$attrs.flag
      if (this.flag !== 'add') {
        const { code, data } = await load(() => this.$api.keywordValue_info({ id: this.selectRow.id }))
        if (code === '200' && data) {
          this.form.keywordName = data.keywordName
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
