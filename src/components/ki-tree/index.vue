<template>

  <div class="mytree">
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
      :indent="0"
      @node-click="handleNodeClick"
      @node-expand="nodeExpand"
      @node-collapse="nodeCollapse"
      @node-contextmenu="openMenu"
    >
      <slot />
    </el-tree>
    <ul v-if="treeContextmenu" v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-for="item in filterMenuItems" :key="item.key" @click="menuClick({node:menu_node,menuKey: item.key})">{{ item.label }}</li>
    </ul>
  </div>
</template>

<script>
import row_contextmenu from './mixins/tree-contextmenu'
export default {
  name: 'KiTree',
  mixins: [row_contextmenu],
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
    currentKey(val) {
      if (val) {
        this.$emit('path-change', this.getTreePath())
      } else {
        this.$emit('path-change', { path: '', pathStr: '' })
      }
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
      const arr2 = [currentNode.id]
      const getName = (key) => {
        if (key === '0') return arr.reverse().join('/')
        const node = this.getNode(key)
        arr.push(node.data.groupName)
        return getName(node.data.parentId)
      }
      const getId = (key) => {
        if (key === '0') return arr2.reverse().join('/')
        const node = this.getNode(key)
        arr2.push(node.data.id)
        return getId(node.data.parentId)
      }
      // console.log('getId', getId(currentNode.parentId))
      const path = `${getId(currentNode.parentId)}`
      const pathStr = `/${getName(currentNode.parentId)}`
      return { pathStr, path }
    }

  }
}
</script>

<style lang="scss" scoped>
// 为树状图添加虚线
::v-deep.mytree {
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node {
    position: relative;
    padding-left: 16px;
  }
  //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉
  // .el-tree-node__expand-icon.is-leaf{
  //   display: none;
  // }
  .el-tree-node__children {
    padding-left: 16px;
  }

  .el-tree-node :last-child:before {
    height: 38px;
  }

  .el-tree > .el-tree-node:before {
    border-left: none;
  }

  .el-tree > .el-tree-node:after {
    border-top: none;
  }

  .el-tree-node:before {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }

  .el-tree-node:before {
    // border-left: 1px dashed #4386c6;
    border-left: 1px dashed 	#A9A9A9;
    bottom: 0px;
    height: 100%;
    top: -26px;
    width: 1px;
  }

  .el-tree-node:after {
    // border-top: 1px dashed #4386c6;
    border-top: 1px dashed 	#A9A9A9;
    height: 20px;
    top: 12px;
    width: 24px;
  }
}

::v-deep.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #ffe48d;
}

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }

</style>
