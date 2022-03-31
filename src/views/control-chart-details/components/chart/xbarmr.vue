
<template>
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <div id="createChartImg" ref="createChartImg" style="height: calc(100% - 20px);">
        <div style="text-align: center; line-height: 24px;">
          <span style="font-size: 14px; color: #0c6dcd;font-weight: 500;">{{ inspectionRecordsData.customTitle || '' }} ({{ inspectionRecordsData.inspectionName || '' }})</span>
          <control-limit-status-info :control-limit-status="$route.query.controlLimitStatus" />
        </div>
        <div style="height: calc(100% - 24px);">
          <div ref="chart1" style="width:100%;height:50%" />
          <div ref="chart2" style="width:100%;height:50%" />
        </div>
      </div>
      <div style="text-align: center;font-size: 14px;">
        USL：<span style="margin-right:20px">{{ USL }}</span>
        SL：<span style="margin-right:20px">{{ SL }}</span>
        LSL：<span style="margin-right:20px">{{ LSL }}</span>
        标准值LCL：<span style="margin-right:20px">{{ LCL }}</span>
        标准值UCL：<span style="margin-right:20px">{{ UCL }}</span>
        极差UCL：<span style="margin-right:20px">{{ vUCLr }}</span>
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
        <span><strong>MR图</strong></span>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// Rb：<span style="margin-right:20px">{{ vab }}</span>
import chart_mixins from '../../mixins/chart-mixins'
import _ from 'loadsh'
export default {
  mixins: [chart_mixins],
  data() {
    return {
      // vab: '',
      vUCLr: '',
      vLCLr: '',
      UCL: '',
      LCL: '',
      axisX: [],
      Series3: [],
      max: 0,
      min: 0,
      max1: 0,
      min1: 0,
      LineSeries3: [],
      series8: [],
      // 控制上下限
      USL: '',
      SL: '',
      LSL: '',

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
    add_show(res, thisMonthStart, MonthEnd, inspectionCode, productTypeCode, productCode) {
      // 默认初始化（清空）
      this.vUCLr = ''
      this.vLCLr = ''
      this.axisX = []
      this.Series3 = []
      this.LineSeries3 = []
      this.series8 = []

      // 控制上下限
      this.UCL = ''
      this.LCL = ''
      // 规格上下限
      this.USL = res.USL
      this.SL = res.SL
      this.LSL = res.LSL
      this.vCPK = res.vCPK
      this.vPpk = res.vPpk
      // 赋值
      // console.log(res, '-----------------------')
      this.vUCLr = parseFloat(res.label97)
      this.vLCLr = parseFloat(res.label99)
      this.UCL = parseFloat(res.label87)
      this.LCL = parseFloat(res.label89)
      // this.max = Number(res.label87).toFixed(this.digit)
      // this.min = Number(res.label99).toFixed(this.digit)
      this.max = this.UCL
      this.min = this.LCL
      this.max1 = this.vUCLr
      this.min1 = this.vLCLr
      // this.vab = Number(res.label91).toFixed(this.digit)
      res.Series3.forEach((i) => {
        this.Series3.push({ 'value': i.y, 'date': i.tdate, 'remark': i.remark || '' })
        if (i.y > Number(this.max1)) {
          this.max1 = i.y
        }
        if (i.y < Number(this.min1)) {
          this.min1 = i.y
        }
      })

      // 加入异常点
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
        const r = { 'value': i.y, 'date': i.tdate, 'remark': i.remark || '', inspectionRecordId: i.inspectionRecordId }
        // 浮框内信息，确认有是个异常点，并添加上异常信息
        const exceptionInformation_point = res.Series8.filter(item => item.inspectionRecordId === i.inspectionRecordId)
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

        this.LineSeries3.push(r)

        if (i.y > Number(this.max)) {
          this.max = i.y
        }
        if (i.y < Number(this.min)) {
          this.min = i.y
        }
      })

      if (this.min > this.LSL) {
        this.min = this.LSL
      }

      if (this.max < this.USL) {
        this.max = this.USL
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
          top: 40
        },
        legend: {
          // data: ['控制限', '规格限']
        },
        tooltip: {
          position: function(point, params, dom, rect, size) {
            // 其中point为当前鼠标的位置，size中有两个属性：viewSize和contentSize，分别为外层div和tooltip提示框的大小
            const x = point[0] //
            const y = point[1]
            let posX = 0 // x坐标位置
            const boxWidth = size.contentSize[0]
            const viewWidth = size.viewSize[0]
            if ((viewWidth - x) < boxWidth) {
              posX = x - boxWidth
              return [posX - 15, y + 10]
            } else {
              return [x + 15, y + 10]
            }
          },
          trigger: 'axis',
          formatter: function(parmas) {
            const d = parmas[0].data
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
        },
        yAxis: {
          // boundaryGap: ['2%', '2%'],
          // min: min,
          // max: max,
          type: 'value',
          scale: true,
          splitLine: { show: false }, // 分割线
          axisLine: { show: true }, // y轴线段
          axisTick: { show: true } // y轴刻度,
          // axisLabel: { showMaxLabel: false, showMinLabel: false }

        },
        series: [
          {
            type: 'line',
            name: '标准值',
            // data: this.LineSeries3,
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: {
              color: '#084081',
              width: 2
            },
            itemStyle: {
              color: '#084081'
            },
            // smooth: true, // 曲线有弧度
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
      this.xbarmrMychart1 = this.$echarts.init(this.$refs.chart1)
      this.xbarmrMychart2 = this.$echarts.init(this.$refs.chart2)

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
      // option1.xAxis.data = this.axisX
      option1.xAxis.data = this.newAxisX
      option1.series[0].data = this.LineSeries3
      option1.series[0].markPoint.data = this.series8
      option1.series[1] = {
        name: '控制限',
        type: 'line',
        symbol: 'none',
        data: [this.LCL, this.UCL],
        lineStyle: { color: 'transparent' },
        itemStyle: { opacity: 0 },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              name: 'LCL',
              label: {
                show: true,
                position: 'end',
                formatter: '控制下限 ' + this.LCL
              },
              yAxis: this.LCL,
              lineStyle: {
                color: '#FFD700', // 这儿设置安全基线颜色
                type: 'solid'
              }
            },
            {
              name: 'UCL',
              label: {
                show: true,
                position: 'end',
                formatter: '控制上限 ' + this.UCL
              },
              yAxis: this.UCL,
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
        data: [this.LSL, this.SL, this.USL],
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            {
              name: 'target',
              label: {
                show: true,
                position: 'end',
                formatter: '目标值 ' + this.SL
              },
              yAxis: this.SL,
              lineStyle: {
                color: '#DC143C'
              }
            },
            {
              name: 'LSL',
              label: {
                show: true,
                position: 'end',
                formatter: '规格下限 ' + this.LSL
              },
              yAxis: this.LSL,
              lineStyle: {
                color: '#DC143C',
                type: 'solid'
              }
            },
            {
              name: 'USL',
              label: {
                show: true,
                position: 'end',
                formatter: '规格上限 ' + this.USL
              },
              yAxis: this.USL,
              lineStyle: {
                color: '#DC143C',
                type: 'solid'
              }
            }
          ]
        }
      }

      const option2 = _.cloneDeep(this.chartOption)
      option2.legend.data = [
        {
          name: '控制限',
          lineStyle: { color: '#FFD700', type: 'solid' }
        }
      ]
      // option2.xAxis.data = this.axisX
      option2.xAxis.data = this.newAxisX
      // option2.yAxis.min = min1
      // option2.yAxis.max = max1
      option2.series[0].data = this.Series3
      option2.series[0].lineStyle.color = '#91CC75'
      option2.series[0].itemStyle.color = '#91CC75'
      option2.series[1] = {
        name: '控制限',
        type: 'line',
        symbol: 'none',
        data: [this.vLCLr, this.vUCLr],
        lineStyle: { color: 'transparent' },
        itemStyle: { opacity: 0 },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
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

      // 移动极差（MR）图
      this.xbarmrMychart1.setOption(option1, true)
      this.xbarmrMychart2.setOption(option2, true)

      const charts = [this.xbarmrMychart1, this.xbarmrMychart2]
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
