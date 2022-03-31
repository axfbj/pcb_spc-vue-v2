<template>
  <ki-dialog
    :visible="visible"
    title="分配权限"
    width="26%"
    :flag="$attrs.flag"
    :permission="['role.update.power','role.update.control.group.power']"
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
              v-if="powerCodes.includes('role.power')"
              ref="checkbox_tree1"
              :data="menu_tree_data"
              show-checkbox
              node-key="id"
              :props="defaultProps1"
              default-expand-all
              check-strictly
            />
            <!-- :default-checked-keys="menu_default_checked_keys" -->
            <!--      check-strictly -->
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="roleType === 2" label="控制组权限" name="controlGroup">
          <div style="max-height: 50vh;overflow: auto">
            <el-tree
              v-if="powerCodes.includes('role.control.group.power')"
              ref="checkbox_tree2"
              v-permission="['role.control.group.power']"
              default-expand-all
              :data="controlGroup_tree_data"
              show-checkbox
              node-key="id"
              :props="defaultProps2"
              check-strictly
              @check="group_check_change"
            />
            <div v-else style="text-align:center;color: #E6A23C;"><span>无查看权限</span></div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </ki-dialog>
</template>

<script>
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'
// import { saveRolePower, saveRoleControlGroupPower } from '@/api/role'
import { mapGetters } from 'vuex'
import _ from 'lodash'
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
  computed: {
    ...mapGetters(['powerCodes'])
  },
  methods: {
    getTreePath(currentNode) {
      const tree = this.$refs.checkbox_tree2
      // const currentNode = this.getCurrentNode()
      const arr = [currentNode.groupName]
      const arr2 = [currentNode.id]
      const getName = (key) => {
        if (key === '0') return arr.reverse().join('/')
        const node = tree.getNode(key)
        arr.push(node.data.groupName)
        return getName(node.data.parentId)
      }
      const getId = (key) => {
        if (key === '0') return arr2.reverse().join('/')
        const node = tree.getNode(key)
        arr2.push(node.data.id)
        return getId(node.data.parentId)
      }
      // console.log('getId', getId(currentNode.parentId))
      const path = `${getId(currentNode.parentId)}`
      const pathStr = `/${getName(currentNode.parentId)}`
      return { pathStr, path }
    },

    group_check_change(data, data2) {
      const clickNodeKey = data.id
      const { checkedKeys } = data2
      const isChecked = checkedKeys.includes(clickNodeKey)
      const tree = this.$refs.checkbox_tree2

      const { path } = this.getTreePath(data)
      const parentIdArr = path.split('/')
      parentIdArr.pop()
      if (isChecked) { // 选中
        const newCheckedKeys = _.uniq([...checkedKeys, ...parentIdArr])
        tree.setCheckedKeys(newCheckedKeys)
      } else { // 没选中
        const result = this.extractTree([data], 'children', ['id']).map(item => item.id)
        const newCheckedKeys = checkedKeys.filter(key => !result.includes(key))
        tree.setCheckedKeys(newCheckedKeys)
      }
    },
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
      const tree1 = this.$refs.checkbox_tree1
      const menu_tree_checked = [...tree1.getCheckedKeys(), ...tree1.getHalfCheckedKeys()]
      return this.$api.saveRolePower({
        powerIds: menu_tree_checked.toString(),
        roleId: this.sendData.id
      })
    },
    save_roleControlGroupPower() {
      const tree2 = this.$refs.checkbox_tree2
      // const controlGroup_tree_checked = this.$refs.checkbox_tree2.getCheckedKeys()
      const controlGroup_tree_checked = [...tree2.getCheckedKeys(), ...tree2.getHalfCheckedKeys()]
      return this.$api.saveRoleControlGroupPower({
        groupIds: controlGroup_tree_checked.toString(),
        roleId: this.sendData.id
      })
    },
    async confirm({ loading }) {
      const res = []
      res.push(this.save_rolePower())
      if (this.roleType === 2 && this.$refs.checkbox_tree2) {
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
        const result = this.extractTree(data, 'children', ['id', 'isChecked'])
        this.menu_default_checked_keys = []
        result.forEach(item => {
          if (item.isChecked) {
            this.menu_default_checked_keys.push(item.id)
          }
        })
        const tree1 = this.$refs.checkbox_tree1
        this.$nextTick(() => {
          this.menu_default_checked_keys.forEach(key => {
            tree1.setChecked(key, true, false)
          })
        })
      }
    },
    async getRoleControlGroupPower() {
      const { code, data } = await this.$api.getRoleControlGroupPower({ roleId: this.sendData.id })
      if (code === '200' && data) {
        this.controlGroup_tree_data = data
        const result = this.extractTree(data, 'children', ['id', 'isChecked'])
        this.controlGroup_default_checked_keys = []
        result.forEach(item => {
          if (item.isChecked) {
            this.controlGroup_default_checked_keys.push(item.id)
          }
        })
        const tree2 = this.$refs.checkbox_tree2
        this.$nextTick(() => {
          this.controlGroup_default_checked_keys.forEach(key => {
            tree2.setChecked(key, true, false)
          })
        })
      }
    },
    async open({ loading }) {
      this.roleType = this.sendData.roleType
      loading(true)
      await this.getRolePower()
      if (this.roleType === 2 && this.$refs.checkbox_tree2) {
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
