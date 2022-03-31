
export default {
  data() {
    return {
      setting_cron_dialog: false
    }
  },
  methods: {
    setting_cron_dialog_btn() {
      this.setting_cron_dialog = true
    },
    setting_cron_dialog_close() {
      this.setting_cron_dialog = false
    },
    setting_cron_dialog_confirm(taskCron) {
      this.setting_cron_dialog = false
      this.form.taskCron = taskCron
    }
  }
}

