<template>
  <div class="layout-table" :style="{height: !!fixedHeight ? (typeof fixedHeight ==='string' ? fixedHeight : 'auto') : (typeof content_height === 'string' ? content_height : content_height + 'px') }">
    <!-- :height="!!fixedHeight ? (typeof fixedHeight === 'string' ? table_height : '') : table_height" -->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :max-height="!!fixedHeight && typeof(fixedHeight) === 'number' ? fixedHeight : 'none'"
      :height="!!fixedHeight ? (typeof fixedHeight === 'string' ? table_height : undefined) : table_height"
      size="mini"
      border
      stripe
      fit
      :highlight-current-row="highlight_current_row"
      :current-row-key="unique"
      :row-key="unique"
      :summary-method="summary_func"
      :show-summary="showSummary"
      :cell-class-name="cell_class_name"
      @row-click="click"
      @select="select"
      @select-all="select_all"
      @selection-change="selection_change"
      @sort-change="sort_change"
    >
      <el-table-column v-if="multiple" type="selection" width="55" align="center" fixed="left" />

      <template v-for="(list,index) in headerList">
        <table-column-item v-if="is_hide_column(list.prop)" :key="(`${list.prop}_${index}`)" :list="list" :sort-type="sortType">
          <template slot="header-template" slot-scope="scope">
            <slot name="header-template" :scope="scope.scope" :list="scope.list" :label="scope.label" />
          </template>

          <template slot="cell-template" slot-scope="scope">
            <slot name="cell-template" :scope="scope.scope" :list="scope.list" :cell-value="scope.cellValue" :row="scope.row" :column="scope.column" :index="scope.index" :table-data="data" />
          </template>
        </table-column-item>
      </template>
    </el-table>
    <div v-if="show" class="table-pagination">
      <el-pagination
        ref="pagination"
        :current-page="page_no"
        :page-sizes="pageSizes"
        :page-size="pageSizes[0]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
        :pager-count="5"
        @size-change="size_change"
        @current-change="pagination_current_change"
      />
    </div>
  </div>
</template>

<script>
import table_select from '@/mixins/table-select'
import TableColumnItem from '@/components/table-column-item'

export default {
  components: {
    TableColumnItem
  },
  mixins: [table_select],
  props: {
    autoInit: {
      type: Boolean,
      default: true
    },
    headerList: {
      type: Array,
      default: () => ([])
    },
    options: {
      type: Object,
      default: () => ({})
    },
    rowClickNoSelect: {
      type: Boolean,
      default: false
    },
    fixedHeight: {
      type: [Number, String],
      default: 0
    },
    hideColumn: {
      type: Array,
      default: () => ([])
    },
    superMini: {
      type: Boolean,
      default: false
    },
    summaryOptions: {
      type: Array,
      default: () => ([])
    },
    sortType: {
      type: String,
      default: 'server'
    }
  },
  data() {
    return {
      content_height: '100%',
      table_height: '100%'
    }
  },
  created() {
    this.refresh_flag = setTimeout(() => {
      this.autoInit && this.request_data()
      this.refresh_flag = true
    }, 0)
  },
  activated() {
    if (typeof this.refresh_flag === 'number') {
      clearTimeout(this.refresh_flag)
      this.refresh_flag = true
    }
    this.autoInit && this.refresh({ keep: true })
  },
  methods: {
    summary_func(param) {
      return this.summaryMethod(param) || this.get_summary(param)
    },
    get_summary(param) {
      // summaryOptions  Array
      /**
       * property prop 值
       * precision 精度 小数位数
       * unit 单位
       */
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        const option = this.summaryOptions.find(item => item.property === column.property)
        if (this.summaryOptions.length !== 0 && !option) {
          sums[index] = ''
          return
        }
        let [precision, unit] = [0, '']

        // const
        if (option) {
          precision = option.precision || 0
          unit = option.unit || ''
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)

          sums[index] = `${sums[index].toFixed(precision)} ${unit}`
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    },
    setCurrentRow(param) {
      this.$refs.table.setCurrentRow(param)
    },
    cell_class_name({ row, column, rowIndex, columnIndex }) {
      const classes = []

      if (this.superMini) {
        classes.push('super-mini')
      }

      return classes
    },

    click(row, column) {
      this.rowClickNoSelect ? this.row_click_no_select(row, column) : this.row_click(row, column)
    },
    row_click_no_select(...args) {
      const [row, column] = args
      if (column && column.type === 'selection') {
        this.highlight_current_row = false
        this.$refs.table.toggleRowSelection(row)
        return
      }
      // row column
      this.highlight_current_row = true
      this.set_currentRow(row)
      this.$emit('row-click', ...args)
    },
    select() {
      if (!this.rowClickNoSelect) this.highlight_current_row = false
    },
    // 全选事件
    select_all() {
      if (!this.rowClickNoSelect) this.highlight_current_row = false
    },
    is_hide_column(prop) {
      if (this.hideColumn.includes(prop)) return false
      return true
    },

    // 重新计算表格的最大高度
    calc() {
      if (this.fixedHeight) {
        this.content_height = this.fixedHeight
        if (this.show && typeof this.fixedHeight === 'string') {
          this.table_height = `calc(100% - ${this.$refs.pagination.$el.clientHeight}px)`
        }
        return
      }
      if (!this.$refs.table) return

      this.content_height = window.innerHeight - this.$refs.table.$el.getBoundingClientRect().top

      if (this.show) {
        this.table_height = this.content_height - this.$refs.pagination.$el.clientHeight
      } else {
        this.table_height = this.content_height
      }

      // if (!this.$refs.table) return
      // if (!this.show) {
      //   this.max_height = window.innerHeight - this.$refs.table.$el.getBoundingClientRect().top
      //   this.$refs.table.$el.style.maxHeight = this.max_height + 'px'
      //   return
      // } else {
      //   this.max_height = (window.innerHeight - this.$refs.pagination.$el.clientHeight - 10) - this.$refs.table.$el.getBoundingClientRect().top
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep
.el-table__row {
  .super-mini {
    padding: 0;
    .cell {
      line-height: 22px;
    }
  }
}

</style>
