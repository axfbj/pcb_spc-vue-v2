<template>
  <ki-dialog
    :visible="visible"
    title="用户"
    width="28%"
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
        <el-form-item prop="userCode" label="用户账号:">
          <el-input v-model="form.userCode" />
        </el-form-item>
        <el-form-item prop="userName" label="用户名:">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item prop="loginPassword" label="密码:">
          <el-input v-model.trim="form.loginPassword" autocomplete="off" type="password" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱:">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item prop="mobilePhone" label="电话:">
          <el-input v-model="form.mobilePhone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.roleType">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="userStatus">
          <el-radio-group v-model="form.enable">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="roleIds" label="角色:">
          <el-select v-model="form.roleIds" placeholder="请选择角色">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { getRoleInfo, addRole, updateRole } from '@/api/role'
import { dateformat } from '@/utils/date-method'
export default {
  name: 'MenuSettingDialog',
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
    return {
      flag: '',
      pids: ['1', '2'],
      form: {
        'userCode': '',
        'userName': '',
        'loginPassword': '',
        'email': '',
        'mobilePhone': '',
        'userStatus': 0,
        'id': 0,
        'isAdmin': 0,
        'roleIds': '',
        'roleName': '',
        'sex': 0

      },
      rules: {
        userCode: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        loginPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }]

      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
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
          this.add(loading)
        } else {
          this.update(loading)
        }
      })
    },
    async add(loading) {
      const res = await addRole({
        ...this.form,
        createTime: dateformat(new Date())
      })
      if (res.code === '200') {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async update(loading) {
      console.log(this.form)
      const res = await updateRole({
        ...this.form
      })
      if (res.code === '200') {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async open({ loading }) {
      this.flag = this.$attrs.flag
      if (this.flag !== 'add') {
        loading(true)
        const { code, data } = await getRoleInfo({ id: this.sendData.id })
        if (code === '200' && data) {
          this.form = {
            ...data
          }
        }
        loading(false)
      }
    //   this.$refs['ipt'].focus()
    },
    async opened({ loading }) {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
