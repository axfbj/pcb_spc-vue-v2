export default {
  data() {
    return {
      sameResultKeys: []
    }
  },
  methods: {
    point_filter(item, key1, key2) { // key2 是修改过的key
      const arr1 = this.formart_point_data(item[key1])
      const arr2 = this.formart_point_data(this.form[key2])
      const del_ids = arr1.map(item => {
        if (arr2.some(i => i.id === item.id)) {
          return item.id
        }
      })
      const r = arr1.filter(item => !del_ids.includes(item.id))
      let str = ''
      r.forEach((o, index) => {
        if (index > 0) {
          str += ','
        }
        str += `${o.serialNumber}=${o.id}=${o.text}`
      })
      return str
    },
    formart_point_data(str) {
      if (!str) return []
      const tempArr = str.split(',')
      const result = []
      tempArr.forEach(item => {
        const r = item.split('=')
        const a = {
          serialNumber: r[0],
          id: r[1],
          text: r[2] || ''
        }
        result.push(a)
      })
      return result
    },
    change_borderColor(key) {
      return !this.sameResultKeys.includes(key)
    },
    form_change(key, val) {
      this.t_data.forEach(item => {
        this.$set(item, key, val)
      })
      this.$refs.dy_table.refresh()
      const add_index = this.sameResultKeys.indexOf(key)
      if (add_index === -1) {
        this.sameResultKeys.push(key)
      }
      // this.isSameResult.splice(del_index, 1)
    }
  }
}
