export default {
  data() {
    return {
      setting_target_dialog: false
    }
  },
  methods: {
    setting_target_dialog_btn(flag) {
      if (flag === 'update') {
        if (!this.$refs.dy_table.one_row_select()) return
      }
      this.flag = flag
      this.setting_target_dialog = true
    },
    setting_target_dialog_close() {
      this.setting_target_dialog = false
    },
    setting_target_dialog_confirm() {
      if (this.flag === 'update') this.$refs.dy_table.refresh({ keep: true })
      else this.$refs.dy_table.refresh()
      this.setting_target_dialog = false
    }
  }
}

