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
    @closed="closed"
  >
    <div style="padding: 10px 20px;">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="auto"
        @submit.native.prevent
      >
        <el-form-item prop="groupCode" label="预警组编号:">
          <el-input ref="ipt" v-model="form.groupCode" />
        </el-form-item>
        <el-form-item prop="groupName" label="预警组名称:">
          <el-input v-model="form.groupName" />
        </el-form-item>
        <!-- <el-form-item label="检测项目:">
          <el-reference v-model="inspectionItem_select" type="inspection-items" style="width: 100%;" />
        </el-form-item> -->
        <el-form-item label="用户组:">
          <el-reference v-model="user_select" type="select-dialog-user" style="width: 100%;" />
        </el-form-item>
        <!-- <el-form-item prop="userCode" label="备注:">
          <el-input ref="ipt" v-model="form.remark" />
        </el-form-item> -->
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
    userTableData: {
      type: Array,
      default: () => ([])
    },
    menuTree: {
      type: [Object, Array],
      default: () => ([])
    }
  },
  data() {
    return {
      flag: '',
      user_select: [],
      inspectionItem_select: {},
      form: {},
      form_data: {
        groupCode: '',
        groupName: '',
        inspectionItemsId: '',
        userIds: []
      },
      rules: {
        groupCode: [{ required: true, message: '预警组编号', trigger: 'change' }],
        groupName: [{ required: true, message: '预警组名称', trigger: 'change' }]
      },
      options: [
      ]
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.user_select = []
      this.inspectionItem_select = {}
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.form.userIds = this.user_select.map(user => {
        return user.id || ''
      })
      this.form.inspectionItemsId = this.inspectionItem_select.id || ''
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
      if (Object.hasOwnProperty.call(this.form, 'id')) {
        delete this.form.id
      }
      const { code, data } = await this.$api.warningUsergroup_save({
        ...this.form
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async update(loading) {
      const { code, data } = await this.$api.warningUsergroup_update({
        ...this.form
      })
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },

    async open({ load }) {
      this.flag = this.$attrs.flag

      if (this.flag !== 'add') {
        const { id, groupCode, groupName, inspectionItemsId, inspectionName } = this.selectRow
        this.form = {
          id,
          groupCode,
          groupName,
          inspectionItemsId
        }
        this.inspectionItem_select = {
          id: this.form['inspectionItemsId'],
          inspectionName
        }

        this.userTableData.forEach(item => {
          const user = {
            id: item.userId,
            userName: item.userName
          }
          this.user_select.push(user)
          this.form.userIds = item.userId
        })
      }
      this.$refs['ipt'].focus()
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
