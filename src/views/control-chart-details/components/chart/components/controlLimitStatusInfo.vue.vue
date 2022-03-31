<template>
  <span style="margin-left: 10px;">
    <el-tag v-if="controlLimitStatus === '0'" type="info">解析</el-tag>
    <el-tag v-if="controlLimitStatus === '1'" type="primary">管制</el-tag>
  </span>
</template>

<script>
export default {
  name: 'Rectangle',
  props: {
    controlLimitStatus: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
