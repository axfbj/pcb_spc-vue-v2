
<template>
  <!-- <div ref="chart" style="width:100%;height:100%"> -->
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <!-- <div ref="chart1" style="width:100%;height:calc(100% - 20px)" /> -->
      <div id="createChartImg" ref="createChartImg" style="height: calc(100% - 20px);">
        <div style="text-align: center; line-height: 24px;">
          <span style="font-size: 14px; color: #0c6dcd;font-weight: 500;">{{ inspectionRecordsData.customTitle || '' }} ({{ inspectionRecordsData.inspectionName || '' }})</span>
          <control-limit-status-info :control-limit-status="$route.query.controlLimitStatus" />
        </div>
        <div ref="createChartImg" style="height: calc(100% - 24px);">
          <!-- <div ref="chart" style="width:100%;height:50%" /> -->
          <div ref="chart1" style="width:100%;height:100%" />
        </div>
      </div>
      <div style="text-align:center;font-size: 14px;">
        均值:<span style="margin-right:20px">{{ label93 }}</span>
        LCL:<span style="margin-right:20px">{{ label97 }}</span>
        UCL:<span style="margin-right:20px">{{ label99 }}</span>
        <span><strong>P图</strong></span>
      </div>
    </el-col>
  </el-row>
  <!-- </div> -->
</template>
<script>
// const echarts = require('echarts/lib/echarts') // 引入柱状图组件
// Rb：<span style="margin-right:20px">{{ vab }}</span>

import chart_mixins from '../../mixins/chart-mixins'
import _ from 'loadsh'
export default {
  mixins: [chart_mixins],
  data() {
    return {
      // vab: '',
      axisX: [],
      target: '',
      vpb: '',
      Series3: [],
      label93: '',
      label93s: 0,
      label97: '',
      label97s: 0,
      label99: '',
      label99s: 0,
      min: '',
      max: '',
      abnormalPointsArr: []
    }
  },
  mounted() {
  },
  methods: {
    get_createChartImgDom() {
      return this.$refs.createChartImg
    },
    add_show(res) {
      res.Series9.forEach(item => {
        const y = parseFloat(item.y * 100)
        // this.abnormalPointsArr.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: item.x, yAxis: y })
        const isProcessed = this.processedData.some(processedItem => processedItem.id === item.inspectionRecordId)
        const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: '异常点', coord: [parseInt(item.x), y], inspectionRecordId: item.inspectionRecordId }
        if (isProcessed) {
          abnormalPinit.name = '处理点'
          abnormalPinit.itemStyle.color = '#9932CC'
        }
        this.abnormalPointsArr.push(abnormalPinit)
      })
      this.pMychart = this.$echarts.init(this.$refs.chart1)
      // 默认初始化（清空）
      this.axisX = []
      this.target = ''
      this.vpb = ''
      this.Series3 = []
      this.label93 = ''
      // toFixed(2)
      // 赋值
      res.Series3.forEach((item) => {
        this.axisX.push(item.x)
        const ad = parseFloat(item.y * 100)
        const r = { 'value': ad, 'date': item.tdate, 'remark': item.remark }
        // 浮框内信息，确认有是个异常点，并添加上异常信息
        const exceptionInformation_point = _.filter(res.Series9, i => item.inspectionRecordId === i.inspectionRecordId)
        if (exceptionInformation_point.length > 0) {
          console.log(222)
          let str = ''
          exceptionInformation_point.forEach((item, index) => {
            str += item.exceptionInformation
            if (index !== exceptionInformation_point.length - 1) {
              str += '<br/>&emsp;&emsp;&emsp;&emsp;&emsp;'
            }
          })
          r['exceptionInformation'] = str
        }
        this.Series3.push(r)
      })
      this.label93 = res.label93
      // this.label93s = this.label93.substring(0, this.label93.lastIndexOf('%'))// 截取百分号之前的所有字段
      this.label93s = parseFloat(res.label93) // CL
      this.label97s = parseFloat(res.label97) // UCL
      this.label99s = parseFloat(res.label99) // LCL
      // this.vpb = res.Series1[0].y
      // this.target = res.Series5[0].y

      let min = _.minBy(res.Series3, o => o.y)
      let max = _.maxBy(res.Series3, o => o.y)

      min = this.label99s < min.y * 100 ? this.label99s : min.y * 100
      max = this.label97s > max.y * 100 ? this.label97s : max.y * 100

      this.min = this.setMin(min)
      this.max = this.setMax(max)

      this.inspectionRecordPointsArr = []
      this.inspectionRecordPointsArr = this.Series3
      this.chartOption = {
        grid: {
          left: 70,
          // containLabel: true,
          bottom: 25,
          right: 120,
          top: 50
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            const d = tt[0].data
            let str = `数值：${d['value']}%<br>
              日期：${d[`date`]}<br>
              备注：${d[`remark`]}
            `
            if (d['exceptionInformation']) {
              str += `<br>异常信息：${d['exceptionInformation']}`
            }
            return str
          }
        },
        legend: {
          show: true,
          data: ['控制限']
        },
        xAxis: {
          type: 'category',
          data: this.newAxisX
        },
        yAxis: {
          min: this.min,
          max: this.max,
          type: 'value',
          name: '%',
          splitLine: { show: false },
          axisLine: { show: true },
          axisTick: { show: true },
          axisLabel: { showMaxLabel: false }
        },
        series: [
          {
            name: '控制限',
            type: 'line',
            symbol: 'line',
            lineStyle: {
              color: '#FFD700'
            },
            smooth: true, // 平滑曲线
            markLine: {
              symbol: 'none',
              silent: true,
              lineStyle: {
                color: '#FFD700' // 这儿设置安全基线颜色
              },
              data: [
                {
                  yAxis: this.label93s,
                  label: {
                    formatter: `均值 ${this.label93s}%` // 这儿设置安全基线
                  }
                },
                {
                  yAxis: this.label97s,
                  lineStyle: { type: 'solid' },
                  label: {
                    formatter: `控制上限 ${this.label97s}%`
                  }
                }, {
                  yAxis: this.label99s,
                  lineStyle: { type: 'solid' },
                  label: {
                    type: 'solid',
                    formatter: `控制下限 ${this.label99s}%`
                  }
                }
              ]
            }
          },
          {
            data: this.Series3,
            type: 'line',
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            },
            markPoint: {
              name: '异常值',
              symbol: 'circle',
              symbolSize: 10,
              data: this.abnormalPointsArr
            }
          }]
      }
      this.addChartOptionInitSytle()
      this.pMychart.setOption(this.chartOption)
      this.charts = []
      this.charts.push(this.pMychart)
      this.click_point(this.charts)
      return this.pMychart
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
