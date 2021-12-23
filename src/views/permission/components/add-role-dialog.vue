<template>
  <ki-dialog
    :visible="visible"
    title="角色"
    width="26%"
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
        <el-form-item prop="roleName" label="角色名称:">
          <el-input v-model="form.roleName" />
        </el-form-item>
        <el-form-item prop="roleCode" label="角色标识:">
          <el-input v-model="form.roleCode" />
        </el-form-item>
        <el-form-item prop="enable" label="状态">
          <el-radio-group v-model="form.enable">
            <el-radio :label="true">开启</el-radio>
            <el-radio :label="false">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="roleType">
          <el-radio-group v-model="form.roleType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="details" label="描述:">
          <el-input v-model="form.details" :rows="4" type="textarea" />
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
        enable: true,
        roleName: '',
        roleCode: '',
        details: '',
        roleType: 1
      },
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
        roleCode: [{ required: true, message: '请输入角色标识', trigger: 'change' }]
      }
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
      // this.handleClose()
    },
    // getTreeIds() {
    // //   const currentNode = this.selectRow.id
    //   const arr = [this.selectRow.id]
    //   const getName = (key) => {
    //     if (key === '0') return arr.reverse()
    //     const node = this.getNode(key)
    //     arr.push(node.data.groupName)
    //     return getName(node.data.parentId)
    //   }
    //   const path = `/${getName(parentId)}`
    //   return path
    // },
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
