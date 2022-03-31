<template>
  <ki-dialog
    :visible="visible"
    title="检验数据导入"
    v-bind="$attrs"
    width="80%"
    top="5vh"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <div class="app-container">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        <div />
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        </el-table>
      </div>
    </div>
  </ki-dialog>
</template>

<script>

import UploadExcelComponent from '@/components/UploadExcel/index.vue'
// import { dateformat } from '@/utils/date-method'
import { mapGetters } from 'vuex'
export default {
  name: 'ExcelImportDialog',
  components: { UploadExcelComponent },
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
      tableData: [],
      tableHeader: [],
      badNames_data: [],
      parseNum: {
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine'
      },
      parseChartType: {
        'Xbar-R': 1,
        'Xbar-s': 2,
        'X-MR': 3,
        'p': 4,
        'np': 5
      }
    }
  },

  computed: {
    ...mapGetters(['hierarchicalTypes', 'userId']),
    getChartNum() {
      return this.parseChartType[this.controlChartType] || ''
    }
  },
  methods: {
    clear() {
      this.badNames_data = []
      this.tableData = []
      this.tableHeader = []
    },
    handleClose() {
      this.$emit('handleClose')
    },
    import_verification() {
      // const rowKeys = this.dyHeaderList.map(item => item.prop)
      // this.tableHeader =
    },
    beforeUpload(file) {
      this.import_verification()
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      // console.log('results', results)
      const rowLabels = this.dyHeaderList.map(item => item.label)
      const nubmer_value_keys = []
      this.dyHeaderList.forEach(item => {
        if (item.t === 'n') {
          nubmer_value_keys.push(item.label)
        }
      })
      // console.log('nubmer_value_keys', nubmer_value_keys)
      // console.log('rowKeys', rowLabels)
      // console.log('header', header)

      if (rowLabels.length !== header.length) {
        this.$message.warning('导入的excel与模板的表头数量对不上!')
        return
      }
      let errMessage = ''
      for (let i = 0; i < rowLabels.length; i++) {
        if (rowLabels[i] !== header[i]) {
          errMessage = `表头项目对不上!`
          break
        }
      }
      if (errMessage !== '') {
        this.$message.warning(errMessage)
        return
      }
      if (results.length === 0) {
        this.$message.warning('请导入含有数据的模板!')
        return
      }
      // results = results.map(row => {
      //   return {
      //     ...row,
      //     '抽检时间': dateformat(this.getFormatDate_XLSX(row['抽检时间'])),
      //     '录入时间': dateformat(this.getFormatDate_XLSX(row['录入时间']))
      //   }
      // })
      const tableData = []
      for (let i = 0; i < results.length; i++) {
        const row = results[i]
        for (let i = 0; i < nubmer_value_keys.length; i++) {
          if (!row[nubmer_value_keys[i]]) {
            errMessage = '样本值或不良项目都是必填的!'
            break
          }
        }
        if (errMessage !== '') {
          break
        }
        for (const key in row) {
          if (Object.hasOwnProperty.call(row, key)) {
            const v = row[key]
            if (nubmer_value_keys.includes(key)) {
              // console.log('key', key)
              if (isNaN(Number(v))) {
                errMessage = `${nubmer_value_keys[i]}应该是一个数字类型!`
                break
              }
            }
          }
        }

        if (errMessage !== '') {
          break
        }
        const r = { ...row }

        if (!row['抽检时间']) {
          errMessage = '检验时间不能为空'
          break
        }
        if (!this.isDate(row['抽检时间'])) {
          errMessage = '检验时间不是时间格式的字符串'
          break
        }
        if (!row['录入时间']) {
          errMessage = '录入时间不能为空'
          break
        }
        if (!this.isDate(row['录入时间'])) {
          errMessage = '录入时间不是时间格式的字符串'
          break
        }

        // if (this.getFormatDate_XLSX(row['抽检时间']) instanceof Date) {
        // if (!isNaN(this.getFormatDate_XLSX(row['抽检时间']).getTime())) {
        //   r['抽检时间'] = dateformat(this.getFormatDate_XLSX(row['抽检时间']))
        // } else {
        //   errMessage = '抽检时间需要是一个时间格式'
        //   break
        // }
        // if (!isNaN(this.getFormatDate_XLSX(row['抽检时间']).getTime())) {
        //   r['录入时间'] = dateformat(this.getFormatDate_XLSX(row['录入时间']))
        // } else {
        //   errMessage = '录入时间需要是一个时间格式'
        //   break
        // }
        tableData.push(r)
      }

      if (errMessage !== '') {
        this.$message.warning(errMessage)
        return
      }
      // console.log('tableData', tableData)

      this.tableData = tableData
      this.tableHeader = header
    },
    isDate(dateStr) {
      if (isNaN(dateStr) && !isNaN(Date.parse(dateStr))) {
        return true
      }
      return false
    },
    async confirm({ loading }) {
      if (this.tableData.length > 0) {
        this.add(loading)
        return
      }
      this.$message.warning('请导入含有数据的excel模板!')
    },
    async add(loading) {
      const param = this.getSaveParams()
      const { code, data } = await this.$api.inspectionRecord_save(param)
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async update() {

    },
    async open({ load }) {
      if (['p', 'np'].includes(this.controlChartType)) {
        this.badNames.badDefinitionTitles.forEach((item, index) => {
          const o = {}
          o.id = this.badNames.badDefinitionIds[index]
          o.badName = item
          this.badNames_data.push(o)
        })
      }
    },
    closed() {
      this.clear()
    },
    getSaveParams() {
      const h_type = {
        'hierarchicalTypeValueEight': '',
        'hierarchicalTypeValueFive': '',
        'hierarchicalTypeValueFour': '',
        'hierarchicalTypeValueNine': '',
        'hierarchicalTypeValueOne': '',
        'hierarchicalTypeValueSeven': '',
        'hierarchicalTypeValueSix': '',
        'hierarchicalTypeValueThree': '',
        'hierarchicalTypeValueTwo': ''
      }
      const rowKeys = this.dyHeaderList.map(item => item.prop)
      const rowLabels = this.dyHeaderList.map(item => item.label)
      // console.log('rowKeys', rowKeys)
      const inspectionRecordList = []
      this.tableData.forEach(row => {
        const inspectionRecord = {
          // controlChartSonId: this.controlChartSonId,
          ...h_type
        }
        rowKeys.forEach((key, index) => {
          inspectionRecord[key] = row[rowLabels[index]]
        })
        this.pointHierarchicalTypeIds.forEach(id => {
          const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
          if (hierarchicalItem) {
            const k = `hierarchicalTypeValue${this.parseNum[hierarchicalItem.serialNumber]}`
            inspectionRecord[k] = `${hierarchicalItem.id}=${inspectionRecord[k]}`
          }
        })
        if (['p', 'np'].includes(this.controlChartType)) {
          inspectionRecord.objectList = []
          this.badNames_data.forEach((item, index) => {
            inspectionRecord.objectList[index] = {
              id: item.id,
              value: inspectionRecord[`badValue${index + 1}`]
            }
          })
        } else {
          delete inspectionRecord.objectList
        }
        inspectionRecord.createUser = this.userId
        inspectionRecordList.push(inspectionRecord)
      })
      // console.log('inspectionRecordList', inspectionRecordList)

      const p = {
        controlChartSonId: this.controlChartSonId,
        controlChartType: this.getChartNum,
        inspectionRecordList
      }

      // console.log(p)
      return p
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .drop{
  height: 100px;
  line-height: 100px;
}
</style>
