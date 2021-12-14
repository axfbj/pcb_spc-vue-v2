import { getMothStartAndEnd } from '@/utils/date-method'
export default {
  data() {
    return {

      form: {
        date: getMothStartAndEnd(),
        state: '',
        controlChartCode: '',
        controlChartType: '',
        controlChartStatus: '',
        inspectionItemsId: '',
        hierarchicalTypeValueOne: '',
        hierarchicalTypeValueTwo: '',
        hierarchicalTypeValueThree: '',
        hierarchicalTypeValueFour: '',
        hierarchicalTypeValueFive: '',
        hierarchicalTypeValueSix: '',
        hierarchicalTypeValueSeven: '',
        hierarchicalTypeValueEight: '',
        hierarchicalTypeValueNine: ''
      },
      inspectionNamesProps: {
        value: 'id',
        label: 'inspectionName'
      },
      chartTypesProps: {
        value: 'controlChartType',
        label: 'controlChartType'
      },
      hierarchicalTypeProps: {
        value: 'hierarchicalTypeValue',
        label: 'hierarchicalTypeValue'
      },
      options: {
        states: [
          {
            value: 1,
            label: '未失控'
          },
          {
            value: 2,
            label: '有失控'
          },
          {
            value: 3,
            label: '有处理'
          }
        ],
        inspectionNames: [],
        chartTypes: [],
        hierarchicalType1: [],
        hierarchicalType2: [],
        hierarchicalType3: [],
        hierarchicalType4: [],
        hierarchicalType5: [],
        hierarchicalType6: [],
        hierarchicalType7: [],
        hierarchicalType8: [],
        hierarchicalType9: []
      }
    }
  },
  methods: {
    async getInspectionNames() {
      const controlGroupId = this.current_tree_node_key
      const { code, data } = await this.$api.controlChart_inspectionItems({ controlGroupId })
      if (code === '200' && data) {
        this.options.inspectionNames = data
      }
    },
    async getChartTypes() {
      const controlGroupId = this.current_tree_node_key
      const { code, data } = await this.$api.controlChart_chartType({ controlGroupId })
      if (code === '200' && data) {
        this.options.chartTypes = data
      }
    },
    async getHierarchicalType(num) {
      const controlGroupId = this.current_tree_node_key
      const { code, data } = await this.$api.controlChart_hierarchicalType({ controlGroupId, serialNumber: num })
      if (code === '200' && data) {
        this.options[`hierarchicalType${num}`] = data
      }
    }
  }
}
