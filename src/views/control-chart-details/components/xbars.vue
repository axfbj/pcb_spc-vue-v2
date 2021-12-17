
<template>
  <!-- <div ref="chart" style="width:100%;height:100%"> -->
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <div ref="chart" style="width:100%;height:calc(100% - 20px)" />
      <div style="text-align:center">
        Xbb：<span style="margin-right:20px">{{ xbb }}</span>
        USL：<span style="margin-right:20px">{{ usl }}</span>
        LSL：<span style="margin-right:20px">{{ lsl }}</span>
        UCL：<span style="margin-right:20px">{{ ucl }}</span>
        LCL：<span style="margin-right:20px">{{ lcl }}</span>
        <span><strong>Xbar-S图</strong></span>
      </div>
    </el-col>
  </el-row>
  <!-- </div> -->
</template>
<script>
const echarts = require('echarts/lib/echarts') // 引入柱状图组件

export default {
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
      LineSeries3: []
    }
  },
  mounted() {

  },
  methods: {
    add_show2(res, thisMonthStart, MonthEnd, inspectionCode, productTypeCode, productCode) {
      this.myChart = echarts.init(this.$refs.chart)
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
      this.usl = Number(res.label83).toFixed(2)
      this.lsl = Number(res.label85).toFixed(2)
      this.sl = Number(res.label93).toFixed(2)
      this.ucl = Number(res.label87).toFixed(2)
      this.lcl = Number(res.label89).toFixed(2)
      this.xbb = Number(res.label81).toFixed(2)
      this.min = this.lsl
      this.max = this.usl
      if (this.lcl < this.min) {
        this.min = this.lcl
      }
      if (this.ucl > this.max) {
        this.max = this.ucl
      }
      res.LineSeries3.forEach((i) => {
        this.axisX.push(i.x)
        // this.xbar.push(i.y)
        this.LineSeries3.push({ 'value': i.y.toFixed(2), '日期': i.tdate, '备注': i.remark })
        if (i.y > this.max) {
          this.max = i.y
        }
        if (i.y < Number(this.min)) {
          this.min = i.y
        }
      })
      if (res.Series8.R0) {
        res.Series8.R0.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R1) {
        res.Series8.R1.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R2) {
        res.Series8.R2.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R3) {
        res.Series8.R3.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R4) {
        res.Series8.R4.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R5) {
        res.Series8.R5.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R6) {
        res.Series8.R6.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R7) {
        res.Series8.R7.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R8) {
        res.Series8.R8.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      this.myChart.setOption({
        legend: {
          data: [
            '标准值',
            '异常值',
            '规格'
          ],
          show: true
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            return '数值：' + tt[0].data.value + '</br>' +
                                '日期：' + tt[0].data.日期 + '</br>' +
                                '备注：' + tt[0].data.备注
          }
        },
        xAxis: {
          type: 'category',
          data: this.axisX
        },
        yAxis: {
          max: this.max + 3,
          min: this.min - 3,
          type: 'value',
          splitLine: { show: false }
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
            data: this.LineSeries3,
            value: this.xbar,
            type: 'line',
            // smooth: true, // 曲线有弧度
            symbol: 'circle',
            symbolSize: 8,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            markLine: {
              silent: true,
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
                    color: 'red' // 这儿设置安全基线颜色
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
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'
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
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                }
              ]
            }
          },
          {
            name: '规格',
            data: '',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              color: '#084081'
            },
            itemStyle: {
              color: '#084081'
            },
            label: {
              normal: {
                show: true
              }
            },
            markLine: {
              silent: true,
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
                    color: '#4EB3D3' // 这儿设置安全基线颜色
                    // type: 'solid'
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
                    color: '#4EB3D3' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                }
              ]
            }
          },
          {
            name: '异常值',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#FF0000' // 这儿设置安全基线颜色
              // type: 'solid'
            },
            label: {
              normal: {
                show: true
              }
            },

            markPoint: {
              symbol: 'circle',
              symbolSize: 12,
              name: '异常值',
              data: this.series8
            }
          }]
      })
      return this.myChart
      // this.myChart.on('click', (res) => {
      //   if (res.name === '异常点') {
      //     this.$router.push({ path: '/exception-handling', query: { mes_logintime_k: thisMonthStart, mes_logintime_j: MonthEnd, productCode: productCode, productTypeCode: productTypeCode, inspectionCode }})
      //   }
      // })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
