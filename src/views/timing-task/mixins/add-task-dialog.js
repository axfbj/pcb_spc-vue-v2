export default {
  data() {
    return {
      setting_target_dialog: true
    }
  },
  methods: {
    setting_target_dialog_btn() {
      this.setting_target_dialog = true
    },
    setting_target_dialog_close() {
      this.setting_target_dialog = false
    },
    setting_target_dialog_confirm() {
      this.setting_target_dialog = false
    }
  }
}

