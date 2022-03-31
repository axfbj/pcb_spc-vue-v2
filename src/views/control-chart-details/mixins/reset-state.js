
export default {
  data() {
    return {
    }
  },
  methods: {
    async states_re(loading) {
      if (!this.form.date) {
        this.$message.warning('需要选择一个时间段！')
      }
      loading(true)
      await this.set_data('sate_reset')
      loading(false)
    }
  }
}
