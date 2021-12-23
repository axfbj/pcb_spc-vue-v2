<template>
  <!-- :data="tree_data" -->
  <ki-tree
    ref="tree"
    :props="defaultProps"
    v-bind="$attrs"
    node-key="id"
    :current-key="currentKey"
    lazy
    :load="loadNode"
    @node-click="node_click"
    @path-change="path_change"
  />
  <!-- :default-expanded-keys="defaultExpandedKeys" -->
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
      }
    }
  },
  computed: {
    currentKey() {
      return this.current_tree_node.id
    }
  },
  async created() {
    // this.refresh((data) => {
    //   if (data && data[0].id) {
    //     this.defaultExpandedKeys.push(data[0].id)
    //     this.$refs.tree.setCurrentKey(data[0].id)
    //     this.current_tree_node = data[0]
    //     this.$emit('render-after', data[0])
    //   }
    // })
  },
  methods: {
    async loadNode(node, resolve) {
      const p = {}
      if (node.level === 0) {
        p.id = 0
      } else {
        p.id = node.data.id
      }

      console.log('node', node)
      console.log('p', p)
      const { code, data } = await this.$api.controlGroup_tree(p)
      if (code === '200' && data) {
        // this.tree_data = data
        resolve(data)
      } else {
        resolve([])
      }

      // setTimeout(() => {
      // const data = [{
      //   groupName: 'leaf',
      //   leaf: true
      // }, {
      //   groupName: 'zone'
      // }]

      // resolve(data)
      // }, 500)
      // const p = {}
      // if (node.level === 0) {
      //   p.id = 0
      //   // return resolve([{ name: 'region' }])
      // } else {
      //   p.id = node.data.id
      // }
      // console.log('node', node)
      // console.log('p', p)
      // const { code, data } = this.$api.controlGroup_tree(p)
      // if (code === '200' && data) {
      //   // this.tree_data = data
      //   resolve(data)
      // }
      // this.$nextTick(() => {
      //   if (callback) {
      //     callback(data)
      //   } else {
      //     // this.$refs.tree.setCurrentKey(this.currentKey)
      //     // this.$emit('render-after', this.$refs.tree.getNode(this.currentKey).data)
      //     this.$refs.tree.setCurrentKey(this.current_tree_node.id)
      //     this.$emit('render-after', this.current_tree_node)
      //   }
      // })
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
