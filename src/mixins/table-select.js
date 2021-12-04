export default {
  model: {
    prop: 'value',
    event: 'select'
  },
  props: {
    request: {
      type: Function,
      default: () => {}
    },
    value: {
      type: [Array, Object],
      default: () => null
    },
    unique: {
      type: String,
      default: 'id'
    },
    onePageShowPagination: {
      type: Boolean,
      default: true
    },
    pageSizes: {
      type: Array,
      default: () => ([20, 60, 100])
    },
    summaryMethod: {
      type: Function,
      default: () => {}
    },
    showSummary: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      refresh_flag: false,
      data: [],
      currentRow: null,
      page_no: 1,
      page_size: this.pageSizes[0],
      page_total: 0,
      loading: false,
      highlight_current_row: !this.multiple,
      field: '',
      sort: ''
    }
  },
  computed: {
    show() {
      return this.onePageShowPagination || (!!this.page_total && this.page_total > this.pageSizes[0])
    },
    multiple() {
      return Array.isArray(this.value)
    },
    isSelect() {
      if (this.multiple) return this.value.length !== 0
      else return Object.prototype.hasOwnProperty.call(this.value, this.unique)
    }
  },
  mounted() {
    this.bind_resize()
  },
  activated() {
    this.bind_resize()
  },
  deactivated() {
    this.remove_resize()
  },
  beforeDestroy() {
    this.remove_resize()
  },
  methods: {
    bind_resize() {
      this.calc_height()
      this.remove_resize()
      window.addEventListener('resize', this.calc_height, false)
    },
    remove_resize() {
      window.removeEventListener('resize', this.calc_height, false)
    },
    calc_height() {
      this.calc()
      setTimeout(() => {
        this.calc()
      }, 10)
    },
    // 每页显示条数改变
    size_change(page_size) {
      this.page_no = 1
      this.page_size = page_size
      this.request_data()
    },
    // 点击分页
    pagination_current_change(page_no) {
      this.page_no = page_no
      this.request_data()
    },
    // 点击行
    row_click(...args) {
      const [row, column] = args
      if (this.multiple) {
        if (column && column.type === 'selection') {
          this.highlight_current_row = false
          this.$refs.table.toggleRowSelection(row)
        } else {
          if (this.save_data) {
            this.save_data = []
            const not_selected = this.data.filter(item => item[this.unique] !== row[this.unique])
            not_selected.forEach(s => this.$refs.table.toggleRowSelection(s, false))
            this.save_data.push(row)
          } else {
            this.$refs.table.clearSelection()
          }
          this.highlight_current_row = true
          this.$refs.table.toggleRowSelection(row, true)
        }
      } else {
        this.highlight_current_row = true
        this.$refs.table.setCurrentRow(row)
        this.$emit('select', row)
      }
      this.$emit('row-click', ...args)
    },
    one_row_select() {
      if (!this.isSelect) {
        this.$message.warning('请选择一条数据')
        return false
      }
      return true
    },
    set_currentRow(row) {
      if (!row || row === -1) {
        this.$refs.table.setCurrentRow(row)
        return
      }
      this.$refs.table.setCurrentRow(row)
      const i = this.data.findIndex(item => item[this.unique] === row[this.unique])
      if (i === -1) return

      setTimeout(() => {
        const targetTop = this.$refs.table.$el.querySelectorAll('.el-table__body tr')[i].getBoundingClientRect().top
        const containerTop = this.$refs.table.$el.querySelector('.el-table__body').getBoundingClientRect().top
        const scrollParent = this.$refs.table.$el.querySelector('.el-table__body-wrapper')
        scrollParent.scrollTop = targetTop - containerTop
      }, 0)
    },
    sort_change({ column, prop, order }) {
      if (order === null) {
        this.field = ''
        this.sort = ''
      } else {
        this.field = prop
        this.sort = order === 'ascending' ? 'asc' : 'desc'
      }
      this.request_data()
    },
    // 请求表格数据
    async request_data() {
      this.loading = true
      let res = await this.request({
        page_no: String(this.page_no),
        page_size: String(this.page_size),
        table_data: this.data,
        field: this.field,
        sort: this.sort,
        total: this.page_total
      })
      this.loading = false
      if (!res || !res.data) {
        res = {
          data: [],
          total: 0
        }
      }
      // if (res && res.data) {
      this.data = res.data
      this.page_total = Number(res.total)

      this.$nextTick(() => {
        this.fill_data(this.value, true)
        if (this.$refs.table) {
          if (this.multiple || !this.value || ['{}', '[]'].includes(this.value)) {
            this.$refs.table.bodyWrapper.scrollTop = 0
          }
          this.$refs['table'] && this.$refs['table'].doLayout() // 能重置表格的布局 必要
          this.calc()
        }
      })
      // }
    },
    /** 刷新表格数据（对外）
     * params.keep 是否停留在分页状态
     */
    refresh(params) {
      if (params && params.keep) {
        this.request_data()
      } else {
        this.page_no = 1
        this.request_data()
      }
    },
    // 复选框选中变化
    selection_change(selection) {
      // 为了等待select走完之后，再执行一下逻辑
      setTimeout(() => {
        if (this.multiple) {
          // 有无高亮且多选
          this.$emit('select', selection)
        } else if (!this.multiple) {
          // 单选
          this.$emit('select', selection[0])
        }
      }, 0)
    },
    // 点击复选框事件
    select() {
      this.highlight_current_row = false
    },
    // 全选事件
    select_all() {
      this.highlight_current_row = false
    },
    // 设置选中项
    fill_data(value, request) {
      if (this.data.length === 0) return
      if (!value && !this.save_data) {
        return
      }
      let data = value

      if (this.save_data) {
        data = this.save_data
      }
      if (!this.multiple) {
        data = [value]
        if (this.save_data) {
          data = [this.save_data]
        }
      }

      const select = this.data.filter((i) => {
        return data.some((j) => {
          return i[this.unique] === j[this.unique]
        })
      })
      // console.log('select', select)
      const not_selected = this.data.filter((i) => {
        return select.every((j) => {
          return i[this.unique] !== j[this.unique]
        })
      })
      // console.log('select2', not_selected)
      this.$nextTick(() => {
        if (this.multiple) {
          if (select.length !== 0) {
            if (!request) this.$refs.table && this.$refs.table.clearSelection() // 这页有被选择的项才调用清理
            select.forEach(s => this.$refs.table.toggleRowSelection(s, true))
          } else {
            // TODO：临时解决方法 触发一下watch
            // 当页一个数据也没有选择,单选会取消之前的数据
            this.$refs.table.toggleRowSelection(this.data[0], true)
          }

          if (not_selected.length !== 0) {
            not_selected.forEach(s => this.$refs.table.toggleRowSelection(s, false))
          }
          if (this.save_data) {
            if (this.highlight_current_row) { // 在多选中点击行 但是没有点击确定
              this.set_currentRow(-1)
            }
            // this.$emit('select', this.save_data) // 全手动
          } else {
            this.$emit('select', select)
          }
        } else {
          if (select.length !== 0) {
            this.set_currentRow(select[0])
            this.$emit('select', select[0])
          } else {
            this.$refs.table && this.set_currentRow(-1)
            this.$emit('select', {})
          }
        }
      })
    }
  }
}
