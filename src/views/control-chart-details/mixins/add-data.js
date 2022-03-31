import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      footer_loading: false
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'commonVariable'
    ]),
    chartTypeNum() {
      return this.commonVariable['parseChartType'][this.controlChartType] || ''
    },
    count_graph() {
      return this.commonVariable.count_graph
    },
    default_dataPoint_value() {
      const { pointHierarchicalTypeIds, pointHierarchicalTypeTitles, pointHierarchicalTypeValues } = this.inspectionRecords_data
      const r = []
      if (Array.isArray(pointHierarchicalTypeIds)) {
        pointHierarchicalTypeIds.forEach((id, index) => {
          const o = {
            id,
            title: pointHierarchicalTypeTitles[index] || '',
            value: pointHierarchicalTypeValues[index] || ''
          }
          r.push(o)
        })
      }
      return r
    }
  },
  methods: {
    add_data(e, row) {
      e.target.blur()
      this.$nextTick(() => {
        if (row.id === '') {
          this.add({ row })
        } else {
          this.update({ row })
        }
      })
    },
    async add({ row }) {
      const param = this.getSaveParams(row)
      const { code, data } = await this.$api.inspectionRecord_save(param)
      if (code === '200' && data) {
        await this.set_data('reset')
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.dy_table.position_last()
            const vInput = document.querySelectorAll('.v-input')
            for (let i = 0; i < vInput.length; i++) {
              const element = vInput[i]
              const ipt = element.querySelector('input')
              if (!ipt.value || ipt.value === '0') {
                ipt.focus()
                break
              }
            }
          }, 10)
        })
      }
    },
    async update({ row }) {
      const param = this.getSaveParams(row)
      const { code, data } = await this.$api.inspectionRecord_update(param)
      if (code === '200' && data) {
        await this.set_data('reset')
      }
    },
    getSaveParams(row) {
      const form = {}
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
      for (const key in row) {
        if (Object.hasOwnProperty.call(row, key)) {
          form[key] = row[key] !== null ? row[key] : ''
        }
      }

      // 删除多余的字段
      const deleteKeys = ['average', 'max', 'min', 'range', 'sd', 'inspectionStatus', 'inspectionSerial']
      //   if (!row.id) {
      //     deleteKeys.push('id')
      //   }
      deleteKeys.forEach(key => {
        delete form[key]
      })

      if (this.count_graph.includes(this.controlChartType)) {
        form.objectList = []
        const badNames_data = []
        this.badNames.badDefinitionTitles.forEach((item, index) => {
          const o = {}
          o.id = this.badNames.badDefinitionIds[index]
          o.badName = item
          badNames_data.push(o)
        })

        badNames_data.forEach((item, index) => {
          form.objectList[index] = {
            id: item.id,
            value: form[`badValue${index + 1}`]
          }
        })
      } else {
        delete form.objectList
      }

      this.pointHierarchicalTypeIds.forEach(id => {
        const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
        if (hierarchicalItem) {
          const k = `hierarchicalTypeValue${this.commonVariable['parseNum'][hierarchicalItem.serialNumber]}`
          h_type[k] = `${hierarchicalItem.id}=${form[k]}`
        }
      })

      form.createUser = this.userId
      const p = {
        controlChartSonId: this.controlChartSonId,
        controlChartType: this.chartTypeNum,
        'inspectionRecordList': [
          {
            controlChartSonId: this.controlChartSonId,
            'createUser': this.userId,
            'hierarchicalTypeValueEight': '',
            'hierarchicalTypeValueFive': '',
            'hierarchicalTypeValueFour': '',
            'hierarchicalTypeValueNine': '',
            'hierarchicalTypeValueOne': '',
            'hierarchicalTypeValueSeven': '',
            'hierarchicalTypeValueSix': '',
            'hierarchicalTypeValueThree': '',
            'hierarchicalTypeValueTwo': '',
            ...form,
            ...h_type
          }
        ]
      }
      return p
    }
  }
}
