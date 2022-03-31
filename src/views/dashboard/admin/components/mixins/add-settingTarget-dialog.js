
export default {
  data() {
    return {
      add_settingTarget_dialog: false
    }
  },
  methods: {
    add_settingTarget_dialog_btn() {
      this.add_settingTarget_dialog = true
    },
    add_settingTarget_dialog_close() {
      this.add_settingTarget_dialog = false
    },
    add_settingTarget_dialog_confirm() {
      this.$refs.dy_table.refresh({ keep: true })
      this.add_settingTarget_dialog = false
    }
  }
}

