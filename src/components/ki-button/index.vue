<template>
  <el-button
    v-bind="$attrs"
    :loading="loadingStatus"
    :type="type"
    :icon="icon"
    :size="size"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script>
export default {
  name: 'KiButton',
  props: {
    type: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  data() {
    return {
      loadingStatus: false
    }
  },
  methods: {
    set_loadingStatus(status) {
      this.loadingStatus = status
    },
    handleClick() {
      if (this.autoLoading) {
        this.loadingStatus = true
      }
      // console.log('this.$listeners', this.$listeners)
      this.$emit('click', this.set_loadingStatus)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

