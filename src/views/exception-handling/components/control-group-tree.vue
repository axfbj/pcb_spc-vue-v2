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
  props: {
    controlChartSonId: {
      type: String,
      default: '0'
    }
  },
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
  watch: {
    '$route.params.controlGroupId': {
      immediate: true,
      handler(controlGroupId) {
        this.init()
      }
    }
  },
  async created() {
    // this.init()
  },
  methods: {
    init() {
      this.refresh((data) => {
        // alert(this.$route.params.controlGroupId)
        if (data && data.length > 0) {
          if (this.$route.params.controlGroupId) {
            const controlGroupId = this.$route.params.controlGroupId
            if (!this.$refs.tree.getNode(controlGroupId)) {
              this.defaultExpandedKeys.push(data[0].id)
              this.$refs.tree.setCurrentKey(data[0].id)
              this.current_tree_node = data[0]
            } else {
              this.defaultExpandedKeys.push(controlGroupId)
              this.$refs.tree.setCurrentKey(controlGroupId)
              this.current_tree_node = this.$refs.tree.getCurrentNode()
            }
          } else {
            this.defaultExpandedKeys.push(data[0].id)
            this.$refs.tree.setCurrentKey(data[0].id)
            this.current_tree_node = data[0]
          }
          this.$emit('render-after', this.current_tree_node)
        }
      })
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
