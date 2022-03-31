export default {
  data() {
    return {
      userGroup_select: []
    }
  },
  methods: {
    async set_email_userGroup_tags(formData) {
      if (!formData.warningUserGroupIds) return
      formData.warningUserGroupIds.forEach((groupId, index) => {
        const o = {
          id: groupId || '',
          groupName: formData.warningUserGroupName[index] || ''
        }
        this.userGroup_select.push(o)
      })
      // this.userGroup_select = {
      //   id: formData.warningUserGroupId || '',
      //   groupName: formData.warningUserGroupName || ''
      // }
    },
    async userGroup_change(group_data) {
      // this.form.warningUserGroupId = group_data.id
      this.form.warningUserGroupIds = group_data.map(item => item.id)
      this.form_change('warningUserGroupIds', this.form.warningUserGroupIds)
    },
    userGroup_tag_close(index) {
      // this.userGroup_select = []
      this.userGroup_select.splice(index, 1)
    }
  }
}

