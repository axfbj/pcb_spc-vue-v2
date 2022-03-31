<template>
  <el-dialog
    :visible.sync="visible"
    :title="f_title"
    :width="width"
    :top="top"
    append-to-body
    :before-close="handleClose"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
    @keypress.native.enter="enter_confirm($event)"
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
      v-if="defaultFooter"
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">{{ buttonText[1] }}</el-button>
      <el-button
        v-permission="permission"
        :disabled="loading"
        type="primary"
        @click="confirm"
      >{{ buttonText[0] }}</el-button>
    </span>
    <template v-if="!defaultFooter" slot="footer">
      <slot name="footer_custum" :setLoadingState="setLoadingState" :load="load" :loading="loading" />
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    defaultFooter: {
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
    },
    top: {
      type: String,
      default: '15vh'
    },
    permission: {
      type: Array,
      default: () => ([])
    },
    buttonText: {
      type: Array,
      default: () => (['确 定', '取 消'])
    }
  },
  data() {
    return {
      flag: '',
      loading: false
    }
  },
  computed: {
    f_title() {
      const statesText = {
        'add': '添加',
        'edit': '修改',
        'update': '修改'
      }
      return `${statesText[this.flag] || ''}${this.title}`
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    confirm() {
      if (this.loading || !this.defaultFooter) return
      this.$emit('confirm', { loading: this.setLoadingState, load: this.load })
    },
    enter_confirm(e) {
      if (this.loading || !this.defaultFooter) return
      e.target.blur()
      this.$emit('confirm', { loading: this.setLoadingState, load: this.load })
    },
    setLoadingState(state) {
      this.loading = state
      return this.loading
    },
    async load(func) {
      this.loading = true
      const res = await func()
      this.loading = false
      return res
    },
    open() {
      this.flag = this.$attrs.flag
      this.$nextTick(() => {
        this.$emit('open', { loading: this.setLoadingState, load: this.load })
      })
    },
    opened() {
      this.$emit('opened', { loading: this.setLoadingState, load: this.load })
    },
    close() {
      this.$emit('close')
    },
    closed() {
      this.flag = ''
      this.loading = false
      this.$emit('closed')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
</style>
