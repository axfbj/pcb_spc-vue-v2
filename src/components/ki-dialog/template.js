
export default {
  data() {
    return {
      multipleEntry_dialog: false
    }
  },
  methods: {
    multipleEntry_dialog_btn() {
      this.multipleEntry_dialog = true
    },
    multipleEntry_dialog_close() {
      this.multipleEntry_dialog = false
    },
    multipleEntry_dialog_confirm(formData) {
      this.multipleEntry_dialog = false
    }
  }
}

