import { dateformat, getMothStartAndEnd } from '@/utils/date-method'

export default {
  data() {
    return {
      currentMonth: true
    }
  },
  async mounted() {
    this.chart = this.$echarts.init(this.$refs.chart, 'macarons')
    const month = getMothStartAndEnd()[0]
    this.setChart(month)
  },
  methods: {
    month_change(select_month) {
      if (!select_month) return
      const month = dateformat(select_month)
      this.setChart(month)
    }
  }
}
