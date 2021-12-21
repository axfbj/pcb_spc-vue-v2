
<template>
  <div style="height:100%; width: 100%;">
    <aa v-if="wsj===true" ref="aa" :receipt-show="true" />

    <el-row style="height:100%; width: 100%;">
      <el-col :span="24" style="height:50%">
        <div v-show="wsj!==true" ref="chart" style="width:100%;height:calc(100% - 20px)" />
        <div v-if="wsj!==true" style="text-align:center">
          Xbb：<span style="margin-right:20px">{{ xbb }}</span>
          USL：<span style="margin-right:20px">{{ usl }}</span>
          LSL：<span style="margin-right:20px">{{ lsl }}</span>
          UCL：<span style="margin-right:20px">{{ ucl }}</span>
          LCL：<span style="margin-right:20px">{{ lcl }}</span>
          <span><strong>均值(Xbar-s)图</strong></span>
        </div>
      </el-col>
      <el-col :span="24" style="height:50%">
        <div v-show="wsj!==true" ref="chart1" style="width:100%;height:calc(100% - 20px)" />
        <div v-if="wsj!==true" style="text-align:center">
          Rb：<span style="margin-right:20px">{{ vab }}</span>
          UCL：<span style="margin-right:20px">{{ vUCLr }}</span>
          LCL：<span style="margin-right:20px">{{ vLCLr }}</span>
          <span><strong>移动极差(MR)图</strong></span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// const echarts = require('echarts/lib/echarts') // 引入柱状图组件
import aa from '@/components/wushuju'
export default {
  name: 'Add',
  components: {
    aa
  },
  data() {
    return {
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
      LineSeries3: []
    }
  },
  mounted() {

  },
  methods: {
    add_show(res, thisMonthStart, MonthEnd, inspectionCode, productTypeCode, productCode) {
      this.myChart = this.$echarts.init(this.$refs.chart)
      this.myChart1 = this.$echarts.init(this.$refs.chart1)

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

      // 图形赋值
      this.usl = res.USL.toFixed(2)
      this.lsl = res.LSL.toFixed(2)
      this.sl = Number(res.target).toFixed(2)
      this.ucl = res.vUCLx.toFixed(2)
      this.lcl = res.vLCLx.toFixed(2)
      this.xbb = res.vxbb.toFixed(2)
      this.min = this.lsl
      this.max = this.usl
      this.vUCLr = res.vUCLr.toFixed(2)
      this.max1 = res.vUCLr.toFixed(2)
      this.vLCLr = res.vLCLr.toFixed(2)
      this.vab = res.Series11[0].y.toFixed(2)
      res.LineSeries3.forEach((i) => {
        // if (i.exceptionInformation) {
        this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark || '', inspectionRecordId: i.inspectionRecordId })
        //   this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark || '', '异常信息': i.exceptionInformation })
        // } else {
        //   this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark || '' })
        // }
        // const aaa = i.tdate.split(' ')[0]
        this.axisX.push(i.x)
        this.xbar.push(i.y)
        if (i.y < this.min) {
          this.min = i.y
        }
        if (i.y > this.max) {
          this.max = i.y
        }
      })
      // 加入异常点
      res.Series8.forEach(item => {
        // console.log('i.', i)
        this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: item.x, yAxis: item.y })
        // 浮框内信息，确认有是个异常点，并添加上异常信息
        const has_exceptionInformation_point = this.LineSeries3.find(i => item.inspectionRecordId === i.inspectionRecordId)
        has_exceptionInformation_point['异常信息'] = item.exceptionInformation
        // this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark || '', '异常信息': i.exceptionInformation })
      })
      // if (res.Series8.R0) {
      //   res.Series8.R0.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R1) {
      //   res.Series8.R1.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R2) {
      //   res.Series8.R2.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R3) {
      //   res.Series8.R3.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R4) {
      //   res.Series8.R4.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R5) {
      //   res.Series8.R5.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R6) {
      //   res.Series8.R6.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R7) {
      //   res.Series8.R7.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // if (res.Series8.R8) {
      //   res.Series8.R8.forEach((i) => {
      //     this.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
      //   })
      // }
      // Series9
      if (res.Series9.length > 0) {
        res.Series9.forEach((i) => {
          this.Series9.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      // if (i.exceptionInformation) {
      //   this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark, '异常信息': i.exceptionInformation })
      // } else {
      //   this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
      // }
      res.Series3.forEach((i) => {
        if (i.exceptionInformation) {
          this.Series3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark, '异常信息': i.exceptionInformation })
        } else {
          this.Series3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
        }
        if (this.max1 < i.y) {
          this.max1 = i.y
        }
      })
      // Xbar-r 图标初始化
      this.myChart.setOption({
        grid:
          {
            left: 70,
            // containLabel: true,
            bottom: 25,
            right: 120,
            top: 30
          },
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
            if (tt[0].data.异常信息) {
              return '数值：' + tt[0].data.value + '</br>' +
                                    '日期：' + tt[0].data.日期 + '</br>' +
                                    '备注：' + tt[0].data.备注 + '</br>' +
                                    '异常信息：' + tt[0].data.异常信息
            } else {
              return '数值：' + tt[0].data.value + '</br>' +
                                    '日期：' + tt[0].data.日期 + '</br>' +
                                    '备注：' + tt[0].data.备注
            }
            // this.series8.forEach((hh) => {
            //   if (tt.axisValue === hh.xAxis) {
            //     return 'aaaaaaaaaaaa'
            //   } else {
            //   }
            // })
          }
        },
        xAxis: {
          type: 'category',
          data: this.axisX
          // x轴文字倾斜
          // axisLabel: { //  如果这个字段不设置，echarts会根据屏宽及横坐标数据自动给出间隔
          //   rotate: 40 // 横坐标上label的倾斜度
          // }
        },
        yAxis: {
          max: this.max * 1.2,
          min: this.min * 0.8,
          type: 'value',
          splitLine: { show: false },
          axisLine: { show: true },
          axisLabel: {
            color: '#797979',
            fontSize: 13,
            showMinLabel: false, // 不显示最小刻度线值
            showMaxLabel: false // 不显示最大刻度线值
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
            data: this.LineSeries3,
            value: this.xbar,
            type: 'line',
            // smooth: true, // 曲线有弧度
            symbol: 'circle',
            symbolSize: 8,
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'top'
            //   }
            // },
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
            // label: {
            //   normal: {
            //     show: true
            //   }
            // },
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
            // label: {
            //   normal: {
            //     show: true
            //   }
            // },
            markPoint: {
              symbol: 'circle',
              symbolSize: 12,
              name: '异常值',
              data: this.series8
            }
          }]
      }, true)
      // 移动极差（MR）图
      this.myChart1.setOption({
        grid:
          {
            left: 70,
            // containLabel: true,
            bottom: 25,
            right: 120,
            top: 30
          },
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            if (tt[0].data.异常信息) {
              return '数值：' + tt[0].data.value + '</br>' +
                                    '日期：' + tt[0].data.日期 + '</br>' +
                                    '备注：' + tt[0].data.备注 + '</br>' +
                                    '异常信息：' + tt[0].data.异常信息
            } else {
              return '数值：' + tt[0].data.value + '</br>' +
                                    '日期：' + tt[0].data.日期 + '</br>' +
                                    '备注：' + tt[0].data.备注
            }
          }
        },
        xAxis: {
          type: 'category',
          data: this.axisX
          // axisLabel: { //  如果这个字段不设置，echarts会根据屏宽及横坐标数据自动给出间隔
          //   rotate: 40 // 横坐标上label的倾斜度
          // }
        },
        yAxis: {
          axisLine: { show: true },
          min: this.vLCLr * 0.8,
          // max: this.max1 + 3,
          max: this.max1 * 1.2,
          type: 'value',
          splitLine: { show: false },
          axisLabel: {
            color: '#797979',
            fontSize: 13,
            showMinLabel: false, // 不显示最小刻度线值
            showMaxLabel: false // 不显示最大刻度线值
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
            data: this.Series3,
            type: 'line',
            // smooth: true, // 曲线有弧度
            symbol: 'circle',
            symbolSize: 8,
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'top'
            //   }
            // },
            markLine: {
              silent: true,
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
                    color: 'red' // 这儿设置安全基线颜色
                    // type: 'solid'
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
                    formatter: '控制上限 ' + this.vUCLr
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
            name: '异常值',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#FF0000' // 这儿设置安全基线颜色
              // type: 'solid'
            },
            // label: {
            //   normal: {
            //     show: true
            //   }
            // },

            markPoint: {
              symbol: 'circle',
              symbolSize: 12,
              name: '异常值',
              data: this.Series9
            }
          }]
      })
      this.$nextTick(() => {
        this.myChart.resize()
        this.myChart1.resize()
      })

      this.myChart.on('click', (res) => {
        if (res.name === '异常点') {
          this.$router.push({ path: '/exception-handling', query: { mes_logintime_k: thisMonthStart, mes_logintime_j: MonthEnd, productCode: productCode, productTypeCode: productTypeCode, inspectionCode }})
        }
      })

      return [this.myChart, this.myChart1]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
