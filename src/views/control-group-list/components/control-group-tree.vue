<template>
  <ki-tree
    ref="tree"
    :data="tree_data"
    :props="defaultProps"
    v-bind="$attrs"
    node-key="id"
    :default-expanded-keys="defaultExpandedKeys"
    @node-click="node_click"
  />
  <!-- :default-expand-all="true" -->
  <!-- :current-node-key="'1460868489119117313'" -->
  <!-- :default-expanded-keys="['1460868489119117313']" -->
</template>

<script>
export default {
  name: 'ControlGroupTree',
  props: {
    currentKey: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      tree_data: [],
      current_tree_node: '',
      defaultExpandedKeys: [],
      defaultProps: {
        label: 'groupName',
        children: 'children'
      }
    }
  },
  async created() {
    this.refresh((data) => {
      if (data && data[0].id) {
        this.defaultExpandedKeys.push(data[0].id)
        this.$refs.tree.setCurrentKey(data[0].id)
        this.$emit('render-after', data[0])
      }
    })
  },
  methods: {
    async refresh(callback) {
      const { code, data } = await this.$api.controlGroup_tree()
      if (code === '200' && data) {
        this.tree_data = data
      }
      this.$nextTick(() => {
        if (callback) {
          callback(data)
        } else {
          this.$refs.tree.setCurrentKey(this.currentKey)
          this.$emit('render-after', this.$refs.tree.getNode(this.currentKey).data)
        }
      })
    },
    node_click(...args) {
      this.$emit('node-click', ...args)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
