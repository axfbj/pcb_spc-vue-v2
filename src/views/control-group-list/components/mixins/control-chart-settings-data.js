// import { deepClone } from '@/utils'
import _ from 'loadsh'
import { mapGetters } from 'vuex'
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
      precisionOptiosn: [
        {
          value: 0,
          label: '0'
        },
        {
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
        }
      ],
      form: {},
      form_data: {
        warningUserGroupId: '', // 预警组id
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
  computed: {
    ...mapGetters(['hierarchicalTypes', 'userId', 'commonVariable', 'username']),
    count_graph() {
      return this.commonVariable.count_graph
    },
    parseChartType() {
      return this.commonVariable['parseChartType']
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    async calc_value(loading) {
      if (this.select_row && Object.hasOwnProperty.call(this.select_row, 'id')) {
        const { id, controlChartType } = this.select_row
        loading(true)
        const { code, data } = await this.$api.controlChartSon_regulatoryCalculation({
          controlChartSonId: id,
          controlChartType: this.parseChartType[controlChartType]
        })
        loading(false)
        if (code === '200' && data) {
          console.log('data', data)
          for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
              const element = data[key]
              if (typeof element === 'number') {
                this.form[key] = element
              }
            }
          }
          // this.form =
        }
        return
      }
      this.$message.warning('数据量不够')
    },
    clean(c) {
      if (c !== 'change') {
        this.controlChartType = 'Xbar-R'
      }

      this.updateKeys = [] // 修改的控制图key
      this.abnormalEmailRecipient_select = [] // 邮件告警人弹框
      this.userGroup_select = {} // 用户组弹框
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.t_data = []
      this.select_row = {}
      this.inspection_items_select = { }
      this.disabledSelectArr = []
      this.isSameResult = [] // 批量修改某key 值都一样，高亮input框
      this.$refs.dy_table.refresh()

      this.has_del = false
    },
    save_chart_data() {
      const t_data = _.cloneDeep(this.t_data)
      const controlChartSonEntityS = t_data.map(row => {
        const item = _.cloneDeep(row)
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            item[key] = item[key] === undefined ? '' : item[key]
          }
        }
        // item.discriminationRulesStr = item.discriminationRules
        delete item.chartHierarchicalType
        delete item.pointHierarchicalType
        delete item.discriminationRules
        delete item.pointHierarchicalTypeIds
        // item.user
        // console.log('item', item)
        return item
      })
      controlChartSonEntityS.forEach(item => {
        delete item.chartHierarchicalType
        delete item.pointHierarchicalType
        delete item.discriminationRules
        delete item.pointHierarchicalTypeIds
      })
      const params = {
        controlChartName: this.treePath.path || '',
        controlChartType: this.controlChartType,
        controlGroupId: this.controlGroupId,
        controlChartSonEntityS
      }
      return params
    }
  }
}

