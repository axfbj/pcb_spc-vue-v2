export default {
  data() {
    return {
      import_user_dialog: false
    }
  },
  methods: {
    import_user_btn(loading) {
      this.import_user_dialog = true
    },
    import_user_dialog_close() {
      this.import_user_dialog = false
    },
    import_user_dialog_confirm() {
      this.import_user_dialog = false
      this.$refs.dy_table.refresh()
    }
  }
}
