<template>
  <el-tree
    ref="tree"
    :data="data"
    :props="props"
    :node-key="nodeKey"
    :default-expand-all="defaultExpandAll"
    :current-node-key="currentNodeKey"
    :highlight-current="true"
    :expand-on-click-node="false"
    v-bind="$attrs"
    :default-expanded-keys="expandedList"
    @node-click="handleNodeClick"
    @node-expand="nodeExpand"
    @node-collapse="nodeCollapse"
  >
    <slot />
  </el-tree>
</template>

<script>
export default {
  name: 'KiTree',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    /**
     * label     string, function(data, node)  指定节点标签为节点对象的某个属性值
     * children  string                        指定子树为节点对象的某个属性值
     * disabled  boolean, function(data, node) 指定节点选择框是否禁用为节点对象的某个属性值
     * isLeaf    boolean, function(data, node) 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
     */
    props: {
      type: Object,
      default: () => ({})
    },
    nodeKey: {
      type: String,
      default: ''
    },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => ([])
    },
    currentNodeKey: {
      type: [String, Number],
      default: ''
    },
    currentKey: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      expandedList: [],
      path: ''
    }
  },
  watch: {
    defaultExpandedKeys() {
      this.expandedList.push(...this.defaultExpandedKeys)
    },
    currentKey() {
      this.$emit('path-change', this.getTreePath())
    }
  },
  methods: {
    handleNodeClick(...args) {
      // console.log(args)
      this.$emit('node-click', ...args)
    },
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    },
    getCurrentKey() {
      return this.$refs.tree.getCurrentKey()
    },
    getNode(key_or_data) {
      return this.$refs.tree.getNode(key_or_data)
    },
    getCurrentNode() {
      return this.$refs.tree.getCurrentNode()
    },
    nodeExpand(data) {
      this.expandedList.push(data.id) // 在节点展开是添加到默认展开数组
    },
    nodeCollapse(data) {
      this.expandedList.splice(this.expandedList.indexOf(data.id), 1) // 收起时删除数组里对应选项
    },
    getTreePath() {
      const currentNode = this.getCurrentNode()
      const arr = [currentNode.groupName]
      const getName = (key) => {
        if (key === '0') return arr.reverse().join('/')
        const node = this.getNode(key)
        arr.push(node.data.groupName)
        return getName(node.data.parentId)
      }
      const path = `/${getName(currentNode.parentId)}`
      return path
    }

  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #ffe48d;
}

</style>

