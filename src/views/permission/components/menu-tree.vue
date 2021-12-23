<template>
  <ki-tree
    ref="tree"
    :data="tree_data"
    :props="defaultProps"
    v-bind="$attrs"
    node-key="id"
    :default-expanded-keys="defaultExpandedKeys"
    :current-key="currentKey"
    @node-click="node_click"
    @path-change="path_change"
  />
</template>

<script>
export default {
  name: 'MenuTree',
  data() {
    return {
      tree_data: [],
      current_tree_node: {},
      defaultExpandedKeys: [],
      defaultProps: {
        label: 'groupName',
        children: 'children'
      }
    }
  },
  computed: {
    currentKey() {
      return this.current_tree_node.id
    }
  },
  async created() {
    this.refresh((data) => {
      if (data && data[0].id) {
        this.defaultExpandedKeys.push(data[0].id)
        this.$refs.tree.setCurrentKey(data[0].id)
        this.current_tree_node = data[0]
        this.$emit('render-after', data[0])
      }
    })
  },
  methods: {
    path_change(path) {
      this.$emit('path-change', path)
    },
    async refresh(callback) {
      const { code, data } = await this.$api.menu_tree()
      if (code === '200' && data) {
        this.tree_data = data
      }
      this.$nextTick(() => {
        if (callback) {
          callback(data)
        } else {
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
