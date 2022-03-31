<template>
  <ki-dialog
    :visible="visible"
    title="检验数据预览"
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
        <!-- <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" /> -->
        <el-form :model="form" inline>
          <el-form-item label="批量设置检测时间:">
            <el-date-picker
              v-model="form.inspectionDate"
              type="datetime"
              size="mini"
              placeholder=""
              style="width: 98%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="inspectionDate_change"
            />
          </el-form-item>
          <el-form-item label="批量设置录入时间:">
            <el-date-picker
              v-model="form.createDate"
              type="datetime"
              size="mini"
              placeholder=""
              style="width: 98%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="createDate_change"
            />
          </el-form-item>
        </el-form>
        <div />
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column v-for="item of dyHeaderList" :key="item.prop" :prop="item.prop" :label="item.label" :min-width="['inspectionDate', 'createDate'].includes(item.prop) ? '140':''" />
        </el-table>
      </div>
    </div>
  </ki-dialog>
</template>

<script>

// import UploadExcelComponent from '@/components/UploadExcel/index.vue'
// import { dateformat } from '@/utils/date-method'
import { mapGetters } from 'vuex'
export default {
  name: 'PreviewDialog',
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
    },
    previewData: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      form: {
        createDate: '',
        inspectionDate: ''
      },
      badNames_data: [],
      tableData: [],
      tableHeader: [],
      nubmer_value_keys: [],
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
    isDate(dateStr) {
      if (isNaN(dateStr) && !isNaN(Date.parse(dateStr))) {
        return true
      }
      return false
    },
    validation_data() {
      let errorMsg = ''
      for (let index = 0; index < this.tableData.length; index++) {
        const { inspectionDate, createDate } = this.tableData[index]
        if (!inspectionDate) {
          errorMsg = '检验时间不能为空'
          break
        }
        if (!this.isDate(inspectionDate)) {
          errorMsg = '检验时间不是时间格式的字符串'
          break
        }
        if (!createDate) {
          errorMsg = '录入时间不能为空'
          break
        }
        if (!this.isDate(createDate)) {
          errorMsg = '录入时间不是时间格式的字符串'
          break
        }
        for (let i = 0; i < this.nubmer_value_keys.length; i++) {
          const el = this.tableData[index][this.nubmer_value_keys[i]]
          if (!el) {
            errorMsg = '样本值或不良项目都是必填的'
            break
          } else {
            var n = parseInt(el)
            if (isNaN(n)) {
              errorMsg = '样本值或不良项目必须是数值'
              break
            }
          }
        }
        if (errorMsg) {
          break
        }
      }
      if (!errorMsg) {
        return true
      }
      this.$message.warning(errorMsg)
      return false
    },
    inspectionDate_change(date) {
      this.tableData = this.tableData.map(row => {
        return {
          ...row,
          inspectionDate: date
        }
      })
    },
    createDate_change(date) {
      this.tableData = this.tableData.map(row => {
        return {
          ...row,
          createDate: date
        }
      })
    },
    clear() {
      this.badNames_data = []
      this.tableData = []
      this.tableHeader = []
      this.nubmer_value_keys = []
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      if (!this.validation_data()) return
      const param = this.getSaveParams()
      const { code, data } = await this.$api.inspectionRecord_save(param)
      if (code === '200' && data) {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async add(loading) {

    },
    async update() {

    },
    open({ load }) {
      this.tableData = this.previewData
      this.nubmer_value_keys = []
      this.dyHeaderList.forEach(item => {
        if (item.t === 'n') {
          this.nubmer_value_keys.push(item.prop)
        }
      })
      if (['p', 'np'].includes(this.controlChartType)) {
        // console.log(' this.badNames', this.badNames)
        this.badNames.badDefinitionTitles.forEach((item, index) => {
          const o = {}
          o.id = this.badNames.badDefinitionIds[index]
          o.badName = item
          this.badNames_data.push(o)
        })
      }
    //   console.log('this.nubmer_value_keys', this.nubmer_value_keys)
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
      //   const rowLabels = this.dyHeaderList.map(item => item.label)
      // console.log('rowKeys', rowKeys)
      const inspectionRecordList = []
      this.tableData.forEach(row => {
        const inspectionRecord = {
          // controlChartSonId: this.controlChartSonId,
          ...h_type
        }
        rowKeys.forEach((key, index) => {
          inspectionRecord[key] = row[rowKeys[index]]
        })
        this.pointHierarchicalTypeIds.forEach(id => {
          const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
          if (hierarchicalItem) {
            const k = `hierarchicalTypeValue${this.parseNum[hierarchicalItem.serialNumber]}`
            inspectionRecord[k] = `${hierarchicalItem.id}=${inspectionRecord[k] || ''}`
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
