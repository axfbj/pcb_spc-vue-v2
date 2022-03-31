export default {
  props: {
    display: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Object, Array],
      default: () => {}
    },
    extra: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      select_row: this.multiple ? [] : {},
      current_row: this.multiple ? [] : {},
      show_refresh: false
    }
  },
  computed: {
    multiple() {
      return Array.isArray(this.data)
    }
    // extra1() {
    //   return JSON.stringify(this.extra)// 反序列化 解决watch值新旧值一样的问题
    // },
    // param_factoryno() {
    //   const params = {}
    //   if (this.extra.factoryno) {
    //     params.factoryno = this.extra.factoryno
    //   }
    //   return params
    // }

  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.current_row = val
        this.select_row = val
      }
    }
    // extra1: {
    //   deep: true,
    //   handler(val, oldval) {
    //     if (val === oldval) return
    //     this.show_refresh = true
    //   }
    // }
    // display(show) {
    //   if (this.show_refresh && show) {
    //     this.show_refresh = false
    //     this.change_extra_refresh({ vm: this }) // 防抖，弹框首次打开之前extra值就发生变化，请求两次的问题
    //   }
    // }
  },
  methods: {
    row_dblclick_sure() {
      this.sure && this.sure()
    },
    get_all_select_data(data) {
      this.select_row = JSON.parse(JSON.stringify(data))
    }

  }
}
