import { deepClone } from '@/utils'
export default {
  props: {
    controlGroupId: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      controlChartType: 'Xbar-R',
      options: [{
        value: 'Xbar-R',
        label: 'Xbar-R'
      }, {
        value: 'Xbar-s',
        label: 'Xbar-s'
      }, {
        value: 'X-MR',
        label: 'X-MR'
      }, {
        value: 'p',
        label: 'p'
      }, {
        value: 'np',
        label: 'np'
      }],
      precisionOptiosn: [{
        value: 1,
        label: '1'
      }, {
        value: 2,
        label: '2'
      }, {
        value: 3,
        label: '3'
      }, {
        value: 4,
        label: '4'
      }, {
        value: 5,
        label: '5'
      },
      {
        value: 6,
        label: '6'
      }],
      form: {},
      form_data: {
        'chartHierarchicalType': '',
        'chartHierarchicalTypeStr': '',
        'controlChartCode': '',
        'controlChartId': 0, // 添加时为 0
        'customTitle': '',
        'description': '',
        'digit': 3,
        // 'discriminationRulesId': '',
        'discriminationRules': '',
        'discriminationRulesStr': '',
        'g1cl': undefined,
        'g1lcl': undefined,
        'g1ucl': undefined,
        'g2cl': undefined,
        'g2lcl': undefined,
        'g2ucl': undefined,
        'id': '',
        'inspectionItemsId': '',
        'lsl': undefined,
        'pointHierarchicalType': '',
        'pointHierarchicalTypeStr': '',
        'sampleSize': undefined,
        'sl': undefined,
        'status': '',
        'updateDate': '',
        'updateUserId': '',
        'usl': undefined
      }
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear(c) {
      if (c !== 'change') {
        this.controlChartType = 'Xbar-R'
      }
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.t_data = []
      this.select_row = {}
      this.inspection_items_select = { }
      this.disabledSelectArr = []
      this.$refs.dy_table.refresh()

      this.has_del = false
    },
    save_chart_data() {
      const t_data = deepClone(this.t_data)
      const params = {
        controlChartName: this.treePath,
        controlChartType: this.controlChartType,
        controlGroupId: this.controlGroupId,
        controlChartSonEntityS: [
          ...t_data.map(item => {
            delete item.chartHierarchicalType
            delete item.pointHierarchicalType
            delete item.discriminationRules
            for (const key in item) {
              if (Object.hasOwnProperty.call(item, key)) {
                item[key] = item[key] === undefined ? '' : item[key]
              }
            }
            return item
          })
        ]
      }
      return params
    }
  }
}

