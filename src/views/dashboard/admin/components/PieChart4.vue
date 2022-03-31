<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
// import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '440px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.chart = this.$echarts.init(this.$el, 'macarons')
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(data) {
      const d = [data['待处理'], data['待审核'], data['已处理']]
      const option = {
        color: ['#F56C6C', '#E6A23C', '#67C23A'],
        title: {
          top: 20,
          left: 20,
          text: '处理情况'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'

        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['未处理', '待审核', '已处理']
        },
        series: [
          {
            name: '异常率',
            type: 'pie',
            label: {
              fontSize: 10,
              formatter: `{b} : {d}%`
            },
            labelLine: {
              lineStyle: {
                color: 'red'
              },
              smooth: 0.2,
              length: 5,
              length2: 5
            },
            // roseType: 'radius',
            radius: [15, 90],
            // radius: ['50%', '39%'],
            center: ['50%', 240],
            data: [

              { value: d[0], name: '未处理' },
              { value: d[1], name: '待审核' },
              { value: d[2], name: '已处理' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 1000
          }
        ]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
