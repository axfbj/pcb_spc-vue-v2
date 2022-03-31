<template>
  <ki-dialog
    :visible="visible"
    title="检验数据导入"
    v-bind="$attrs"
    width="80%"
    top="5vh"
    :button-text="['预览','取消']"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <div class="app-container">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" :visible="visible" @sheet-change="sheet_change" />
        <el-table :data="r_data" border style="width: 100%;margin-bottom:20px;" row-key="key" :cell-class-name="getBackgound2" @cell-click="cell_click">
          <el-table-column
            v-for="item in dyHeaderList"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            :column-key="item.prop"
            min-width="180"
          >
          <!--  -->
          </el-table-column>
        </el-table>

        <el-table ref="excel_table" :data="tableData" border style="width: 100%;margin-top:20px;" row-key="key" height="50vh" :cell-class-name="getBackgound" @cell-click="handleClick">
          <el-table-column
            v-for="item in tableHeader"
            :key="item.key"
            :prop="item.prop"
            :label="item.label"
            :column-key="item.key"
          />
        </el-table>
      </div>
    </div>

    <preview-dialog
      :visible="preview_dialog"
      :control-chart-son-id="controlChartSonId"
      :bad-names="badNames"
      :dy-header-list="dyHeaderList"
      :control-chart-type="controlChartType"
      :point-hierarchical-type-ids="pointHierarchicalTypeIds"
      :preview-data="preview_data"
      @handleClose="preview_dialog_close"
      @confirm="preview_dialog_confirm"
    />
  </ki-dialog>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/type2.vue'
import PreviewDialog from './preview-dialog'

export default {
  name: 'UploadExcel2',
  components: { UploadExcelComponent, PreviewDialog },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    controlChartSonId: {
      type: String,
      default: ''
    },
    dyHeaderList: {
      type: [Object, Array],
      default: () => ({})
    },
    pointHierarchicalTypeIds: {
      type: Array,
      default: () => ([])
    },
    badNames: {
      type: [Array, Object],
      default: () => ({})
    },
    controlChartType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      top_table_columnKey: '',
      columnKey: '',
      highlightArr: [],
      tableData: [],
      tableHeader: [],
      r_data: [],

      current_prop: '', // prop的值
      data_prop: '',

      currentColumnIndex: undefined, // 点中的哪一列

      nubmer_value_keys: [],

      preview_data: [],
      SheetName: '',
      preview_dialog: false
    }
  },
  computed: {

    h_arr() {
      const h_l = []
      if (this.highlightArr.length === 0) {
        return []
      } else if (this.highlightArr.length === 1) {
        return [this.highlightArr[0], this.highlightArr[0]]
      } else if (this.highlightArr.length === 2) {
        let n, min
        if (this.highlightArr[0] > this.highlightArr[1]) {
          n = this.highlightArr[0] - this.highlightArr[1]
          min = this.highlightArr[1]
        } else {
          n = this.highlightArr[1] - this.highlightArr[0]
          min = this.highlightArr[0]
        }
        h_l.push(min)
        for (let i = 1; i <= n; i++) {
          h_l.push(min + i)
        }
      }
      return h_l
    }
  },
  watch: {
    current_prop(porp) {
      this.data_prop = ''
      this.columnKey = ''
      this.highlightArr = []
    }
  },
  methods: {

    preview_dialog_close() {
      this.preview_dialog = false
    },
    preview_dialog_confirm() {
      this.preview_dialog = false
      this.$emit('confirm')
    },
    sheet_change({ SheetName }) {
      this.data_prop = ''
      this.columnKey = ''
      this.highlightArr = []
      this.SheetName = SheetName
    },

    handleClose() {
      this.$emit('handleClose')
    },
    confirm() {
      this.preview_dialog = true
    },
    open() {
      this.r_data.push(this.getOneRow())
      this.nubmer_value_keys = []
      this.dyHeaderList.forEach(item => {
        if (item.t === 'n') {
          this.nubmer_value_keys.push(item.prop)
        }
      })
    },
    closed() {
      this.clear()
    },
    clear() {
      this.top_table_columnKey = ''
      this.columnKey = ''
      this.highlightArr = []
      this.tableData = []
      this.tableHeader = []
      this.r_data = []
      this.current_prop = ''
      this.data_prop = ''
      this.currentColumnIndex = undefined
      this.nubmer_value_keys = []
      this.preview_data = []
      this.SheetName = ''
    },
    getOneRow() {
      const o = {}
      this.dyHeaderList.forEach(head => {
        o[head.prop] = '未指定数据'
      })
      return o
    },
    async request_data({ page_no, page_size, table_data }) {
      return {
        data: this.r_data,
        total: this.r_data.length
      }
    },
    cell_click(row, column, cell, event) {
      this.current_prop = column.property
      this.top_table_columnKey = column['columnKey']
    },
    getBackgound2({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex
      if (this.top_table_columnKey === column.columnKey) return 'bacColorf4984e'
      return ''
    },
    getBackgound({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex
      column.index = columnIndex
      if (this.h_arr.includes(Number(row.key)) && this.columnKey === column.columnKey) {
        return 'bacColorf4984e'
      } else {
        return ''
      }
    },
    get_select_data() {
      if (!this.current_prop) return
      const select_data = this.tableData.filter(item => {
        return this.h_arr.includes(item.index)
      })
      const d = select_data.map(item => {
        if (this.nubmer_value_keys.includes(this.current_prop)) {
          return item[this.data_prop] || 0
        } else {
          return item[this.data_prop] || ''
        }
      })
      this.preview_data = this.preview_data.filter(item => {
        delete item[this.current_prop]
        return Object.keys(item).length !== 0
      })

      d.forEach((value, index) => {
        if (this.preview_data[index]) {
          this.preview_data[index][this.current_prop] = value
        } else {
          this.preview_data[index] = {}
          this.preview_data[index][this.current_prop] = value
        }
      })
      // console.log(this.preview_data)
      return d
    },
    setInfo() {
      let str = ''
      if ([undefined, null, ''].includes(this.currentColumnIndex)) return str
      str = `${this.currentColumnIndex + 1}列`
      if (this.highlightArr.length === 1) {
        str += `${this.highlightArr[0] + 1}行 共1个数据`
      }
      if (this.highlightArr.length === 2) {
        const min = this.highlightArr[0] > this.highlightArr[1] ? this.highlightArr[1] : this.highlightArr[0]
        const max = this.highlightArr[0] > this.highlightArr[1] ? this.highlightArr[0] : this.highlightArr[1]
        str += ` ${min + 1}行 - ${max + 1}行 共${(max - min) + 1} 个数据(${this.SheetName})`
      }
      return str
    },
    handleClick(row, column) {
      this.data_prop = column.property
      this.currentColumnIndex = column.index

      this.columnKey = column['columnKey']
      if (this.highlightArr.length === 2) {
        this.highlightArr = []
      }
      if (row.key) { this.highlightArr.push(Number(row.key)) }

      this.r_data[0][this.current_prop] = this.setInfo()
      this.get_select_data()
    },
    beforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5
      if (isLt5M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 5m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      // console.log('header', header)
      // console.log('results', results)
      const h = header.map((item, index) => {
        return {
          prop: item,
          label: item,
          current: false,
          key: `${index}`
        }
      })
      const r = results.map((item, index) => {
        return {
          key: `${index}`,
          ...item
        }
      })

      const newHeaders = this.unique_addIndex(h, 'prop')
      // console.log('newHeaders', newHeaders)
      this.tableHeader = newHeaders
      this.tableData = r
      this.$nextTick(() => {
        this.$refs.excel_table.doLayout()
        // el-table加ref="multipleTable"
      })
    },
    unique_addIndex(originalList, id) {
      // let originalList=[{name:'张三'},{name:'张三'},{name:'王五'},{name:'李四'},{name:'张三'},{name:'李四'},{name:'张三'}]
      // console.log(originalList)
      // 数组去重
      const maps = new Map()
      const list = originalList.filter((a) => !maps.has(a[id]) && maps.set(a[id], 1))

      // 剔除只出现一次的子
      const List = JSON.parse(JSON.stringify(list))
      for (let x = 0; x < list.length; x++) {
        let num = 0 // 表示出现的次数 只出现1次的可以剔除了
        for (let y = 0; y < originalList.length; y++) {
          if (originalList[y][id] === list[x][id]) {
            num += 1
          }
        }
        if (num === 1) {
        // 只重复1次 获取下标 然后移除
          const ind = List.findIndex(item => { return item[id] === list[x][id] })
          List.splice(ind, 1)
        }
      }

      // 然后创建变量为0 出现一次就+1  下一次大循环的时候清空
      for (let x = 0; x < List.length; x++) {
        let num = -1
        for (let y = 0; y < originalList.length; y++) {
          if (originalList[y][id] === List[x][id]) {
            num += 1
            if (num > 0) {
              originalList[y][id] = originalList[y][id] + '_' + num
            }
          }
        }
      }
      return originalList
    }
  }

}
</script>

<style scoped>
::v-deep .drop{
  height: 60px;
  line-height: 60px;
}
</style>

<style>

.el-table tbody tr:hover > td.flag{
  background-color: 'f4984e';
}

.rgb196 {
    background: rgb(196, 196, 196);
}
.bacColor317eb0 {
    background: #317eb0;
}
td.bacColorf4984e {
    background: #f4984e !important;
}
.el-table tbody tr:hover > td.bacColorf4984e {
  background: #f4984e !important;
}
.el-table tbody tr > td.bacColorf4984e {
  background: #f4984e !important;
}

</style>
