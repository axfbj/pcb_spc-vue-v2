<template>
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :before-close="handleClose"
    append-to-body
    @open="open"
    @opened="opened"
  >
    <div v-loading="loading">
      <container-title
        v-if="$slots.btns"
        style="padding: 0 20px;"
      >
        <slot name="btns" />
      </container-title>
      <div>
        <slot />
      </div>
    </div>
    <span
      v-if="footer"
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        :disabled="loading"
        type="primary"
        @click="confirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    footer: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '提示'
    },
    width: {
      type: String,
      default: '30%'
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    confirm() {
      this.$emit('confirm')
    },
    setLoadingState(state) {
      this.loading = state
    },
    open() {
      this.$nextTick(() => {
        this.$emit('open', { loading: this.setLoadingState })
      })
    },
    opened() {
      this.$emit('opened', { loading: this.setLoadingState })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
</style>
