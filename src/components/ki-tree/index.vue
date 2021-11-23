<template>
  <el-tree :data="data" :props="props" :node-key="nodeKey" @node-click="handleNodeClick">
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
    }
  },
  data() {
    return {
      loadingStatus: false
    }
  },
  methods: {
    handleNodeClick(...args) {
      this.$emit('row-click', ...args)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

