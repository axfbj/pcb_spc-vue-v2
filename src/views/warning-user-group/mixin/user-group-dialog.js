export default {
  data() {
    return {
      user_table_data: [], // 用户数据发送给弹框
      userGroupDialog_visible: false,
      userGroupDialog_flag: ''
    }
  },
  methods: {
    userGroupDialog_btn(flag) {
      this.userGroupDialog_flag = flag
      this.userGroupDialog_visible = true
    },
    userGroupDialog_close() {
      this.userGroupDialog_visible = false
    },
    userGroupDialog_confirm() {
      this.userGroupDialog_visible = false
      if (this.userGroupDialog_flag === 'update') {
        this.$refs.dy_table1.refresh({ keep: true })
        return
      }
      this.$refs.dy_table1.refresh()
    }
  }
}
