
export default {
  data() {
    return {
      copyPosition_dialog: false,
      level: '',
      copy_node: {}
    }
  },
  methods: {
    copyPosition_dialog_btn({ level }) {
      this.level = level
      this.copyPosition_dialog = true
    },
    copyPosition_dialog_close() {
      this.copyPosition_dialog = false
    },
    async copyPosition_dialog_confirm() {
      this.copyPosition_dialog = false
      this.$refs.tree.refresh()
    }
  }
}

