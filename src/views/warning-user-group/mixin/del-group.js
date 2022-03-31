export default {
  methods: {
    del_btn(open) {
      if (!this.$refs.dy_table1.one_row_select()) return
      open()
    },
    async del(flag) {
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const ids = Array.isArray(this.select_row1) ? this.select_row1.map(item => item.id) : [this.select_row1.id]
      const { code, data } = await this.$api.warningUsergroup_delete(ids)
      if (code === '200' && data) {
        this.select_row1 = {}
        this.$message.success('删除成功！')
        this.$refs.dy_table1.refresh()
      }
    }
  }
}

