<template>
  <el-button
    v-bind="$attrs"
    :loading="loadingStatus"
    :type="type"
    :icon="icon"
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
    autoLoading: {
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
    handleClick() {
      if (this.autoLoading) {
        this.loadingStatus = true
      }
      console.log('this.$listeners', this.$listeners)
      this.$emit('click', () => {
        this.loadingStatus = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

