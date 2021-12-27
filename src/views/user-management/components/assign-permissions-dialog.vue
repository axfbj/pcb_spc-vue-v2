<template>
  <ki-dialog
    :visible="visible"
    title="分配权限"
    width="26%"
    :flag="$attrs.flag"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
    @closed="closed"
  >
    <div style="padding: 10px 20px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="菜单权限" name="menu">
          <el-tree
            ref="chekbox_tree1"
            :data="menu_tree_data"
            show-checkbox
            node-key="id"
            :props="defaultProps1"
            :default-checked-keys="menu_default_checked_keys"
          />
        </el-tab-pane>
        <el-tab-pane v-if="roleType === 2" label="控制组权限" name="controlGroup">
          <el-tree
            ref="chekbox_tree2"
            :data="controlGroup_tree_data"
            show-checkbox
            node-key="id"
            :props="defaultProps2"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </ki-dialog>
</template>

<script>
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
import { saveRolePower, saveRoleControlGroupPower, getRolePower } from '@/api/role'
export default {
  name: 'AssignPermissionsDialog',
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
      activeName: 'menu',
      roleType: '',
      menu_tree_data: [],
      controlGroup_tree_data: [],
      menu_default_checked_keys: [],
      defaultProps1: {
        label: 'title',
        children: 'children'
      },
      defaultProps2: {
        label: 'groupName',
        children: 'children'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    clear() {
      this.roleType = ''
      this.menu_default_checked_keys = []
    },
    save_rolePower() {
      const menu_tree_checked = this.$refs.chekbox_tree1.getCheckedKeys()
      return saveRolePower({
        powerIds: menu_tree_checked.toString(),
        roleId: this.sendData.id
      })
    },
    save_roleControlGroupPower() {
      const controlGroup_tree_checked = this.$refs.chekbox_tree2.getCheckedKeys()
      return saveRoleControlGroupPower({
        groupIds: controlGroup_tree_checked.toString(),
        roleId: this.sendData.id
      })
    },
    async confirm({ loading }) {
      const res = []
      res.push(this.save_rolePower())
      if (this.roleType === 2) {
        res.push(this.save_roleControlGroupPower())
      }
      Promise.all(res).then(res => {
        this.$message.success('权限分配成功')
      })
      // if (this.flag === 'add') {
      //   this.add(loading)
      // } else {
      //   this.update(loading)
      // }
    },
    async add(loading) {

    },
    async update(loading) {

    },
    handleClick() {},
    async set_menu_tree() {
      const { code, data } = await this.$api.menu_tree()
      if (code === '200' && data) {
        this.menu_tree_data = data
      }
    },
    async set_controlGroup_tree() {
      const { code, data } = await this.$api.controlGroup_tree()
      if (code === '200' && data) {
        this.controlGroup_tree_data = data
      }
    },
    async open({ loading }) {
      this.roleType = this.sendData.roleType
      loading(true)
      // await this.set_menu_tree()
      if (this.roleType === 2) {
        await this.set_controlGroup_tree()
      }
      const { code, data } = await getRolePower({ roleId: this.sendData.id })
      if (code === '200' && data) {
        this.menu_tree_data = data
        this.menu_default_checked_keys = data.map(item => item.id)
        // console.log(this.menu_default_checked_keys)
      }
      loading(false)
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
