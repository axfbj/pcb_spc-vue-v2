
<template>
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <div id="createChartImg" ref="createChartImg" style="height: calc(100% - 20px);">
        <div style="text-align: center; line-height: 24px;">
          <span style="font-size: 16px; color: #0c6dcd;font-weight: 500;">{{ inspectionRecordsData.customTitle || '' }} ({{ inspectionRecordsData.inspectionName || '' }})</span>
          <control-limit-status-info :control-limit-status="$route.query.controlLimitStatus" />
        </div>
        <div style="height: calc(100% - 24px);">
          <div ref="chart" style="width:100%;height:100%" />
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
        <span><strong>c图</strong></span>
      </div>
    </el-col>
  </el-row>
  <!-- </div> -->
</template>
<script>

import chart_mixins from '../../mixins/chart-mixins'
export default {
  mixins: [chart_mixins],
  // props: {
  data() {
    return {
      chartData_data: {
        ucl: '',
        cl: '',
        lcl: '',
        max: '',
        min: '',
        abnormalPointsArr: [],
        inspectionRecordPointsArr: [],
        axisX: []
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
      const cChart = this.$echarts.init(this.$refs.chart)
      this.chartData = JSON.parse(JSON.stringify(this.chartData_data))
      const { ucl, cl, lcl } = res
      this.chartData = {
        ...this.chartData,
        ucl,
        cl,
        lcl,
        max: ucl,
        min: lcl
      }
      res.abnormalPoints.forEach((item) => {
        // this.chartData.abnormalPointsArr.push({ itemStyle: { color: '#FF0000' }, name: 'exceptionPoint', xAxis: item.x, yAxis: item.y })

        const isProcessed = this.processedData.some(processedItem => processedItem.id === item.inspectionRecordId)
        const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: 'exceptionPoint', coord: [parseInt(item.x), item.y], inspectionRecordId: 'inspectionRecordId' }
        if (isProcessed) {
          abnormalPinit.name = '处理点'
          abnormalPinit.itemStyle.color = '#9932CC'
        }
        this.chartData.abnormalPointsArr.push(abnormalPinit)
      })

      res.inspectionRecordPoints.forEach(item => {
        this.chartData.min = item.y < this.chartData.min ? item.y : this.chartData.min
        this.chartData.max = item.y > this.chartData.max ? item.y : this.chartData.max
        this.chartData.axisX.push(item.x)
        const r = { 'value': item.y, 'date': item.tdate, 'remark': item.remark || '' }
        // 浮框内信息，确认有是个异常点，并添加上异常信息
        const exceptionInformation_point = res.abnormalPoints.filter(i => item.inspectionRecordId === i.inspectionRecordId)
        if (exceptionInformation_point.length > 0) {
          let str = ''
          exceptionInformation_point.forEach((item, index) => {
            str += item.exceptionInformation
            if (index !== exceptionInformation_point.length - 1) {
              str += '<br/>&emsp;&emsp;&emsp;&emsp;&emsp;'
            }
          })
          r['exceptionInformation'] = str
        }
        this.chartData.inspectionRecordPointsArr.push(r)
      })

      this.chartData.min = this.setMin(this.chartData.min)
      this.chartData.max = this.setMax(this.chartData.max)

      // const { min, max, axisX, inspectionRecordPointsArr, abnormalPointsArr } = this.chartData
      const { min, max, inspectionRecordPointsArr, abnormalPointsArr } = this.chartData
      this.inspectionRecordPointsArr = []
      this.inspectionRecordPointsArr = inspectionRecordPointsArr
      //   const ucl = 100
      //   cl = res.cl
      //   lcl = 10
      this.chartOption = {
        grid: {
          left: 70,
          // containLabel: true,
          bottom: 25,
          right: 120,
          top: 30
        },
        legend: {
          data: [
            // '标准值',
            // '异常值',
            '控制限'
            // '规格限'
          ],
          show: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            const d = tt[0].data
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
          type: 'category',
          data: this.newAxisX,
          boundaryGap: false
        },
        yAxis: {
          min: min,
          max: max,
          type: 'value',
          splitLine: { show: false },
          axisLine: { show: true },
          axisTick: { show: true },
          axisLabel: { showMaxLabel: false } // showMinLabel: false,
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
            data: inspectionRecordPointsArr,
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            label: {
            //   show: true,
              position: 'top'
            },
            markPoint: {
              name: 'exceptionPoint',
              symbol: 'circle',
              symbolSize: 10,
              data: abnormalPointsArr
            }
          },
          {
            name: '控制限',
            animation: false,
            // data: '',
            type: 'line',
            symbol: 'line',
            smooth: false,
            step: 'start',
            lineStyle: {
              color: '#FFD700',
              width: 1
            },
            itemStyle: {
              color: 'transparent'
            },
            // data: ucls,
            markLine: {
              animation: false,
              symbol: 'none',
              silent: true,
              data: [
                {
                  name: 'UCL',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '控制下限 ' + ucl
                  },
                  yAxis: ucl,
                  lineStyle: {
                    color: '#FFD700', // 这儿设置安全基线颜色
                    type: 'solid'
                  }
                },
                {
                  name: '平均线',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '均值 ' + cl
                  },
                  yAxis: cl,
                  lineStyle: {
                    color: '#FFD700' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                },
                {
                  name: 'LCL',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '控制下限 ' + lcl
                  },
                  yAxis: lcl,
                  lineStyle: {
                    color: '#FFD700', // 这儿设置安全基线颜色
                    type: 'solid'
                  }
                }
              ]
            }
          }
        ]
      }
      this.addChartOptionInitSytle()
      cChart.setOption(this.chartOption)
      this.charts = []
      this.charts.push(cChart)
      this.click_point(this.charts)
      return cChart
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
