
<template>
  <div style="height:100%; width: 100%;">
    <!-- <aa v-if="wsj===true" ref="aa" :receipt-show="true" /> -->
    <el-row style="height:100%; width: 100%;">
      <div id="createChartImg" ref="createChartImg" style="height: calc(100% - 20px);">
        <div style="text-align: center; line-height: 24px;">
          <span style="font-size: 14px; color: #0c6dcd;font-weight: 500;">{{ inspectionRecordsData.customTitle || '' }} ({{ inspectionRecordsData.inspectionName || '' }})</span>
          <control-limit-status-info :control-limit-status="$route.query.controlLimitStatus" />
        </div>
        <div style="height: calc(100% - 24px);">
          <div ref="chart" style="width:100%;height:50%" />
          <div ref="chart1" style="width:100%;height:50%" />
        </div>
      </div>

      <div style="text-align:center;font-size: 14px;">
        UCL：<span style="margin-right:20px">{{ ucl }}</span>
        Xbb：<span style="margin-right:20px">{{ xbb }}</span>
        LCL：<span style="margin-right:20px">{{ lcl }}</span>
        USL：<span style="margin-right:20px">{{ usl }}</span>
        SL：<span style="margin-right:20px">{{ sl }}</span>
        LSL：<span style="margin-right:20px">{{ lsl }}</span>
        极差UCL：<span style="margin-right:20px">{{ vUCLr }}</span>
        极差cl：<span style="margin-right:20px">{{ vab }}</span>
        极差LCL：<span style="margin-right:20px">{{ vLCLr }}</span>
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
        <span><strong>Xbar-R图</strong></span>
      </div>
    </el-row>
  </div>
</template>

<script>
// const echarts = require('echarts/lib/echarts') // 引入柱状图组件
import chart_mixins from '../../mixins/chart-mixins'
import _ from 'loadsh'
export default {
  name: 'XbarR',
  mixins: [chart_mixins],
  data() {
    return {
      chartOption: {},
      wsj: false,
      usl: '', // 均值规格上限
      sl: '', // 均值规格中限
      lsl: '', // 均值规格下限
      ucl: '', // 均值上限
      lcl: '', // 均值下限
      xbb: '', // 均值
      myChart: null,
      myChart1: null,
      axisX: [],
      xbar: [],
      min: 0,
      max: 0,
      min1: 0,
      max1: 0,
      series8: [],
      //   Series11: [], // 样本平均差值
      vab: '',
      Series3: [], // remark
      vUCLr: '', // 样本控制上限
      vLCLr: '', // 样本控制下限
      Series9: [], // 差异点
      LineSeries3: [],
      vCPK: '',
      vPpk: ''
    }
  },
  mounted() {
    // console.log(this.$route)
    // console.log(this.$router)
    // this.myChart = this.$echarts.init(this.$refs.chart)
    // this.myChart1 = this.$echarts.init(this.$refs.chart1)
  },
  methods: {
    get_createChartImgDom() {
      return this.$refs.createChartImg
    },
    add_show(res, controlGroupId, date) {
      if (!res) {
        this.wsj = true
        return
      }
      // alert(this.wsj)
      if (!res.Series3 || !res.LineSeries3) {
        this.wsj = true
        return
      } else {
        this.wsj = false
      }
      // 清空初始化
      this.axisX = []
      this.xbar = []
      this.series8 = []
      this.Series3 = []
      this.Series9 = []
      this.usl = ''
      this.sl = ''
      this.lsl = ''
      this.ucl = ''
      this.lcl = ''
      this.xbb = ''
      this.vab = ''
      this.vUCLr = ''
      this.vLCLr = ''
      this.min = 0
      this.max = 0
      this.min1 = 0
      this.max1 = 0
      this.LineSeries3 = []

      // 规格上下限
      // this.LSL = res.LSL

      this.vCPK = res.vCPK
      this.vPpk = res.vPpk

      // 图形赋值
      this.usl = res.USL
      this.lsl = res.LSL
      this.sl = parseFloat(res.target)
      this.ucl = res.vUCLx
      this.lcl = res.vLCLx
      this.xbb = res.vxbb
      this.min = this.lsl
      this.max = this.usl
      this.vUCLr = res.vUCLr
      this.max1 = res.vUCLr
      this.vLCLr = res.vLCLr
      this.vab = res.Series11[0].y

      // 加入异常点
      res.Series8.forEach(item => {
        const isProcessed = this.processedData.some(processedItem => processedItem.id === item.inspectionRecordId)
        const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: '异常点', coord: [parseInt(item.x), item.y], inspectionRecordId: item.inspectionRecordId }
        if (isProcessed) {
          abnormalPinit.name = '处理点'
          abnormalPinit.itemStyle.color = '#9932CC'
        }
        this.series8.push(abnormalPinit)
      })

      res.LineSeries3.forEach((i) => {
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

        this.axisX.push(i.x)
        this.xbar.push(i.y)
        if (i.y < this.min) {
          this.min = i.y
        }
        if (i.y > this.max) {
          this.max = i.y
        }
      })

      res.MRAbnormalPoints.forEach((i) => {
        const isProcessed = this.processedData.some(processedItem => processedItem.id === i.inspectionRecordId)
        const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: '异常点', coord: [parseInt(i.x), i.y], inspectionRecordId: i.inspectionRecordId }
        if (isProcessed) {
          abnormalPinit.name = '处理点'
          abnormalPinit.itemStyle.color = '#9932CC'
        }
        this.Series9.push(abnormalPinit)
      })

      res.Series3.forEach((i) => {
        const r = { 'value': i.y, 'date': i.tdate, '备注': i.remark || '', inspectionRecordId: i.inspectionRecordId }
        const has_exceptionInformation_point = res.MRAbnormalPoints.filter(item => item.inspectionRecordId === i.inspectionRecordId)
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
        this.Series3.push(r)

        if (i.y < this.min) {
          this.min1 = i.y
        }

        if (this.max1 < i.y) {
          this.max1 = i.y
        }
      })

      if (this.min > this.lcl) {
        this.min = this.lcl
      }

      if (this.min > this.lsl) {
        this.min = this.lsl
      }

      if (this.max < this.ucl) {
        this.max = this.ucl
      }

      if (this.max < this.usl) {
        this.max = this.usl
      }

      if (this.min1 > this.vLCLr) {
        this.min1 = this.vLCLr
      }

      if (this.max1 < this.vUCLr) {
        this.max1 = this.vUCLr
      }

      // const [min, max] = this.setMinAndMax(this.min, this.max)
      // const [min1, max1] = this.setMinAndMax(this.min1, this.max1)
      this.inspectionRecordPointsArr = []
      this.inspectionRecordPointsArr = this.LineSeries3
      this.chartOption = {
        grid: {
          left: 70,
          // containLabel: true,
          bottom: 25,
          right: 120,
          top: 35
        },
        legend: {},
        tooltip: {
          trigger: 'axis',
          // confine: true,
          position: function(point, params, dom, rect, size) {
            // 其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
            const x = point[0] //
            const y = point[1]
            let posX = 0 // x坐标位置
            // var posY = 0 // y坐标位置

            const boxWidth = size.contentSize[0]
            // var boxHeight = size.contentSize[1]

            const viewWidth = size.viewSize[0]
            // var viewHeight = size.viewSize[1]

            if ((viewWidth - x) < boxWidth) {
              posX = x - boxWidth
              return [posX - 15, y + 10]
            } else {
              return [x + 15, y + 10]
            }

            // return [posX, posY]
          },
          // position: ['50%', '50%'],
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
          type: 'category'
          // data: this.axisX
        },
        yAxis: {
          // min: min,
          // max: max,
          scale: true,
          type: 'value',
          splitLine: { show: false },
          axisLine: { show: true },
          axisTick: { show: true }
          // axisLabel: { showMaxLabel: false, showMinLabel: false }
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
              symbol: 'circle',
              symbolSize: 10,
              name: '异常值'
              // data: this.series8
            }
          },
          {
            name: '规格限',
            type: 'line',
            // smooth: true,
            symbol: 'line',
            lineStyle: {
              // color: '#DC143C'
            }
          },
          {
            name: '控制限',
            type: 'line',
            smooth: true,
            symbol: 'line',
            symbolSize: 8,
            lineStyle: {
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
      // option1.yAxis.min = min
      // option1.yAxis.max = max
      option1.series[0].data = this.LineSeries3
      option1.series[0].markPoint.data = this.series8
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
              // symbol: 'none',
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
              // symbol: 'none',
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
              label: {
                show: true,
                position: 'end',
                formatter: '规格上限 ' + this.usl
              },
              yAxis: this.usl,
              lineStyle: {
                color: '#DC143C',
                type: 'solid'
              }
            },
            {
              name: '目标值',
              label: {
                show: true,
                position: 'end',
                formatter: '目标值 ' + this.sl
              },
              yAxis: this.sl,
              lineStyle: {
                color: '#DC143C'
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
            }
          ]
        }
      }
      // option1.series[2].markLine.data = [

      // ]

      const option2 = _.cloneDeep(this.chartOption)
      option2.legend.data = [
        {
          name: '控制限',
          lineStyle: { color: '#FFD700', type: 'solid' }
        }
      ]
      option2.xAxis.data = this.newAxisX
      // option2.yAxis.min = min1
      // option2.yAxis.max = max1
      option2.series[0].data = this.Series3
      option2.series[0].markPoint.data = this.Series9
      option2.series[0].lineStyle.color = '#91CC75'
      option2.series[0].itemStyle.color = '#91CC75'
      option2.series[1] = {
        name: '控制限',
        type: 'line',
        symbol: 'none',
        data: [this.vab, this.vLCLr, this.vUCLr],
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
                formatter: '平均差值' + this.vab
              },
              yAxis: this.vab,
              lineStyle: {
                color: '#FFD700' // 这儿设置安全基线颜色
              }
            },
            {
              name: 'vLCLr',
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '控制下限 ' + this.vLCLr
              },
              yAxis: this.vLCLr,
              lineStyle: {
                color: '#FFD700', // 这儿设置安全基线颜色
                type: 'solid'
              }
            },
            {
              name: 'vUCLr',
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: '控制上限 ' + this.vUCLr
              },
              yAxis: this.vUCLr,
              lineStyle: {
                color: '#FFD700', // 这儿设置安全基线颜色
                type: 'solid'
              }
            }
          ]
        }
      }
      // option2.series[1].markLine.data = [

      // ]

      this.myChart = this.$echarts.init(this.$refs.chart)

      this.myChart1 = this.$echarts.init(this.$refs.chart1)
      // Xbar-r 图标初始化
      this.myChart.setOption(option1)
      // 移动极差（MR）图
      this.myChart1.setOption(option2)

      this.myChart.setOption(option1)
      this.myChart1.setOption(option2)

      const charts = [this.myChart, this.myChart1]
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
