export default {
  props: {
    controlGroupId: {
      type: [String, Number],
      default: 0
    }

  },
  data() {
    return {
      controlChartType: '',
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
      value2: '',
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
        'chartHierarchicalType': 0,
        'chartHierarchicalTypeStr': '',
        'controlChartCode': '',
        'controlChartId': 0,
        'customTitle': '',
        'description': '',
        'digit': 0,
        'discriminationRulesId': 0,
        'discriminationRulesStr': '',
        'g1cl': 0,
        'g1lcl': 0,
        'g1ucl': 0,
        'g2cl': 0,
        'g2lcl': 0,
        'g2ucl': 0,
        'id': 0,
        'inspectionItemsId': '',
        'lsl': 0,
        'pointHierarchicalType': 0,
        'pointHierarchicalTypeStr': '',
        'sampleSize': 0,
        'sl': 0,
        'status': 0,
        'updateDate': '',
        'updateUserId': 0,
        'usl': 0
      }
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    save_chart() {
      const params = {
        controlChartName: this.treePath,
        controlChartType: this.form.controlChartType,
        controlGroupId: this.controlGroupId,
        controlChartSonEntityS: [
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
      console.log(params)
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

