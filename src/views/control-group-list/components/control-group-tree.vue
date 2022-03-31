<template>
  <ki-tree
    ref="tree"
    :data="tree_data"
    :props="defaultProps"
    v-bind="$attrs"
    node-key="id"
    :default-expanded-keys="defaultExpandedKeys"
    :current-key="currentKey"
    :menu-items="tree_menu_items"
    tree-contextmenu
    @node-click="node_click"
    @path-change="path_change"
    @open-menu="openMenu"
    @menu-click="tree_menu_click"
  />
  <!-- :default-expand-all="true" -->
  <!-- :current-node-key="'1460868489119117313'" -->
  <!-- :default-expanded-keys="['1460868489119117313']" -->
</template>

<script>
export default {
  name: 'ControlGroupTree',
  // props: {
  //   currentKey: {
  //     type: [String, Number],
  //     default: ''
  //   }
  // },
  data() {
    return {
      tree_data: [],
      current_tree_node: {},
      defaultExpandedKeys: [],
      defaultProps: {
        label: 'groupName',
        children: 'children'
      },
      tree_menu_items: [
        {
          key: '1',
          label: '添加',
          permission: ['control.group.save']
        },
        {
          key: '2',
          label: '修改',
          permission: ['control.group.update']

        },
        {
          key: '3',
          label: '删除',
          permission: ['control.group.delete']
        },
        {
          key: '4',
          label: '复制控制组',
          permission: ['control.group.copy.no.chart', 'control.group.copy.chart', 'control.group.copy.chartAndData']
        },
        {
          key: '5',
          label: '粘贴(到子级)',
          permission: ['control.group.copy.no.chart', 'control.group.copy.chart', 'control.group.copy.chartAndData']
        },
        {
          key: '6',
          label: '粘贴(到同级)',
          permission: ['control.group.copy.no.chart', 'control.group.copy.chart', 'control.group.copy.chartAndData']
        }
      ]
    }
  },
  computed: {
    currentKey() {
      return this.current_tree_node.id
    }
  },
  async created() {
    this.refresh(this.setfirstNode)
  },
  methods: {
    openMenu({ data, node }) {
      this.current_tree_node = data
      // this.defaultExpandedKeys.push(data.id)
      // if (!this.defaultExpandedKeys.includes(data.id)) {
      //   this.defaultExpandedKeys.push(data.id)
      // }
      this.$refs.tree.setCurrentKey(data.id)
      this.node_click(data, node)
    },
    tree_menu_click({ node, menuKey }) {
      this.$emit('menu-click', { node, menuKey })
    },
    setfirstNode(data) {
      if (data && data.length > 0) {
        this.defaultExpandedKeys.push(data[0].id)
        this.$refs.tree.setCurrentKey(data[0].id)
        this.current_tree_node = data[0]
        this.$emit('render-after', data[0])
      }
    },
    resetNodeData() {
      this.$refs.tree.setCurrentKey(null)
      this.current_tree_node = {}
      this.$emit('render-after', this.current_tree_node)
    },
    path_change(path) {
      this.$emit('path-change', path)
    },
    async refresh(callback) {
      const { code, data } = await this.$api.controlGroup_tree()
      if (code === '200' && data) {
        this.tree_data = data
      }
      this.$nextTick(() => {
        if (callback) {
          callback(data)
        } else {
          // this.$refs.tree.setCurrentKey(this.currentKey)
          // this.$emit('render-after', this.$refs.tree.getNode(this.currentKey).data)
          this.$refs.tree.setCurrentKey(this.current_tree_node.id)
          this.$emit('render-after', this.current_tree_node)
        }
      })
    },
    node_click(...args) {
      this.current_tree_node = args[0]
      this.$emit('node-click', ...args)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
