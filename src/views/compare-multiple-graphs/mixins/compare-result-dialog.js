
export default {
  data() {
    return {
      checkboxValue: [],
      compareResult_dialog: false
    }
  },
  methods: {
    compareResult_dialog_btn() {
      if (this.checkboxValue.length <= 1) {
        this.$message.warning('至少选中两张控制图')
        return
      }
      this.compareResult_dialog = true
    },
    compareResult_dialog_close() {
      this.compareResult_dialog = false
    },
    compareResult_dialog_confirm() {
      this.compareResult_dialog = false
    }
  }
}

