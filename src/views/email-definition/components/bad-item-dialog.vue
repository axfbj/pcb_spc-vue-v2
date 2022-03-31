<template>
  <ki-dialog
    :visible="visible"
    title="发件邮箱"
    width="25%"
    :flag="$attrs.flag"
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
        :rules="rules"
        label-width="auto"
      >
        <el-form-item prop="emailSmtp" label="SMTP服务器:">
          <el-input ref="ipt" v-model="form.emailSmtp" />
        </el-form-item>
        <el-form-item prop="emailPort" label="端口:">
          <el-input v-model="form.emailPort" />
        </el-form-item>
        <el-form-item prop="emailAddress" label="邮箱:">
          <el-input v-model="form.emailAddress" />
        </el-form-item>
        <el-form-item prop="emailPwd" label="发件密码:">
          <el-input v-model.trim="form.emailPwd" autocomplete="off" auto-complete="new-password" type="password" />
        </el-form-item>
        <!-- <el-form-item prop="emailUse" label="状态">
          <el-radio-group v-model="form.emailUse">
            <el-radio :label="1">失控审核</el-radio>
            <el-radio :label="0">其他</el-radio>
          </el-radio-group>
        </el-form-item> -->
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
      form: {},
      form_data: {
        emailSmtp: '',
        emailPort: '',
        emailAddress: '',
        emailPwd: '',
        emailUse: 1
      },
      //      { prop: 'emailSmtp', label: 'SMTP服务器', width: '180' },
      // { prop: 'emailPort', label: '端口', width: '180' },
      // { prop: 'emailAddress', label: '邮箱', width: '180' },
      // { prop: 'emailUse', label: 'email用途', width: '140', template: 'emailUse' }
      rules: {
        emailSmtp: [{ required: true, message: 'SMTP服务器不能为空', trigger: 'change' }],
        emailPort: [{ required: true, message: '端口不能为空', trigger: 'change' }],
        emailAddress: [{ required: true, message: '邮箱不能为空', trigger: 'change' }],
        emailPwd: [{ required: true, message: '发件密码不能为空', trigger: 'change' }]
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
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
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
      const res = await this.$api.email_save({
        emailSmtp: this.form.emailSmtp,
        emailPort: this.form.emailPort,
        emailAddress: this.form.emailAddress,
        emailPwd: this.form.emailPwd,
        emailUse: 1
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async update() {
      const res = await this.$api.email_update({
        ...this.form
      })
      if (res.code === '200') {
        this.$emit('confirm')
      }
      this.handleClose()
    },
    async open({ loading }) {
      this.flag = this.$attrs.flag
      if (this.flag !== 'add') {
        // loading(true)
        // const { code, data } = await this.$api.badDefinition_info({ id: this.selectRow.id })
        // if (code === '200' && data) {
        this.form = {
          id: this.selectRow.id,
          emailSmtp: this.selectRow.emailSmtp,
          emailPort: this.selectRow.emailPort,
          emailAddress: this.selectRow.emailAddress,
          emailUse: this.selectRow.emailUse,
          emailPwd: ''
        }
        this.$nextTick(() => {
          this.$refs.form.clearValidate('emailPwd')
        })
        // }
        // loading(false)
      }
      // this.$refs.form
      this.$refs['ipt'].focus()
    },
    async opened({ loading }) {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
