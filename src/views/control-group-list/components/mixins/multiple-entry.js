import { dateformat } from '@/utils/date-method'
import _ from 'loadsh'
export default {
  data() {
    return {
      options: {
        hierarchicalType1: [],
        hierarchicalType2: [],
        hierarchicalType3: [],
        hierarchicalType4: [],
        hierarchicalType5: [],
        hierarchicalType6: [],
        hierarchicalType7: [],
        hierarchicalType8: [],
        hierarchicalType9: []
      },
      keywordProps: {
        label: 'keywordName',
        value: 'keywordName'
      },
      h_type: {
        'hierarchicalTypeValueEight': '',
        'hierarchicalTypeValueFive': '',
        'hierarchicalTypeValueFour': '',
        'hierarchicalTypeValueNine': '',
        'hierarchicalTypeValueOne': '',
        'hierarchicalTypeValueSeven': '',
        'hierarchicalTypeValueSix': '',
        'hierarchicalTypeValueThree': '',
        'hierarchicalTypeValueTwo': ''
      },
      hTypeArr: [],
      timeArr: []
    }
  },
  computed: {
    commonPoint() {
      const pointHierarchicalTypeIdsArr = this.deep_selectRow.map(row => row.pointHierarchicalTypeIds)
      const id = _.intersection(...pointHierarchicalTypeIdsArr)
      const d = _.filter(this.hierarchicalTypes, function(o) { return id.includes(o.id) })
      //   console.log(d)
      return d
    }
  },
  watch: {
    input_row_number: {
      // immediate: true,
      handler(val, oldVal) {
        if (val === 0) {
          this.deep_selectRow = []
          return
        }
        this.deep_selectRow.forEach(row => {
          if (!Object.hasOwnProperty.call(row, 'inspectData')) {
            row['inspectData'] = []
          }
          for (let i = 0; i < val; i++) {
            if (i > row['inspectData'].length - 1) {
              const inspectDataItem = {}
              for (let j = 0; j < row.sampleSize; j++) {
                inspectDataItem[`value${j + 1}`] = undefined
              }
              row['inspectData'].push(inspectDataItem)
            }
          }
        })

        for (let i = 1; i <= val; i++) {
          if (i > this.hTypeArr.length) {
            const temp = _.cloneDeep(this.h_type)
            this.hTypeArr.push(temp)
            const timeTemp = {
              'createDate': dateformat(new Date()),
              'inspectionDate': dateformat(new Date())
            }
            this.timeArr.push(timeTemp)
          }
        }
      }
    }
  },
  methods: {
    async getHierarchicalType(id) {
      const { code, data } = await this.$api.keywordValue_list({
        page: '1',
        limit: '20',
        hierarchicalTypeId: id,
        order: 'asc'
      })
      if (code === '200' && data) {
        this.options[`hierarchicalType${id}`] = data.list
      }
    },
    getAllPoint(ids) {
      const d = _.filter(this.hierarchicalTypes, function(o) { return ids.includes(o.id) })
      return d
    },
    value_change(dataIndex, val) {
      let has_emptyValue = false
      for (let index = 0; index < this.deep_selectRow.length; index++) {
        const row = this.deep_selectRow[index]
        const sampleSize = row['sampleSize']
        const inspectData = row['inspectData']
        for (let i = 0; i < sampleSize; i++) {
          const key = `value${i + 1}`
          if (inspectData[dataIndex][key] === undefined) {
            has_emptyValue = true
            break
          }
        }
        if (has_emptyValue) {
          break
        }
      }
      if (!has_emptyValue) {
        if (dataIndex + 1 === this.input_row_number) {
          this.input_row_number++
        }
      }
    },
    get_pointHierarchicalTypeIds(str) {
      const tempArr = str.split(',')
      const pointHierarchicalTypeIds = tempArr.map(item => {
        return item.split('=')[1]
      })
      return pointHierarchicalTypeIds
    },
    getChartTypeNum(chartType) {
      return this.commonVariable['parseChartType'][chartType]
    },
    getSaveParams() {
      const o = []
      let has_emptyValue = false
      for (let i = 0; i < this.deep_selectRow.length; i++) {
        const row = this.deep_selectRow[i]
        const { id, pointHierarchicalTypeIds, controlChartType, inspectData } = row
        const h_type = _.cloneDeep(this.h_type)
        if (Array.isArray(pointHierarchicalTypeIds)) {
          pointHierarchicalTypeIds.forEach(id => {
            const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
            if (hierarchicalItem) {
              const k = `hierarchicalTypeValue${this.commonVariable['parseNum'][hierarchicalItem.serialNumber]}`
              h_type[k] = `${hierarchicalItem.id}=${row[k]}`
            }
          })
        }
        const newInspectData = inspectData.map((data, index) => {
          const final_type = _.cloneDeep(this.h_type)
          for (const key in final_type) {
            const key_f = `${key}_f`
            if (Object.hasOwnProperty.call(this.hTypeArr[index], key_f)) {
              final_type[key] = this.hTypeArr[index][key_f]
            }
          }
          const temp = {
            ...data,
            ...this.h_type, // 原本的
            ...final_type,
            ...this.timeArr[index],
            'createUser': this.userId
            // controlChartSonId: id
          }
          return temp
        })
        console.log('newInspectData', newInspectData)
        newInspectData.pop()

        for (let i = 0; i < newInspectData.length; i++) {
          const element = newInspectData[i]
          for (const key in element) {
            if (Object.hasOwnProperty.call(element, key)) {
              if (key.indexOf('value') > -1) {
                if (!element[key] && element[key] !== 0) {
                  has_emptyValue = true
                  break
                }
              }
              if (!element['createDate'] || !element.inspectionDate) {
                has_emptyValue = true
                break
              }
            }
          }
          if (has_emptyValue) break
        }

        if (has_emptyValue) break
        const p = {
          controlChartSonId: id,
          controlChartType: this.getChartTypeNum(controlChartType),
          'inspectionRecordList': [
            ...newInspectData
          ]
        }
        o.push(p)
      }
      if (has_emptyValue) {
        this.$message.warning('除最后一组所有的样本值和时间都是必填的')
        console.log(o)
        return false
      }
      return o
    },
    hierarchicalTypeValueChange(index, key, id, value) {
      this.hTypeArr[index][`${key}_f`] = `${id}=${value || ''}`
    }
  }
}
