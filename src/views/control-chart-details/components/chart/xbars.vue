
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
        Xbb：<span style="margin-right:20px">{{ xbb }}</span>
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
        </span>
        <span><strong>Xbar-s图</strong></span>
      </div>
    </el-col>
  </el-row>
  <!-- </div> -->
</template>
<script>

import _ from 'lodash'
import chart_mixins from '../../mixins/chart-mixins'
export default {
  mixins: [chart_mixins],
  // props: {
  data() {
    return {
      usl: '', // 均值规格上限
      lsl: '', // 均值规格下限
      ucl: '', // 均值上限
      lcl: '', // 均值下限
      xbb: '', // 均值
      sl: '',
      axisX: [],
      xbar: [],
      series8: [],
      Series9: [],
      LineSeries3: [],
      vCPK: '',
      vPpk: ''
    }
  },
  mounted() {

  },
  methods: {
    get_createChartImgDom() {
      return this.$refs.createChartImg
    },
    add_show(res, controlGroupId, date) {
      this.myChart = this.$echarts.init(this.$refs.chart)
      // 默认初始化（清空）
      this.axisX = []
      this.xbar = []
      this.series8 = []
      this.Series9 = []
      this.LineSeries3 = []
      this.usl = ''
      this.sl = ''
      this.lsl = ''
      this.ucl = ''
      this.lcl = ''
      this.xbb = ''
      // 赋值
      this.usl = parseFloat(res.label83)
      this.lsl = parseFloat(res.label85)
      this.sl = parseFloat(res.label93)
      this.ucl = parseFloat(res.label87)
      this.lcl = parseFloat(res.label89)
      this.xbb = parseFloat(res.label81)
      this.min = this.lsl
      this.max = this.usl
      // 控制上下限
      // this.USL = res.USL
      // this.SL = res.SL
      // this.LSL = res.LSL

      this.vCPK = res.vCPK
      this.vPpk = res.vPpk

      res.Series8.forEach(item => {
        // this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: item.x, yAxis: item.y })
        const isProcessed = this.processedData.some(processedItem => processedItem.id === item.inspectionRecordId)
        const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: '异常点', coord: [parseInt(item.x), item.y], inspectionRecordId: item.inspectionRecordId }
        if (isProcessed) {
          abnormalPinit.name = '处理点'
          abnormalPinit.itemStyle.color = '#9932CC'
        }
        this.series8.push(abnormalPinit)
      })
      res.LineSeries3.forEach((i) => {
        this.axisX.push(i.x)
        const r = { 'value': i.y, 'date': i.tdate, '备注': i.remark || '', inspectionRecordId: i.inspectionRecordId }
        const has_exceptionInformation_point = res.Series8.filter(item => item.inspectionRecordId === i.inspectionRecordId)
        if (has_exceptionInformation_point.length > 0) {
          let str = ''
          has_exceptionInformation_point.forEach((item, index) => {
            str += item.exceptionInformation
            if (index !== has_exceptionInformation_point.length - 1) {
              str += '<br/>&emsp;&emsp;&emsp;&emsp;&emsp;'
            }
          })
          r['异常信息'] = str
        }
        this.LineSeries3.push(r)

        if (i.y > this.max) {
          this.max = i.y
        }
        if (i.y < this.min) {
          this.min = i.y
        }
      })

      if (this.lcl < this.min) {
        this.min = this.lcl
      }
      if (this.ucl > this.max) {
        this.max = this.ucl
      }

      // const min = this.min
      // const max = this.max
      this.inspectionRecordPointsArr = []
      this.inspectionRecordPointsArr = this.LineSeries3
      this.chartOption = {
        grid: {
          left: 70,
          // containLabel: true,
          bottom: 25,
          right: 120,
          top: 30
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            if (tt[0].data.异常信息) {
              return '数值：' + tt[0].data.value + '</br>' +
                        '日期：' + tt[0].data.date + '</br>' +
                        '备注：' + tt[0].data.备注 + '</br>' +
                        '异常信息：' + tt[0].data.异常信息
            } else {
              return '数值：' + tt[0].data.value + '</br>' +
                        '日期：' + tt[0].data.date + '</br>' +
                        '备注：' + tt[0].data.备注
            }
          }
        },
        xAxis: {
          type: 'category',
          data: this.newAxisX
        },
        yAxis: {
          // min: min,
          // max: max,
          type: 'value',
          scale: true,
          splitLine: { show: false },
          axisLine: { show: true },
          axisTick: { show: true }
          // axisLabel: { showMaxLabel: false } // showMinLabel: false,
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
            // data: this.LineSeries3,
            // value: this.xbar,
            type: 'line',
            // smooth: true, // 曲线有弧度
            symbol: 'circle',
            symbolSize: 6,
            label: {
              show: true,
              position: 'top'
            },
            markPoint: {
              name: '异常值',
              symbol: 'circle',
              symbolSize: 10
              // data: this.series8
            }
          }
        ]
      }
      this.addChartOptionInitSytle()
      const option1 = _.cloneDeep(this.chartOption)
      option1.legend.data = [
        {
          name: '控制限',
          lineStyle: { color: '#FFD700', type: 'solid' }
        },
        {
          name: '规格限',
          lineStyle: { color: '#DC143C', type: 'solid' }
        }
      ]
      option1.xAxis.data = this.newAxisX
      option1.series[1] = {
        name: '控制限',
        type: 'line',
        symbol: 'none',
        data: [this.lcl, this.xbb, this.ucl],
        lineStyle: { color: 'transparent' },
        itemStyle: { opacity: 0 },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              name: '平均线',
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '均值 ' + this.xbb
              },
              yAxis: this.xbb,
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
                formatter: '控制下限 ' + this.lcl
              },
              yAxis: this.lcl,
              lineStyle: {
                color: '#FFD700', // 这儿设置安全基线颜色
                type: 'solid'
              }
            },
            {
              name: 'UCL',
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '控制上限 ' + this.ucl
              },
              yAxis: this.ucl,
              lineStyle: {
                color: '#FFD700', // 这儿设置安全基线颜色
                type: 'solid'
              }
            }
          ]
        }
      }
      option1.series[2] = {
        name: '规格限',
        type: 'line',
        symbol: 'none',
        lineStyle: { color: 'transparent' },
        itemStyle: { opacity: 0 },
        data: [this.lsl, this.sl, this.usl],
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '规格上限 ' + this.usl
              },
              yAxis: this.usl,
              lineStyle: {
                color: '#DC143C', // 这儿设置安全基线颜色
                type: 'solid'
              }
            },
            {
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '规格下限 ' + this.lsl
              },
              yAxis: this.lsl,
              lineStyle: {
                color: '#DC143C', // 这儿设置安全基线颜色
                type: 'solid'
              }
            },
            {
              name: 'target',
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '目标值 ' + this.sl
              },
              yAxis: this.sl,
              lineStyle: {
                color: '#DC143C' // 这儿设置安全基线颜色
                // type: 'solid'
              }
            }
          ]
        }
      }

      // option1.yAxis.min = min
      // option1.yAxis.max = max
      option1.series[0].data = this.LineSeries3
      option1.series[0].markPoint.data = this.series8
      this.myChart.setOption(option1)
      const chart = [this.myChart]
      this.charts = []
      this.charts.push(...chart)
      this.click_point(this.charts)
      return this.myChart
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
