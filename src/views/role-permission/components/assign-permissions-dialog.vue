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
  >
    <div style="padding: 10px 20px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="菜单权限" name="menu">
          <div style="max-height: 50vh;overflow: auto">
            <el-tree
              ref="chekbox_tree1"
              :data="menu_tree_data"
              show-checkbox
              node-key="id"
              :props="defaultProps1"
              check-strictly
              default-expand-all
              :default-checked-keys="menu_default_checked_keys"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="roleType === 2" label="控制组权限" name="controlGroup">
          <el-tree
            ref="chekbox_tree2"
            default-expand-all
            :data="controlGroup_tree_data"
            show-checkbox
            node-key="id"
            :props="defaultProps2"
            check-strictly
            :default-checked-keys="controlGroup_default_checked_keys"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </ki-dialog>
</template>

<script>
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
// import { saveRolePower, saveRoleControlGroupPower } from '@/api/role'
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
      controlGroup_default_checked_keys: [],
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
      this.clear()
      this.$emit('handleClose')
    },
    clear() {
      this.activeName = 'menu'
      this.menu_default_checked_keys = []
      this.controlGroup_default_checked_keys = []
    },
    save_rolePower() {
      const menu_tree_checked = this.$refs.chekbox_tree1.getCheckedKeys()
      return this.$api.saveRolePower({
        powerIds: menu_tree_checked.toString(),
        roleId: this.sendData.id
      })
    },
    save_roleControlGroupPower() {
      const controlGroup_tree_checked = this.$refs.chekbox_tree2.getCheckedKeys()
      return this.$api.saveRoleControlGroupPower({
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
        const b = res.every(item => item.code === '200' && item.data)
        if (b) {
          this.$message.success('操作成功')
          this.$emit('confirm')
        }
      })
    },
    async add(loading) {

    },
    async update(loading) {
      // this.handleClose()
    },
    handleClick() {},
    // async set_menu_tree() {
    //   const { code, data } = await this.$api.menu_tree()
    //   if (code === '200' && data) {
    //     this.menu_tree_data = data
    //   }
    // },
    // async set_controlGroup_tree() {
    //   const { code, data } = await this.$api.controlGroup_tree()
    //   if (code === '200' && data) {
    //     this.controlGroup_tree_data = data
    //   }
    // },
    /**
 *
 * @param {Array} arrs 树形数据
 * @param {string} childs 树形数据子数据的属性名,常用'children'
 * @param {Array} attrArr 需要提取的公共属性数组(默认是除了childs的全部属性)
 * @returns
 */
    extractTree(arrs, childs, attrArr) {
      let attrList = []
      if (!Array.isArray(arrs) && !arrs.length) return []
      if (typeof childs !== 'string') return []
      if (!Array.isArray(attrArr) || Array.isArray(attrArr) && !attrArr.length) {
        attrList = Object.keys(arrs[0])
        attrList.splice(attrList.indexOf(childs), 1)
      } else {
        attrList = attrArr
      }
      const list = []
      const getObj = (arr) => {
        arr.forEach(function(row) {
          const obj = {}
          attrList.forEach(item => {
            obj[item] = row[item]
          })
          list.push(obj)
          if (row[childs]) {
            getObj(row[childs])
          }
        })
        return list
      }
      return getObj(arrs)
    },
    async getRolePower() {
      const { code, data } = await this.$api.getRolePower({ roleId: this.sendData.id })
      if (code === '200' && data) {
        this.menu_tree_data = data
        const result = this.extractTree(data, 'children', ['id', 'isCheck'])
        this.menu_default_checked_keys = result.map(item => {
          if (item.isCheck) return item.id
        })
      }
    },
    async getRoleControlGroupPower() {
      const { code, data } = await this.$api.getRoleControlGroupPower({ roleId: this.sendData.id })
      if (code === '200' && data) {
        this.controlGroup_tree_data = data
        const result = this.extractTree(data, 'children', ['id', 'isCheck'])
        this.controlGroup_default_checked_keys = result.map(item => {
          if (item.isCheck) return item.id
        })
      }
    },
    async open({ loading }) {
      this.roleType = this.sendData.roleType
      loading(true)
      // await this.set_menu_tree()
      await this.getRolePower()
      if (this.roleType === 2) {
        await this.getRoleControlGroupPower()
      }

      loading(false)
    },
    async opened({ loading }) {

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
