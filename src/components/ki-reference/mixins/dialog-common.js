
export default {
  props: {
    flag: {
      type: String,
      default: ''
    }
  },
  computed: {
    s_text() {
      const statesText = {
        'add': '添加',
        'edit': '修改'
      }
      return statesText[this.flag] || ''
    }
  },
  data() {
    return {}
  }
}
