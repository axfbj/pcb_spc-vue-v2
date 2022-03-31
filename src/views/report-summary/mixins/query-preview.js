import { dateformat } from '@/utils/date-method'
import { download_Blob } from '@/utils/download-files'
export default {
  data() {
    return {
      temp_data: [], // 临时装数据
      chart_codes: [], // 过滤后的code值
      unique: '',
      header_list_none: [
        { prop: 'serialNumber', label: '序号', width: '100' },
        { prop: 'controlGroupName', label: '控制组名称', width: '100' }
      ]
    }
  },
  methods: {
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
      // if(   'controlChartCodes': data.controlChartCodes || undefined)
      if (data.controlChartCodes) {
        params.controlChartCodes = data.controlChartCodes
      }
      return params
    },
    async processCapabilityExcelQuery_preview(flag) {
      this.unique = '序号' // 指定唯一值
      if (flag === 'chartcode_dialog') {
        const { code, data } = await this.$api.processCapabilityExcelQuery(this.get_processCapabilityQueryParams(this.form))
        if (code === '200' && data) {
          if (data.length === 0) {
            this.$message.warning('没有符合条件的检验记录数据')
          } else {
            this.control_chart_code_filter_dialog = true
            // const chart_codes = data.map(item => item['控制图编号'])
            // this.chart_codes = [...new Set(chart_codes)]
            const chart_codes = data.map(item => {
              return {
                inspectionName: item['检测项目'],
                controlChartCode: item['控制图编号']
              }
            })
            console.log(chart_codes)
            this.chart_codes = this.uniqueObj(chart_codes, 'controlChartCode')

            this.temp_data = data
          }
        } else {
          this.$message.warning('没有符合条件的检验记录数据')
          this.t_data = []
          this.$refs.dy_table.refresh()
          this.export_disabled = true
        }
      } else {
        this.header_list = []
        this.$nextTick(() => {
          for (const key in this.temp_data[0]) {
            if (Object.hasOwnProperty.call(this.temp_data[0], key)) {
              const head = { prop: key, label: key }
              if (key === '控制组名称') {
                head.width = '180'
              }
              if (key === '检测项目') {
                head.width = '140'
              }
              this.header_list.push(head)
            }
          }
          this.t_data = this.temp_data.filter(item => flag.includes(item['控制图编号']))
          this.t_data = this.t_data.map((item, index) => {
            return {
              ...item,
              '序号': index + 1
            }
          })
          this.$refs.dy_table.refresh()
        })
        this.export_disabled = false
      }

      // const { code, data } = await this.$api.processCapabilityExcelQuery(this.get_processCapabilityQueryParams(this.form))
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
      // this.unique = '序号'
      // if (code === '200' && data) {
      //   if (data.length === 0) {
      //     this.header_list = this.header_list_none
      //     this.t_data = []
      //   } else {
      //     if (flag === 'chartcode_dialog') {
      //       this.control_chart_code_filter_dialog = true
      //       const chart_codes = data.map(item => item['控制图编号'])
      //       this.chart_codes = [...new Set(chart_codes)]
      //       return
      //     }
      //     this.header_list = []
      //     this.$nextTick(() => {
      //       for (const key in data[0]) {
      //         if (Object.hasOwnProperty.call(data[0], key)) {
      //           const head = { prop: key, label: key }
      //           if (key === '控制组名称') {
      //             head.width = '180'
      //           }
      //           if (key === '检测项目') {
      //             head.width = '140'
      //           }
      //           this.header_list.push(head)
      //         }
      //       }
      //       this.t_data = data
      //       this.$refs.dy_table.refresh()
      //     })
      //     this.export_disabled = false
      //   }
      //   // this.$refs.dy_table.refresh()
      // } else {
      //   this.$message.warning('没有符合条件的检验记录数据')
      //   this.t_data = []
      //   this.$refs.dy_table.refresh()
      //   this.export_disabled = true
      // }
    },
    async processCapabilityExcel_export() {
      const data = await this.$api.processCapabilityExcel(this.get_processCapabilityQueryParams(this.export_form))
      if (data) {
        download_Blob({ data, fileName: `工序能力报表${dateformat(new Date())}.xls` })
      }
    },
    get_abnormalPointExcelQueryParams(form_data) {
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

        'excelName': '',
        'controlGroupIds': data.controlGroupKeys,
        ...data.filteOptions_data,
        ...data.hierarchicalTypeKeys
      }
      if (data.controlChartCodes) {
        params.controlChartCodes = data.controlChartCodes
      }
      return params
    },
    async abnormalPointExcelQuery_preview(flag) {
      this.unique = 'serialNumber'
      if (flag === 'chartcode_dialog') {
        const { code, data } = await this.$api.abnormalPointExcelQuery(this.get_abnormalPointExcelQueryParams(this.form))
        if (code === '200' && data) {
          if (data.length === 0) {
            this.$message.warning('没有符合条件的检验记录数据')
          } else {
            this.control_chart_code_filter_dialog = true
            // const chart_codes = data.map(item => item['controlChartCode'])
            // this.chart_codes = [...new Set(chart_codes)]
            const chart_codes = data.map(item => {
              return {
                inspectionName: item['inspectionName'],
                controlChartCode: item['controlChartCode']
              }
            })

            this.chart_codes = this.uniqueObj(chart_codes, 'controlChartCode')
            this.temp_data = data
          }
        } else {
          this.$message.warning('没有符合条件的检验记录数据')
          this.t_data = []
          this.$refs.dy_table.refresh()
          this.export_disabled = true
        }
      } else {
        const filterHierarchicalTypes = this.hierarchicalTypes.filter(item => {
          const prop = `hierarchicalName${this.parseNum[item.serialNumber]}`
          return this.temp_data[0][prop] !== null
        })
        // console.log('filterHierarchicalTypes', filterHierarchicalTypes)
        const header_list = [
          { prop: 'serialNumber', label: '序号' },
          { prop: 'controlChartName', label: '控制组名称', minWidth: '180' },
          { prop: 'controlChartCode', label: '控制图编号', minWidth: '140' },
          { prop: 'inspectionName', label: '检测项目', minWidth: '180' },
          // ... this.hierarchicalTypes.map((item) => {
          //   return { prop: `hierarchicalTypeValue${this.parseNum[item.serialNumber]}`, label: item.hierarchicalName }
          // }),
          ...filterHierarchicalTypes.map((item) => {
            return { prop: `hierarchicalTypeValue${this.parseNum[item.serialNumber]}`, label: item.hierarchicalName }
          }),
          { prop: 'abnormalInformation', label: '失控信息', width: '240' },
          // { prop: 'exceptionLevel', label: '异常级别', width: '120', align: 'center' },
          { prop: 'abnormalReason', label: '失控原因' },
          { prop: 'handleProgramme', label: '处理方案' },
          { prop: 'handler', label: '处理人' },
          { prop: 'processingDate', label: '处理时间' },
          { prop: 'auditor', label: '审核人' },
          { prop: 'auditDate', label: '审核时间' }
        ]
        this.unique = 'serialNumber'
        this.header_list = []

        this.$nextTick(() => {
          this.header_list.push(...header_list)
          // this.t_data = this.temp_data.map((item, index) => {
          //   return {
          //     ...item,
          //     serialNumber: index + 1
          //   }
          // })
          this.t_data = this.temp_data.filter(item => flag.includes(item['controlChartCode']))
          this.t_data = this.t_data.map((item, index) => {
            return {
              ...item,
              serialNumber: index + 1
            }
          })
          this.$refs.dy_table.refresh()
        })
        this.export_disabled = false
      }
    },
    uniqueObj(arr, id) {
      const res = new Map()
      return arr.filter((a) => !res.has(a[id]) && res.set(a[id], 1))
    },
    // async abnormalPointExcelQuery_preview2(flag) {
    //   const { code, data } = await this.$api.abnormalPointExcelQuery(this.get_abnormalPointExcelQueryParams(this.form))
    //   // const { code, data } = {
    //   //   'data': [
    //   //     {
    //   //       'controlChartSonId': '1463040139432431616',
    //   //       'controlChartCode': '12345',
    //   //       'controlChartName': '深圳和美spc\\test',
    //   //       'inspectionName': '壁厚1（mm）',
    //   //       'hierarchicalNameOne': '产品型号',
    //   //       'hierarchicalNameTwo': '产品名称',
    //   //       'hierarchicalNameThree': '产线',
    //   //       'hierarchicalNameFour': '班次',
    //   //       'hierarchicalNameFive': '设备',
    //   //       'hierarchicalNameSix': '供应商',
    //   //       'hierarchicalNameSeven': '客户',
    //   //       'hierarchicalNameEight': '批次',
    //   //       'hierarchicalNameNine': '工商单号',
    //   //       'hierarchicalTypeValueOne': 'testAdd',
    //   //       'hierarchicalTypeValueTwo': '',
    //   //       'hierarchicalTypeValueThree': '',
    //   //       'hierarchicalTypeValueFour': '',
    //   //       'hierarchicalTypeValueFive': '',
    //   //       'hierarchicalTypeValueSix': '',
    //   //       'hierarchicalTypeValueSeven': '',
    //   //       'hierarchicalTypeValueEight': '',
    //   //       'hierarchicalTypeValueNine': '',
    //   //       'abnormalInformation': 'R0:超出规格限',
    //   //       'abnormalReason': null,
    //   //       'handleProgramme': '1',
    //   //       'processingDate': '2021-11-30 11:59:57'
    //   //     },
    //   //     {
    //   //       'controlChartSonId': '1463040139432431616',
    //   //       'controlChartCode': '12345',
    //   //       'controlChartName': '深圳和美spc\\test',
    //   //       'inspectionName': '壁厚1（mm）',
    //   //       'hierarchicalNameOne': '产品型号',
    //   //       'hierarchicalNameTwo': '产品名称',
    //   //       'hierarchicalNameThree': '产线',
    //   //       'hierarchicalNameFour': '班次',
    //   //       'hierarchicalNameFive': '设备',
    //   //       'hierarchicalNameSix': '供应商',
    //   //       'hierarchicalNameSeven': '客户',
    //   //       'hierarchicalNameEight': '批次',
    //   //       'hierarchicalNameNine': '工商单号',
    //   //       'hierarchicalTypeValueOne': 'testAdd',
    //   //       'hierarchicalTypeValueTwo': '',
    //   //       'hierarchicalTypeValueThree': '',
    //   //       'hierarchicalTypeValueFour': '',
    //   //       'hierarchicalTypeValueFive': '',
    //   //       'hierarchicalTypeValueSix': '',
    //   //       'hierarchicalTypeValueSeven': '',
    //   //       'hierarchicalTypeValueEight': '',
    //   //       'hierarchicalTypeValueNine': '',
    //   //       'abnormalInformation': 'R0:超出规格限',
    //   //       'abnormalReason': null,
    //   //       'handleProgramme': '1',
    //   //       'processingDate': '2021-11-30 11:59:57'
    //   //     }
    //   //   ],
    //   //   'code': '200',
    //   //   'msg': '操作成功'
    //   // }
    //   const header_list = [
    //     { prop: 'serialNumber', label: '序号' },
    //     { prop: 'controlChartName', label: '控制组名称', minWidth: '180' },
    //     { prop: 'controlChartCode', label: '控制组编号', minWidth: '140' },
    //     { prop: 'inspectionName', label: '检测项目', minWidth: '180' },
    //     ... this.hierarchicalTypes.map((item) => {
    //       return { prop: `hierarchicalTypeValue${this.parseNum[item.serialNumber]}`, label: item.hierarchicalName }
    //     }),
    //     { prop: 'abnormalInformation', label: '失控信息' },
    //     { prop: 'abnormalReason', label: '失控原因' }
    //   ]
    //   this.unique = 'serialNumber'
    //   this.header_list = []
    //   this.$nextTick(() => {
    //     this.header_list.push(...header_list)
    //     if (code === '200' && data) {
    //       this.export_disabled = false
    //       this.t_data = data.map((item, index) => {
    //         return {
    //           ...item,
    //           serialNumber: index + 1
    //         }
    //       })
    //       this.$refs.dy_table.refresh()
    //     } else {
    //       this.t_data = []
    //       this.$refs.dy_table.refresh()
    //       this.$message.warning('没有符合条件的检验记录数据')
    //       this.export_disabled = true
    //     }
    //   })
    // },
    async abnormalPointExcel_export() {
      const data = await this.$api.abnormalPointExcel(this.get_abnormalPointExcelQueryParams(this.export_form))
      if (data) {
        download_Blob({ data, fileName: `失控点报表${dateformat(new Date())}.xls` })
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

      if (data.controlChartCodes) {
        params.controlChartCodes = data.controlChartCodes
      }

      return params
    },
    async yieldRateReportExcelQuery_preview(flag) {
      this.unique = 'serialNumber'
      if (flag === 'chartcode_dialog') {
        const { code, data } = await this.$api.yieldRateReportExcelQuery(this.get_yieldRateReportExcelQueryParams(this.form))
        if (code === '200' && data) {
          if (data.length === 0) {
            this.$message.warning('没有符合条件的检验记录数据')
          } else {
            this.control_chart_code_filter_dialog = true
            // const chart_codes = data.map(item => item['controlChartCode'])

            const chart_codes = data.map(item => {
              return {
                inspectionName: item['inspectionName'],
                controlChartCode: item['controlChartCode']
              }
            })

            this.chart_codes = this.uniqueObj(chart_codes, 'controlChartCode')

            // this.chart_codes = [...new Set(chart_codes)]
            this.temp_data = data
          }
        } else {
          this.$message.warning('没有符合条件的检验记录数据')
          this.t_data = []
          this.$refs.dy_table.refresh()
          this.export_disabled = true
        }
      } else {
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
          { prop: 'controlChartCode', label: '控制图编号', minWidth: '140' },
          { prop: 'inspectionName', label: '检测项目', minWidth: '180' },
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
        // this.unique = 'serialNumber'
        this.header_list = []
        this.$nextTick(() => {
          // console.log('this.temp_data', this.temp_data)
          this.header_list.push(...header_list)
          this.t_data = this.temp_data.filter(item => flag.includes(item['controlChartCode']))
          this.t_data = this.t_data.map((item, index) => {
            return {
              ...item,
              serialNumber: index + 1
            }
          })
          this.$refs.dy_table.refresh()
        })
        this.export_disabled = false
      }
    },
    // async yieldRateReportExcelQuery_preview2(flag) {
    //   const { code, data } = await this.$api.yieldRateReportExcelQuery(this.get_yieldRateReportExcelQueryParams(this.form))
    //   // const { code, data } = {
    //   //   'data': [
    //   //     {
    //   //       'serialNumber': 1,
    //   //       'controlChartId': '1468899905694208000',
    //   //       'controlChartName': '/金软vcp打金厚度',
    //   //       'controlChartCode': '2112091639047689',
    //   //       'value1': null,
    //   //       'badDefinitionValue': null,
    //   //       'badName': null,
    //   //       'inspectionNum': 20,
    //   //       'goodNum': 18,
    //   //       'yieldRate': '90%',
    //   //       'badNameOne': 'A1不良项目',
    //   //       'badNumOne': '1',
    //   //       'badPercentageOne': '50%',
    //   //       'badNameTwo': 'B1不良项目',
    //   //       'badNumTwo': '1',
    //   //       'badPercentageTwo': '50%',
    //   //       'badNameThree': null,
    //   //       'badNumThree': null,
    //   //       'badPercentageThree': null,
    //   //       'hierarchicalNameOne': '产品型号',
    //   //       'hierarchicalNameTwo': '产品名称',
    //   //       'hierarchicalNameThree': '产线',
    //   //       'hierarchicalNameFour': '班次',
    //   //       'hierarchicalNameFive': '设备',
    //   //       'hierarchicalNameSix': '供应商',
    //   //       'hierarchicalNameSeven': '客户',
    //   //       'hierarchicalNameEight': '批次',
    //   //       'hierarchicalNameNine': '工商单号',
    //   //       'hierarchicalTypeValueOne': 'test',
    //   //       'hierarchicalTypeValueTwo': '',
    //   //       'hierarchicalTypeValueThree': '',
    //   //       'hierarchicalTypeValueFour': '',
    //   //       'hierarchicalTypeValueFive': '',
    //   //       'hierarchicalTypeValueSix': '',
    //   //       'hierarchicalTypeValueSeven': '',
    //   //       'hierarchicalTypeValueEight': '',
    //   //       'hierarchicalTypeValueNine': ''
    //   //     }
    //   //   ],
    //   //   'code': '200',
    //   //   'msg': '操作成功'
    //   // }

    //   const badNumTop = []
    //   for (let i = 1; i <= 3; i++) {
    //     const badName = { prop: `badName${this.parseNum[i]}`, label: `代码${i}` }
    //     const badNum = { prop: `badNum${this.parseNum[i]}`, label: `数量${i}` }
    //     const badPercentage = { prop: `badPercentage${this.parseNum[i]}`, label: `百分比${i}` }
    //     badNumTop.push(...[badName, badNum, badPercentage])
    //   }
    //   const header_list = [
    //     { prop: 'serialNumber', label: '序号' },
    //     { prop: 'controlChartName', label: '控制组名称', minWidth: '180' },
    //     { prop: 'controlChartCode', label: '控制组编号', minWidth: '140' },
    //     ... this.hierarchicalTypes.map((item) => {
    //       return { prop: `hierarchicalTypeValue${this.parseNum[item.serialNumber]}`, label: item.hierarchicalName }
    //     }),
    //     { prop: 'inspectionNum', label: '抽检数' },
    //     { prop: 'goodNum', label: '良品' },
    //     { prop: 'yieldRate', label: '良品率' },
    //     { prop: 'badNumTop', label: '缺陷数前三项', align: 'center', children: [
    //       ...badNumTop
    //     ] }
    //   ]
    //   this.unique = 'serialNumber'
    //   this.header_list = []
    //   this.$nextTick(() => {
    //     this.header_list.push(...header_list)
    //     if (code === '200' && data) {
    //       this.export_disabled = false
    //       this.t_data = data.map((item, index) => {
    //         return {
    //           ...item,
    //           serialNumber: index + 1
    //         }
    //       })
    //       this.$refs.dy_table.refresh()
    //     } else {
    //       this.t_data = []
    //       this.$refs.dy_table.refresh()
    //       this.$message.warning('没有符合条件的检验记录数据')
    //       this.export_disabled = true
    //     }
    //   })
    // },
    async yieldRateReportExcel_export() {
      const data = await this.$api.yieldRateReportExcel(this.get_yieldRateReportExcelQueryParams(this.export_form))
      if (data) {
        download_Blob({ data, fileName: `良品率报表${dateformat(new Date())}.xls` })
      }
    }
  }
}
