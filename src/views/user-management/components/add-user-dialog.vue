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
          <el-input ref="ipt" v-model="form.userCode" />
        </el-form-item>
        <el-form-item prop="userName" label="用户名:">
          <el-input v-model="form.userName" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="flag === 'add'" prop="loginPassword" label="密码:">
          <el-input v-model.trim="form.loginPassword" autocomplete="off" auto-complete="new-password" type="password" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱:">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item prop="mobilePhone" label="电话:">
          <el-input v-model="form.mobilePhone" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="userStatus">
          <el-radio-group v-model="form.userStatus">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="roleIds" label="角色:">
          <el-select v-model="form.roleIds" placeholder="请选择角色" multiple style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
// import { getRoleInfo, addRole, updateRole } from '@/api/role'
// import { dateformat } from '@/utils/date-method'
export default {
  name: 'AddUserDialog',
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
      form: {},
      form_data: {
        'userCode': '',
        'userName': '',
        'loginPassword': '',
        'email': '',
        'mobilePhone': '',
        'userStatus': 1,
        // 'id': 0,
        // 'isAdmin': 0,
        'roleIds': [],
        'roleName': [],
        'sex': 1

      },
      rules: {
        userCode: [{ required: true, message: '请输入用户账号', trigger: 'change' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        loginPassword: [{ required: true, message: '请输入密码', trigger: 'change' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      options: [
        // {
        //   value: '选项1',
        //   label: '黄金糕'
        // }, {
        //   value: '选项2',
        //   label: '双皮奶'
        // }, {
        //   value: '选项3',
        //   label: '蚵仔煎'
        // }, {
        //   value: '选项4',
        //   label: '龙须面'
        // }, {
        //   value: '选项5',
        //   label: '北京烤鸭'
        // }
      ]
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
      this.clear()
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
    get_roleName(roleIds) {
      const roleNames = []
      roleIds.map(id => {
        const f = this.options.find(item => {
          return id === item.id
        })
        if (f) {
          roleNames.push(f.roleName)
        }
      })
      return roleNames.toString()
    },
    async add(loading) {
      if (Object.hasOwnProperty.call(this.form, 'id')) {
        delete this.form.id
      }
      const { code, data } = await this.$api.user_add_or_update({
        ...this.form,
        roleIds: this.form.roleIds.toString(),
        roleName: this.get_roleName(this.form.roleIds)
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async update(loading) {
      if (Object.hasOwnProperty.call(this.form, 'loginPassword')) {
        delete this.form.loginPassword
      }
      const { code, data } = await this.$api.user_add_or_update({
        ...this.form,
        roleIds: this.form.roleIds.toString(),
        roleName: this.get_roleName(this.form.roleIds)
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },

    async set_role_options() {
      const { code, data } = await this.$api.getRoles({ page: '1', limit: '100' })
      if (code === '200' && data) {
        // console.log(11, data)
        this.options = data.list
      }
    },
    async open({ loading }) {
      this.set_role_options()
      this.flag = this.$attrs.flag
      if (this.flag !== 'add') {
        loading(true)
        const { code, data } = await this.$api.userInfo({ id: this.sendData.id })
        if (code === '200' && data) {
          this.form = {
            ...data,
            roleIds: data.roleIds ? data.roleIds.split(',') : '',
            roleName: data.roleName ? data.roleName.split(',') : ''
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
