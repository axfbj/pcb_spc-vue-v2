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
      const d = [data['OOS异常率'], data['OOC异常率']]

      const option = {
        color: ['#fac858', '#DC143C'],
        title: {
          top: 20,
          left: 20,
          text: '异常率'
        },
        tooltip: {
          trigger: 'item',
          // formatter: '{a} <br/>{b} : {c} ({d}%)'
          formatter: '{b} : ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['OOS异常率', 'OOC异常率']
        },
        series: [
          {
            // center: ['50%', '50%'],
            name: '异常率',
            label: {
              fontSize: 10,
              formatter: `{b}: {d}%`
            },
            labelLine: {
              lineStyle: {
                color: 'red'
              },
              smooth: 0.2,
              length: 5,
              length2: 5
            },
            type: 'pie',
            // roseType: 'radius',
            radius: [15, 90],
            center: ['50%', 240],
            data: [
              { value: parseFloat(d[0].substring(0, d[0].length - 1)), name: 'OOS异常率' },
              { value: parseFloat(d[1].substring(0, d[1].length - 1)), name: 'OOC异常率' }
              // { value: 149, name: '已处理' }
              // { value: 100, name: 'Gold' },
              // { value: 59, name: 'Forecasts' }
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
