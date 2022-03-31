import { geMothStart } from '@/utils/date-method'

export default {
  data() {
    return {
      setting_target_dialog: false
    }
  },
  methods: {
    setting_target_dialog_btn() {
      this.setting_target_dialog = true
    },
    setting_target_dialog_close() {
      this.setting_target_dialog = false
      const d = geMothStart(this.month)
      this.month_change(d)
    },
    setting_target_dialog_confirm() {
      this.setting_target_dialog = false
    }
  }
}

