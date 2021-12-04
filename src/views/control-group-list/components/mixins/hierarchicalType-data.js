export default {
  data() {
    return {

      form: {
        date: ['2021-01-01 00:00:00', '2021-12-01 00:00:00'],
        state: '',
        controlChartCode: '',
        controlChartType: '',
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
        states: [],
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
