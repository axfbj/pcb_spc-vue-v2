import { dateformat } from '@/utils/date-method'
import controlLimitStatusInfo from '../components/chart/components/controlLimitStatusInfo.vue'

export default {
  components: {
    controlLimitStatusInfo
  },
  data() {
    return {
      chartOption: {},
      charts: [],
      inspectionRecordPointsArr: []
    }
  },
  props: {
    digit: {
      type: Number,
      default: 0
    },
    axisXFlag: {
      type: Number,
      default: 0
    },
    dateFormatFlag: {
      type: String,
      default: 'YYYY/MM/DD HH:mm:ss'
    },
    toogleSetting: {
      type: Boolean,
      default: false
    },
    inspectionRecordsData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    processedData() {
      const { inspectionRecords } = this.inspectionRecordsData
      const processedData = []
      if (inspectionRecords && inspectionRecords.length > 0) {
        processedData.push(...inspectionRecords.filter(item => item.inspectionStatus === 3))
      }
      return processedData
    },
    newAxisX2() {
      return []
    },
    newAxisX() {
      const inspectionRecords = this.inspectionRecordPointsArr
      function generateArray(start, end) {
        return Array.from(new Array(end + 1).keys()).slice(start)
      }
      let axisX = []
      if (this.axisXFlag === 0) {
        axisX = generateArray(0, inspectionRecords.length - 1)
      }
      if (this.axisXFlag === 1) {
        axisX = inspectionRecords.map(item => item.date || '')
        axisX = axisX.map(item => dateformat(new Date(item), this.dateFormatFlag))
      }
      if (this.axisXFlag === 2) {
        axisX = inspectionRecords.map(item => item.date || '')
        axisX = axisX.map(item => dateformat(new Date(item), this.dateFormatFlag))
      }
      return axisX
    }
  },
  watch: {
    toogleSetting() {
      const grid = {
        left: 70,
        top: 38,
        right: 120,
        bottom: 20
      }
      const xAxis = {
        data: this.newAxisX,
        axisLabel: {
          // interval: 0,
          rotate: 0
        }
      }
      if (Array.isArray(this.charts) && this.charts.length > 0) {
        if (this.axisXFlag !== 0) {
          // 旋转10度 下方空隙改为30
          xAxis.axisLabel.rotate = 10
          grid.bottom = 20
          if (this.dateFormatFlag === 'YYYY/MM/DD HH:mm:ss') {
            grid.bottom = 30
          }
        }
        xAxis.data = this.newAxisX
        this.charts.forEach(chart => {
          chart.setOption({
            grid,
            xAxis
          })
        })
      }
    }
  },
  methods: {
    addChartOptionInitSytle() {
      this.chartOption.tooltip.confine = true
      // this.chartOption.xAxis.boundaryGap = ['10%', '10%']
      // this.chartOption.xAxis.boundaryGap = false
      this.chartOption.xAxis.axisLabel = {
        // interval: 0,
        rotate: 0,
        fontSize: '10'
      }
      this.chartOption.grid = {
        left: 70,
        top: 38,
        right: 120,
        bottom: 20
      }
      if (this.axisXFlag !== 0) {
        this.chartOption.xAxis.axisLabel.rotate = 10
        this.chartOption.grid.bottom = 20
        if (this.dateFormatFlag === 'YYYY/MM/DD HH:mm:ss') {
          this.chartOption.grid.bottom = 30
        }
      } else {
        this.chartOption.xAxis.axisLabel.rotate = 0
        this.chartOption.grid.bottom = 20
      }
    },
    click_point(charts) {
      charts.forEach(chart => {
        chart.on('click', (res) => {
          if (['异常点', '处理点', 'exceptionPoint'].includes(res.name)) {
            const inspectionRecordId = res.data.inspectionRecordId
            const { controlGroupId, controlChartSonId } = this.$route.query
            this.$router.push({ name: 'ExceptionHandling', query: { controlGroupId, controlChartSonId, inspectionRecordId }})
          }
        })
      })
    },
    setMinAndMax(_min, _max) {
      // const p = (parseFloat(_max) - parseFloat(_min)) * 0.2
      // const min = parseFloat(_min) - p
      // const max = parseFloat(_max) + p
      // return [min, max]
      return [parseFloat(_min), parseFloat(_max)]
    },
    setMax(max) {
      return max
    },
    setMin(min) {
      return min
    }
  }
}
