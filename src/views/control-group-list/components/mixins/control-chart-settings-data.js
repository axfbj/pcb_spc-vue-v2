export default {
  props: {
    controlGroupId: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      controlChartType: 'XBar-R',
      options: [{
        value: 'XBar-R',
        label: 'XBar-R'
      }, {
        value: 'XBar-S',
        label: 'XBar-S'
      }, {
        value: 'X-MR',
        label: 'X-MR'
      }, {
        value: 'P',
        label: 'P'
      }, {
        value: 'nP',
        label: 'np'
      }],
      precisionOptiosn: [{
        value: '1',
        label: '1'
      }, {
        value: '2',
        label: '2'
      }, {
        value: '3',
        label: '3'
      }, {
        value: '4',
        label: '4'
      }, {
        value: '5',
        label: '5'
      },
      {
        value: '6',
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
        'digit': '',
        // 'discriminationRulesId': '',
        'discriminationRules': '',
        'discriminationRulesStr': '',
        'g1cl': '',
        'g1lcl': '',
        'g1ucl': '',
        'g2cl': '',
        'g2lcl': '',
        'g2ucl': '',
        'id': '',
        'inspectionItemsId': '',
        'lsl': '',
        'pointHierarchicalType': '',
        'pointHierarchicalTypeStr': '',
        'sampleSize': '',
        'sl': '',
        'status': '',
        'updateDate': '',
        'updateUserId': '',
        'usl': ''
      }
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.controlChartType = 'XBar-R'
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.t_data = []
      this.select_row = {}
      this.inspection_items_select = { }
      this.disabledSelectArr = []
      this.$refs.dy_table.refresh()
    },
    save_chart_data() {
      const t_data = JSON.parse(JSON.stringify(this.t_data))
      // console.log('this.t_data', this.t_data)
      const params = {
        controlChartName: this.treePath,
        controlChartType: this.controlChartType,
        controlGroupId: this.controlGroupId,
        controlChartSonEntityS: [
          ...t_data.map(item => {
            delete item.chartHierarchicalType
            delete item.pointHierarchicalType
            delete item.discriminationRules
            return item
          })
          // {
          //   // 'chartHierarchicalType': 0,
          //   chartHierarchicalTypeStr: this.form.chartHierarchicalTypeStr,
          //   'controlChartCode': '',
          //   'controlChartId': 0,
          //   'customTitle': '',
          //   'description': '',
          //   'digit': 0,
          //   'discriminationRulesId': 0,
          //   'discriminationRulesStr': '1=1=test',
          //   'g1cl': 0,
          //   'g1lcl': 0,
          //   'g1ucl': 0,
          //   'g2cl': 0,
          //   'g2lcl': 0,
          //   'g2ucl': 0,
          //   'id': 0,
          //   'inspectionItemsId': '',
          //   'lsl': 0,
          //   'pointHierarchicalType': 0,
          //   'pointHierarchicalTypeStr': '',
          //   'sampleSize': 0,
          //   'sl': 0,
          //   'status': 0,
          //   'updateDate': '',
          //   'updateUserId': 0,
          //   'usl': 0
          // }
        ]
      }
      return params
      // console.log(params)
    //   this.$api.controlChartSon_save()
    },
    async get_ControlChartCode() {
      const { code, data } = this.$api.controlChartSon_generateCode()
      if (code === '200' && data) {
        console.log(data)
      }
    }

  }
}

