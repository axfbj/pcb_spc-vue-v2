export default {
  data() {
    return {
      userGroup_select: {}
    }
  },
  methods: {
    async set_email_userGroup_tags(formData) {
      if (!formData.warningUserGroupId) return
      this.userGroup_select = {
        id: formData.warningUserGroupId || '',
        groupName: formData.warningUserGroupName || ''
      }
    },
    async userGroup_change(group_data) {
      this.form.warningUserGroupId = group_data.id
      this.form_change('warningUserGroupId', this.form.warningUserGroupId)
    },
    userGroup_tag_close() {
      this.userGroup_select = {}
    }
  }
}

