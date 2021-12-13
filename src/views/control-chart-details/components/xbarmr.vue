
<template>
  <!-- <div ref="chart" style="width:100%;height:100%"> -->
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <div ref="chart1" style="width:100%;height:100%" />
      <div style="text-align:center">
        标准值UCL：<span style="margin-right:20px">{{ UCL }}</span>
        标准值LCL：<span style="margin-right:20px">{{ LCL }}</span>
        极差UCL：<span style="margin-right:20px">{{ vUCLr }}</span>
        极差LCL：<span style="margin-right:20px">{{ vLCLr }}</span>
        <span><strong>MR图</strong></span>
      </div>
    </el-col>
  </el-row>
  <!-- </div> -->
</template>
<script>
const echarts = require('echarts/lib/echarts') // 引入柱状图组件
// Rb：<span style="margin-right:20px">{{ vab }}</span>
export default {
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
      LineSeries3: [],
      series8: []
    }
  },
  mounted() {
    this.xbarmrMychart = echarts.init(this.$refs.chart1)
  },
  methods: {
    add_show3(res, thisMonthStart, MonthEnd, inspectionCode, productTypeCode, productCode) {
      // 默认初始化（清空）
      this.vUCLr = ''
      this.vLCLr = ''
      this.axisX = []
      this.Series3 = []
      this.LineSeries3 = []
      this.series8 = []
      this.UCL = ''
      this.LCL = ''
      // 赋值
      console.log(res, '-----------------------')
      this.vUCLr = Number(res.label97).toFixed(2)
      this.vLCLr = Number(res.label99).toFixed(2)
      this.UCL = Number(res.label87).toFixed(2)
      this.LCL = Number(res.label89).toFixed(2)
      this.max = Number(res.label87).toFixed(2)
      this.min = Number(res.label99).toFixed(2)
      // this.vab = Number(res.label91).toFixed(2)
      res.LineSeries3.forEach((i) => {
        this.axisX.push(i.x)
        this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
        if (i.y > Number(this.max)) {
          this.max = i.y
        }
      })
      res.Series3.forEach((i) => {
        this.Series3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
        if (i.y < Number(this.min)) {
          this.min = i.y
        }
      })
      // 加入异常点
      if (res.Series8.ruleOne) {
        res.Series8.ruleOne.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleTwo) {
        res.Series8.ruleTwo.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleThree) {
        res.Series8.ruleThree.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleFour) {
        res.Series8.ruleFour.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleFive) {
        res.Series8.ruleFive.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleSix) {
        res.Series8.ruleSix.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleSeven) {
        res.Series8.ruleSeven.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleEight) {
        res.Series8.ruleEight.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.ruleNine) {
        res.Series8.ruleNine.forEach((i) => {
          this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      // 移动极差（MR）图
      this.xbarmrMychart.setOption({
        legend: {
          data: ['极差值', '标准值']
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
          min: this.min - 3,
          max: this.max + 3,
          type: 'value',
          splitLine: { show: false }
        },
        series: [
          {
            name: '极差值',
            lineStyle: {
              color: '#91CC75'
            },
            itemStyle: {
              color: '#91CC75'
            },
            data: this.Series3,
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
                  name: 'vLCLr',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '极差控制下限 ' + this.vLCLr
                  },
                  yAxis: this.vLCLr,
                  lineStyle: {
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                },
                {
                  name: 'vUCLr',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '极差控制上限 ' + this.vUCLr
                  },
                  yAxis: this.vUCLr,
                  lineStyle: {
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                }
              ]
            }
          },
          {
            name: '标准值',
            lineStyle: {
              color: '#084081'
            },
            itemStyle: {
              color: '#084081'
            },
            data: this.LineSeries3,
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
                  name: 'LCL',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '控制下限 ' + this.LCL
                  },
                  yAxis: this.LCL,
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
                    formatter: '控制上限 ' + this.UCL
                  },
                  yAxis: this.UCL,
                  lineStyle: {
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                }
              ]
            }
          }, {
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
      }, true)
      return this.xbarmrMychart
      // this.xbarmrMychart.on('click', (res) => {
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
