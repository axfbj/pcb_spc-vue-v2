<template>
  <ki-dialog
    :visible="visible"
    title="修改密码"
    width="28%"
    :flag="$attrs.flag"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
    @closed="closed"
  >
    <div style="padding: 10px 20px;">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item prop="oldPassword" label="原密码:">
          <el-input v-model.trim="form.oldPassword" autocomplete="off" auto-complete="new-password" type="password" />
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码:">
          <el-input v-model.trim="form.newPassword" autocomplete="off" auto-complete="new-password" type="password" />
        </el-form-item>
        <el-form-item prop="confirmPassword" label="确认密码:">
          <el-input v-model.trim="form.confirmPassword" autocomplete="off" auto-complete="new-password" type="password" />
        </el-form-item>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'UpdateUserDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    },
    sendData: {
      type: [Object, Array],
      default: () => ({})
    },
    menuTree: {
      type: [Object, Array],
      default: () => ([])
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.confirmPassword !== '') {
          this.$refs.form.validateField('confirmPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      flag: '',
      form: {},
      form_data: {
        'confirmPassword': '',
        'newPassword': '',
        'oldPassword': ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认新密码', trigger: 'change' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        this.update(loading)
      })
    },
    async update(loading) {
      const { code, data } = await this.$api.updatePwd({
        ...this.form
      })
      if (code === '200' && data) {
        this.$message.success('密码修改成功,请重新登录!')
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },

    async open({ loading }) {
      // this.$refs['ipt'].focus()
    },
    async opened({ loading }) {
    },
    closed() {
      this.clear()
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
