
<template>
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <div id="createChartImg" ref="createChartImg" style="height: calc(100% - 20px);">
        <div style="text-align: center; line-height: 24px;">
          <span style="font-size: 16px; color: #0c6dcd;font-weight: 500;">{{ inspectionRecordsData.customTitle || '' }} ({{ inspectionRecordsData.inspectionName || '' }})</span>
          <control-limit-status-info :control-limit-status="$route.query.controlLimitStatus" />
        </div>
        <div style="height: calc(100% - 24px);">
          <div ref="chart1" style="width:100%;height:50%" />
          <div ref="chart2" style="width:100%;height:50%" />
        </div>
      </div>

      <div style="text-align:center;font-size: 14px;">
        <!-- Xbb：<span style="margin-right:20px">{{ xbb }}</span>
        UCL：<span style="margin-right:20px">{{ ucl }}</span>
        LCL：<span style="margin-right:20px">{{ lcl }}</span>
        USL：<span style="margin-right:20px">{{ usl }}</span>
        SL：<span style="margin-right:20px">{{ sl }}</span>
        LSL：<span style="margin-right:20px">{{ lsl }}</span>
        Ppk：<span style="margin-right:20px">{{ vPpk }}</span>
        CPK：<span style="margin-right:20px">{{ vCPK }}</span>
        CPK评级：<span style="margin-right:20px">
          <strong>
            <span v-if="vCPK >= 2.0">A++ 特优</span>
            <span v-else-if="vCPK < 2.0 && vCPK >= 1.67">A+级 优</span>
            <span v-else-if="vCPK < 1.67 && vCPK >= 1.33">A级 良</span>
            <span v-else-if="vCPK < 1.33 && vCPK >= 1.0">B级  一般</span>
            <span v-else-if="vCPK < 1.0 && vCPK >= 0.67">C级  差</span>
            <span v-else-if="vCPK < 0.67">D级  不可接受 </span>
          </strong>
        </span> -->
        <span><strong>y图</strong></span>
      </div>
    </el-col>
  </el-row>
</template>
<script>

import chart_mixins from '../../mixins/chart-mixins'
import _ from 'loadsh'
export default {
  mixins: [chart_mixins],
  // props: {
  data() {
    return {
      chartData_data: {
        CL1: '',
        CL2: '',
        max1: '',
        min1: '',
        abnormalPointsArr1: [],
        inspectionRecordPointsArr1: [],
        axisX1: [],
        max2: '',
        min2: '',
        abnormalPointsArr2: [],
        inspectionRecordPointsArr2: [],
        axisX2: []
      },
      chartData: {}
    }
  },
  created() {
    this.chartData = JSON.parse(JSON.stringify(this.chartData_data))
  },
  methods: {
    get_createChartImgDom() {
      return this.$refs.createChartImg
    },
    add_show(res) {
      this.chartData = JSON.parse(JSON.stringify(this.chartData_data))

      const inspectionRecordPoints1 = res['良品率']
      const inspectionRecordPoints2 = res['不良品率']
      const CL1 = parseFloat(res.g1cl)
      const CL2 = 100 - CL1

      this.chartData = {
        ...this.chartData,
        CL1,
        CL2,
        min1: _.minBy(inspectionRecordPoints1, o => o.y),
        max1: _.maxBy(inspectionRecordPoints1, o => o.y),
        min2: _.minBy(inspectionRecordPoints2, o => o.y),
        max2: _.maxBy(inspectionRecordPoints2, o => o.y)
      }
      // 良品率数据过滤
      inspectionRecordPoints1.forEach(item => {
        this.chartData.min1 = item.y < this.chartData.min1 ? item.y : this.chartData.min1
        this.chartData.max1 = item.y > this.chartData.max1 ? item.y : this.chartData.max1
        this.chartData.axisX1.push(item.x)
        const y = parseFloat(item.y) // 解决js中精度丢失的问题
        const r = { 'value': y, 'date': item.tdate, 'remark': item.remark || '' }
        // 浮框内信息，确认有是个异常点，并添加上异常信息
        if (item['exceptionInformation']) {
          r['exceptionInformation'] = item['exceptionInformation']

          const isProcessed = this.processedData.some(processedItem => processedItem.id === item.inspectionRecordId)
          const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: 'exceptionPoint', xAxis: item.x, yAxis: item.y, inspectionRecordId: item.inspectionRecordId }
          if (isProcessed) {
            abnormalPinit.name = '处理点'
            abnormalPinit.itemStyle.color = '#9932CC'
          }
          this.chartData.abnormalPointsArr1.push(abnormalPinit)

          // this.chartData.abnormalPointsArr1.push({ itemStyle: { color: '#FF0000' }, name: 'exceptionPoint', xAxis: item.x, yAxis: y })
        }
        this.chartData.inspectionRecordPointsArr1.push(r)
      })

      // 不良品率数据过滤
      inspectionRecordPoints2.forEach(item => {
        this.chartData.min2 = item.y < this.chartData.min2 ? item.y : this.chartData.min2
        this.chartData.max2 = item.y > this.chartData.max2 ? item.y : this.chartData.max2
        this.chartData.axisX2.push(item.x)
        const y = parseFloat(item.y) // 解决js中精度丢失的问题

        const r = { 'value': y, 'date': item.tdate, 'remark': item.remark || '' }
        // 浮框内信息，确认有是个异常点，并添加上异常信息
        if (item['exceptionInformation']) {
          r['exceptionInformation'] = item['exceptionInformation']
          const isProcessed = this.processedData.some(processedItem => processedItem.id === item.inspectionRecordId)
          const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: 'exceptionPoint', coord: [parseInt(item.x), item.y], inspectionRecordId: item.inspectionRecordId }
          if (isProcessed) {
            abnormalPinit.name = '处理点'
            abnormalPinit.itemStyle.color = '#9932CC'
          }
          this.chartData.abnormalPointsArr2.push(abnormalPinit)
          // this.chartData.abnormalPointsArr2.push({ itemStyle: { color: '#FF0000' }, name: 'exceptionPoint', xAxis: item.x, yAxis: y })
        }
        this.chartData.inspectionRecordPointsArr2.push(r)
      })

      // const { axisX1, inspectionRecordPointsArr1, abnormalPointsArr1, axisX2, inspectionRecordPointsArr2, abnormalPointsArr2 } = this.chartData
      const { inspectionRecordPointsArr1, abnormalPointsArr1, inspectionRecordPointsArr2, abnormalPointsArr2 } = this.chartData
      const min1 = this.chartData['min1'].y
      const max1 = this.chartData['max1'].y

      const min2 = this.chartData['min2'].y
      const max2 = this.chartData['max2'].y

      this.inspectionRecordPointsArr = []
      this.inspectionRecordPointsArr = inspectionRecordPointsArr1
      this.chartOption = {
        grid: {
          left: 100,
          // containLabel: true,
          bottom: 25,
          right: 80,
          top: 30
        },
        legend: {
          data: ['控制限'],
          show: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const d = params[0].data
            let str = `数值：${d['value']}<br>
              日期：${d[`date`]}<br>
              备注：${d[`remark`]}
            `
            if (d['exceptionInformation']) {
              str += `<br>异常信息：${d['exceptionInformation']}`
            }
            return str
          }
        },
        xAxis: {
          type: 'category'
          //   data: axisX1,
        //   boundaryGap: false
        },
        yAxis: {
        //   min: min1,
        //   max: max1,
          type: 'value',
          splitLine: { show: false },
          axisLine: { show: true },
          axisTick: { show: true },
          nameLocation: 'left',
          nameTextStyle: {
            verticalAlign: 'middle',
            padding: [0, 90, 0, 0]
          }
        },
        series: [
          {
            name: '标准值',
            lineStyle: {
              color: '#084081'
            },
            itemStyle: {
              color: '#084081'
            },

            // data: inspectionRecordPointsArr1,
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%'
            },
            markPoint: {
              name: 'exceptionPoint',
              symbol: 'circle',
              symbolSize: 10
            //   data: abnormalPointsArr1
            }
          }
        ]
      }
      this.addChartOptionInitSytle()
      const markLineOption = {
        type: 'line',
        symbol: 'line',
        lineStyle: {
          // color: '#FFD700'
        },
        markLine: {
          silent: true,
          symbol: 'none'
        }
      }

      const option1 = _.cloneDeep(this.chartOption)
      option1.xAxis.data = this.newAxisX
      option1.yAxis.min = min1
      option1.yAxis.max = max1
      option1.yAxis.name = '良\n品\n率\n(%)'
      option1.series[0].data = inspectionRecordPointsArr1
      option1.series[0].markPoint.data = abnormalPointsArr1
      option1.series[1] = _.cloneDeep(markLineOption)
      option1.series[1].name = '控制限'
      option1.series[1].lineStyle.color = '#FFD700'
      option1.series[1].markLine.data = [
        {
          name: 'CL',
          label: {
            show: true,
            position: 'end',
            formatter: `均值 ${this.chartData.CL1}%`
          },
          yAxis: this.chartData.CL1,
          lineStyle: {
            color: '#FFD700' // 这儿设置安全基线颜色
          }
        }
      ]

      const option2 = _.cloneDeep(this.chartOption)
      option2.xAxis.data = this.newAxisX
      option2.yAxis.min = min2
      option2.yAxis.max = max2
      option2.yAxis.name = '不\n良\n品\n率\n(%)'
      option2.series[0].data = inspectionRecordPointsArr2
      option2.series[0].markPoint.data = abnormalPointsArr2
      option2.series[0].lineStyle.color = '#91CC75'
      option2.series[0].itemStyle.color = '#91CC75'
      option2.series[1] = _.cloneDeep(markLineOption)
      option2.series[1].name = '控制限'
      option2.series[1].lineStyle.color = '#FFD700'
      option2.series[1].markLine.data = [
        {
          name: 'CL',
          label: {
            show: true,
            position: 'end',
            formatter: `均值 ${this.chartData.CL2}%`
          },
          yAxis: this.chartData.CL2,
          lineStyle: {
            color: '#FFD700' // 这儿设置安全基线颜色
          }
        }
      ]

      const yChart1 = this.$echarts.init(this.$refs.chart1)
      const yChart2 = this.$echarts.init(this.$refs.chart2)

      yChart1.setOption(option1)
      yChart2.setOption(option2)
      const charts = [yChart1, yChart2]
      this.charts = []
      this.charts.push(...charts)
      this.click_point(this.charts)
      return charts
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
