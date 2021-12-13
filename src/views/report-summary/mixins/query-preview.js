import { dateformat } from '@/utils/date-method'
export default {
  data() {
    return {
      unique: '',
      header_list_none: [
        { prop: 'serialNumber', label: '序号', width: '100' },
        { prop: 'controlGroupName', label: '控制组名称', width: '100' }
      ]
    }
  },
  methods: {
    async request_data({ page_no, page_size, table_data }) {
      return {
        data: this.t_data,
        total: this.t_data.length
      }
    },

    get_processCapabilityQueryParams(form_data) {
      const data = form_data
      const colFieldKeysObj = {}
      data.colFieldKeys.forEach(item => {
        colFieldKeysObj[item] = 1
      })

      const params = {
        'excelName': `工序能力报表${dateformat(new Date())}`,

        'allSD': 0,
        'average': 0,
        'ca': 0,
        'cp': 0,
        'cpk': 0,
        'cpl': 0,
        'cpu': 0,
        'groupSD': 0,
        'max': 0,
        'min': 0,
        'pp': 0,
        'ppk': 0,
        'ppl': 0,
        'ppu': 0,
        'r': 0,
        'records': 0,

        'hierarchicalTypeEight': 0,
        'hierarchicalTypeFive': 0,
        'hierarchicalTypeFour': 0,
        'hierarchicalTypeNine': 0,
        'hierarchicalTypeOne': 0,
        'hierarchicalTypeSeven': 0,
        'hierarchicalTypeSix': 0,
        'hierarchicalTypeThree': 0,
        'hierarchicalTypeTwo': 0,
        'cpkHighlight': 0,
        'cpkHighlightValue': 0,

        'hierarchicalTypeValueEight': '',
        'hierarchicalTypeValueFive': '',
        'hierarchicalTypeValueFour': '',
        'hierarchicalTypeValueNine': '',
        'hierarchicalTypeValueOne': '',
        'hierarchicalTypeValueSeven': '',
        'hierarchicalTypeValueSix': '',
        'hierarchicalTypeValueThree': '',
        'hierarchicalTypeValueTwo': '',
        'controlGroupIds': data.controlGroupKeys,
        ...colFieldKeysObj,
        ...data.hierarchicalTypeKeys,
        ...data.filteOptions_data
      }
      return params
    },

    async processCapabilityExcelQuery_preview() {
      const { code, data } = await this.$api.processCapabilityExcelQuery(this.get_processCapabilityQueryParams(this.form))
      // const { code, data } = {
      //   'data': [
      //     {
      //       '序号': 1,
      //       '控制组名称': '/金软vcp打金厚度',
      //       '检测项目': '壁厚1（mm）',
      //       '产品型号': '333',
      //       '产品名称': '',
      //       '产线': '',
      //       '班次': '22',
      //       '设备': '',
      //       '供应商': '',
      //       '客户': '',
      //       '批次': '',
      //       '工商单号': '',
      //       'Cpk': '0.00',
      //       'Cp': '0.00',
      //       'Cpl': '0.67',
      //       'CPU': '0.00',
      //       'Ppk': '0.00',
      //       'Pp': '0.00',
      //       '平均值': '19.526066',
      //       '极差值': '110.084',
      //       '最大值': '111.0',
      //       '最小值': '0.916',
      //       '记录数': '6'
      //     }
      //   ],
      //   'code': '200',
      //   'msg': '操作成功'
      // }
      this.unique = '序号'
      if (code === '200' && data) {
        if (data.length === 0) {
          this.header_list = this.header_list_none
          this.t_data = []
        } else {
          this.header_list.splice(0, this.header_list.length)
          for (const key in data[0]) {
            if (Object.hasOwnProperty.call(data[0], key)) {
              const head = { prop: key, label: key }
              if (key === '控制组名称') {
                head.width = '180'
              }
              if (key === '检测项目') {
                head.width = '180'
              }
              this.header_list.push(head)
            }
          }
          this.export_disabled = false
          this.t_data = data
        }
        this.$refs.dy_table.refresh()
      } else {
        this.export_disabled = true
      }
    },
    async processCapabilityExcel_export() {
      const data = await this.$api.processCapabilityExcel(this.get_processCapabilityQueryParams(this.export_form))
      if (data) {
        // window.open(data)
        const blob = new Blob([data])
        console.log(blob)
        const elink = document.createElement('a')
        elink.download = `工序能力报表${dateformat(new Date())}.xls`
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      }
    },
    get_abnormalPointExcelQueryParams(form_data) {
      const data = this.form_data
      const params = {
        'hierarchicalTypeValueEight': '',
        'hierarchicalTypeValueFive': '',
        'hierarchicalTypeValueFour': '',
        'hierarchicalTypeValueNine': '',
        'hierarchicalTypeValueOne': '',
        'hierarchicalTypeValueSeven': '',
        'hierarchicalTypeValueSix': '',
        'hierarchicalTypeValueThree': '',
        'hierarchicalTypeValueTwo': '',

        'excelName': '',
        'controlGroupIds': data.controlGroupKeys,
        ...data.filteOptions_data

      }

      return params
    },
    async abnormalPointExcelQuery_preview() {
      const { code, data } = await this.$api.abnormalPointExcelQuery(this.get_abnormalPointExcelQueryParams(this.form))
      // const { code, data } = {
      //   'data': [
      //     {
      //       'controlChartSonId': '1463040139432431616',
      //       'controlChartCode': '12345',
      //       'controlChartName': '深圳和美spc\\test',
      //       'inspectionName': '壁厚1（mm）',
      //       'hierarchicalNameOne': '产品型号',
      //       'hierarchicalNameTwo': '产品名称',
      //       'hierarchicalNameThree': '产线',
      //       'hierarchicalNameFour': '班次',
      //       'hierarchicalNameFive': '设备',
      //       'hierarchicalNameSix': '供应商',
      //       'hierarchicalNameSeven': '客户',
      //       'hierarchicalNameEight': '批次',
      //       'hierarchicalNameNine': '工商单号',
      //       'hierarchicalTypeValueOne': 'testAdd',
      //       'hierarchicalTypeValueTwo': '',
      //       'hierarchicalTypeValueThree': '',
      //       'hierarchicalTypeValueFour': '',
      //       'hierarchicalTypeValueFive': '',
      //       'hierarchicalTypeValueSix': '',
      //       'hierarchicalTypeValueSeven': '',
      //       'hierarchicalTypeValueEight': '',
      //       'hierarchicalTypeValueNine': '',
      //       'abnormalInformation': 'R0:超出规格限',
      //       'abnormalReason': null,
      //       'handleProgramme': '1',
      //       'processingDate': '2021-11-30 11:59:57'
      //     },
      //     {
      //       'controlChartSonId': '1463040139432431616',
      //       'controlChartCode': '12345',
      //       'controlChartName': '深圳和美spc\\test',
      //       'inspectionName': '壁厚1（mm）',
      //       'hierarchicalNameOne': '产品型号',
      //       'hierarchicalNameTwo': '产品名称',
      //       'hierarchicalNameThree': '产线',
      //       'hierarchicalNameFour': '班次',
      //       'hierarchicalNameFive': '设备',
      //       'hierarchicalNameSix': '供应商',
      //       'hierarchicalNameSeven': '客户',
      //       'hierarchicalNameEight': '批次',
      //       'hierarchicalNameNine': '工商单号',
      //       'hierarchicalTypeValueOne': 'testAdd',
      //       'hierarchicalTypeValueTwo': '',
      //       'hierarchicalTypeValueThree': '',
      //       'hierarchicalTypeValueFour': '',
      //       'hierarchicalTypeValueFive': '',
      //       'hierarchicalTypeValueSix': '',
      //       'hierarchicalTypeValueSeven': '',
      //       'hierarchicalTypeValueEight': '',
      //       'hierarchicalTypeValueNine': '',
      //       'abnormalInformation': 'R0:超出规格限',
      //       'abnormalReason': null,
      //       'handleProgramme': '1',
      //       'processingDate': '2021-11-30 11:59:57'
      //     }
      //   ],
      //   'code': '200',
      //   'msg': '操作成功'
      // }
      const header_list = [
        { prop: 'serialNumber', label: '序号' },
        { prop: 'controlChartName', label: '控制组名称' },
        { prop: 'controlChartCode', label: '控制组编号' },
        { prop: 'inspectionName', label: '检测项目' },
        ... this.hierarchicalTypes.map((item) => {
          return { prop: `hierarchicalTypeValue${this.parseNum[item.serialNumber]}`, label: item.hierarchicalName }
        }),
        { prop: 'abnormalInformation', label: '失控信息' },
        { prop: 'abnormalReason', label: '失控原因' }

      ]
      this.unique = 'controlChartSonId'
      this.header_list = header_list

      if (code === '200' && data) {
        this.export_disabled = false
        this.t_data = data.map((item, index) => {
          return {
            ...item,
            serialNumber: index + 1
          }
        })
        this.$refs.dy_table.refresh()
      } else {
        this.export_disabled = true
      }
    },
    async abnormalPointExcel_export() {
      const { code, data } = await this.$api.abnormalPointExcel(this.get_abnormalPointExcelQueryParams(this.export_form))
      if (code === '200' && data) {
        // window.open(data)
      }
    },
    get_yieldRateReportExcelQueryParams(form_data) {
      const data = form_data
      const params = {
        'hierarchicalTypeValueEight': '',
        'hierarchicalTypeValueFive': '',
        'hierarchicalTypeValueFour': '',
        'hierarchicalTypeValueNine': '',
        'hierarchicalTypeValueOne': '',
        'hierarchicalTypeValueSeven': '',
        'hierarchicalTypeValueSix': '',
        'hierarchicalTypeValueThree': '',
        'hierarchicalTypeValueTwo': '',

        'excelName': '',
        'controlGroupIds': data.controlGroupKeys,
        ...data.filteOptions_data

      }

      return params
    },
    async yieldRateReportExcelQuery_preview() {
      const { code, data } = await this.$api.yieldRateReportExcelQuery(this.get_yieldRateReportExcelQueryParams(this.form))
      // const { code, data } = {
      //   'data': [
      //     {
      //       'serialNumber': 1,
      //       'controlChartId': '1468899905694208000',
      //       'controlChartName': '/金软vcp打金厚度',
      //       'controlChartCode': '2112091639047689',
      //       'value1': null,
      //       'badDefinitionValue': null,
      //       'badName': null,
      //       'inspectionNum': 20,
      //       'goodNum': 18,
      //       'yieldRate': '90%',
      //       'badNameOne': 'A1不良项目',
      //       'badNumOne': '1',
      //       'badPercentageOne': '50%',
      //       'badNameTwo': 'B1不良项目',
      //       'badNumTwo': '1',
      //       'badPercentageTwo': '50%',
      //       'badNameThree': null,
      //       'badNumThree': null,
      //       'badPercentageThree': null,
      //       'hierarchicalNameOne': '产品型号',
      //       'hierarchicalNameTwo': '产品名称',
      //       'hierarchicalNameThree': '产线',
      //       'hierarchicalNameFour': '班次',
      //       'hierarchicalNameFive': '设备',
      //       'hierarchicalNameSix': '供应商',
      //       'hierarchicalNameSeven': '客户',
      //       'hierarchicalNameEight': '批次',
      //       'hierarchicalNameNine': '工商单号',
      //       'hierarchicalTypeValueOne': 'test',
      //       'hierarchicalTypeValueTwo': '',
      //       'hierarchicalTypeValueThree': '',
      //       'hierarchicalTypeValueFour': '',
      //       'hierarchicalTypeValueFive': '',
      //       'hierarchicalTypeValueSix': '',
      //       'hierarchicalTypeValueSeven': '',
      //       'hierarchicalTypeValueEight': '',
      //       'hierarchicalTypeValueNine': ''
      //     }
      //   ],
      //   'code': '200',
      //   'msg': '操作成功'
      // }

      const badNumTop = []
      for (let i = 1; i <= 3; i++) {
        const badName = { prop: `badName${this.parseNum[i]}`, label: `代码${i}` }
        const badNum = { prop: `badNum${this.parseNum[i]}`, label: `数量${i}` }
        const badPercentage = { prop: `badPercentage${this.parseNum[i]}`, label: `百分比${i}` }
        badNumTop.push(...[badName, badNum, badPercentage])
      }
      const header_list = [
        { prop: 'serialNumber', label: '序号' },
        { prop: 'controlChartName', label: '控制组名称', minWidth: '180' },
        { prop: 'controlChartCode', label: '控制组编号', minWidth: '140' },
        ... this.hierarchicalTypes.map((item) => {
          return { prop: `hierarchicalTypeValue${this.parseNum[item.serialNumber]}`, label: item.hierarchicalName }
        }),
        { prop: 'inspectionNum', label: '抽检数' },
        { prop: 'goodNum', label: '良品' },
        { prop: 'yieldRate', label: '良品率' },
        { prop: 'badNumTop', label: '缺陷数前三项', align: 'center', children: [
          ...badNumTop
        ] }
      ]
      this.unique = 'serialNumber'
      this.header_list = header_list
      if (code === '200' && data) {
        this.export_disabled = false
        this.t_data = data.map((item, index) => {
          return {
            ...item,
            serialNumber: index + 1
          }
        })
        this.$refs.dy_table.refresh()
      } else {
        this.export_disabled = true
      }
    },
    async yieldRateReportExcel_export() {
      const { code, data } = await this.$api.yieldRateReportExcel(this.get_yieldRateReportExcelQueryParams(this.export_form))
      if (code === '200' && data) {
        // window.open(data)
      }
    }
  }
}
