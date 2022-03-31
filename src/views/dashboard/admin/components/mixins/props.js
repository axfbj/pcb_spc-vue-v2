export default {
  props: {
    dashboardData: {
      type: Object,
      default: () => ({
        sevenDayArr: [],
        sevenDayAbnormalNum: [],
        sevenDayInspectionNum: [],
        records: {
          list: []
        }
      })
    }
  }
}
