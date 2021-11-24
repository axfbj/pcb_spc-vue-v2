<template>
  <div
    style="display: inline-block;"
    @click="open_click"
  >
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: Object,
      default: () => ({
        content: '此操作将永久删除该数据, 是否继续?',
        title: `提示`
      })
    }
  },
  methods: {
    open_click() {
      this.$emit('click', this.open)
    },
    open() {
      let flag = ''
      const { content, title } = this.text
      this.$confirm(`${content}`, `${title}`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        flag = 'Y'
        this.$emit('next', flag)
      }).catch(() => {
        flag = 'N'
        this.$emit('next', flag)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
