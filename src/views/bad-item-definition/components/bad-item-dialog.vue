<template>
  <ki-dialog
    :visible="visible"
    title="不良定义"
    width="25%"
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
        :rules="rules"
        label-width="auto"
      >
        <el-form-item prop="badCode" label="不良代码:">
          <el-input ref="ipt" v-model="form.badCode" />
        </el-form-item>
        <el-form-item prop="badName" label="不良名称:">
          <el-input v-model="form.badName" />
        </el-form-item>
        <el-form-item prop="badDescription" label="描述:">
          <el-input v-model="form.badDescription" />
        </el-form-item>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'BadItemDialog',
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
        badCode: '',
        badName: '',
        badDescription: ''
      },
      rules: {
        badCode: [{ required: true, message: '不良代码不能为空', trigger: 'change' }],
        badName: [{ required: true, message: '不良名称不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      const statesText = {
        'add': '添加',
        'edit': '修改'
      }
      return `${statesText[this.flag] || ''}不良项目定义`
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
      this.$refs.form.resetFields()
    },
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        if (this.flag === 'add') {
          this.add()
        } else {
          this.update()
        }
      })
    },
    async add() {
      const res = await this.$api.badDefinition_save({
        badCode: this.form.badCode,
        badName: this.form.badName,
        badDescription: this.form.badDescription
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async update() {
      const res = await this.$api.badDefinition_update({
        id: this.selectRow.id,
        badCode: this.form.badCode,
        badName: this.form.badName,
        badDescription: this.form.badDescription
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
        const { code, data } = await this.$api.badDefinition_info({ id: this.selectRow.id })
        if (code === '200' && data) {
          this.form = {
            badCode: data.badCode,
            badName: data.badName,
            badDescription: data.badDescription
          }
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
