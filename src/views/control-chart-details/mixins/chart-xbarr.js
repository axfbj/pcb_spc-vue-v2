import chartData from './data'
export default {
  data() {
    return {
      arr: {
        label59: '', // 样本数量
        subgroupSize: '', // 子组容量
        USL: '',
        LSL: '',
        Tol: '',
        Cr: '',
        Cp: '',
        Cpk: '',
        Zusl: '',
        Zlsl: '',
        Cpl: '',
        Cpu: '',
        Cpm: '',
        Pr: '',
        Pp: '',
        Ppk: '',
        std_dev: '',
        Max: '',
        Min: '',
        Range: '',
        r_bar: '',
        est: '',
        target: '',
        label67: ''
      }
    }
  },
  methods: {
    chart_xbarr() {
      this.chartData = chartData
      this.setArrValue()
    },
    setArrValue() {
      const res4 = chartData
      this.arr.label59 = res4.data.label59
      this.arr.subgroupSize = res4.data.label59
      this.arr.USL = res4.data.USL
      this.arr.LSL = res4.data.LSL
      this.arr.Tol = res4.data['USL-LSL']
      this.arr.Cr = res4.data.vCR
      this.arr.Cp = res4.data.vCp
      this.arr.Cpk = res4.data.vCPK
      this.arr.Zusl = res4.data.vZusl
      this.arr.Zlsl = res4.data.vZlsl
      this.arr.Cpl = res4.data.vCPL
      this.arr.Cpu = res4.data.vCPU
      this.arr.Cpm = res4.data.vCpm
      this.arr.Pr = res4.data.vPR
      this.arr.Pp = res4.data.vPp
      this.arr.Ppk = res4.data.vPpk
      this.arr.std_dev = res4.data.vs0
      this.arr.Max = res4.data.umax
      this.arr.Min = res4.data.umin
      this.arr.Range = res4.data['umax-umin']
      this.arr.r_bar = res4.data.label73
      this.arr.est = res4.data.vs
      this.arr.target = res4.data.target
      this.arr.label67 = res4.data.label67
    },
    getLineData1() {
      this.setArrValue()
      const res = chartData.data
      const decimal = 2

      const p = {
        usl: res.USL.toFixed(decimal),
        lsl: res.LSL.toFixed(decimal),
        sl: Number(res.target).toFixed(decimal),
        ucl: res.vUCLx.toFixed(decimal),
        lcl: res.vLCLx.toFixed(decimal),
        xbb: res.vxbb.toFixed(decimal),

        vUCLr: res.vUCLr.toFixed(decimal),
        max1: res.vUCLr.toFixed(decimal),
        vLCLr: res.vLCLr.toFixed(decimal),
        vab: res.Series11[0].y.toFixed(decimal),

        LineSeries3: [],
        axisX: [],
        xbar: [],
        series8: [], // 装入异常点

        Series3: []
      }
      p.min = p.lsl
      p.max = p.usl

      res.LineSeries3.forEach((i) => {
        if (i.exceptionInformation) {
          p.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark, '异常信息': i.exceptionInformation })
        } else {
          p.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
        }
        p.axisX.push(i.x)
        p.xbar.push(i.y)
        if (i.y < p.min) {
          p.min = i.y
        }
        if (i.y > p.max) {
          p.max = i.y
        }
      })

      if (res.Series8.R0) {
        res.Series8.R0.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R1) {
        res.Series8.R1.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R2) {
        res.Series8.R2.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R3) {
        res.Series8.R3.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R4) {
        res.Series8.R4.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R5) {
        res.Series8.R5.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R6) {
        res.Series8.R6.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R7) {
        res.Series8.R7.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }
      if (res.Series8.R8) {
        res.Series8.R8.forEach((i) => {
          p.series8.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: i.x, yAxis: i.y })
        })
      }

      res.Series3.forEach((i) => {
        if (i.exceptionInformation) {
          p.Series3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark, '异常信息': i.exceptionInformation })
        } else {
          p.Series3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
        }
        if (p.max1 < i.y) {
          p.max1 = i.y
        }
      })
      return p
    },
    initEcharts1() {
      const p = this.getLineData1()
      this.myEcharts.line = this.$echarts.init(this.$refs.line)
      const options = {
        grid: [
          {
            left: 70,
            // containLabel: true,
            bottom: '55%',
            right: 150,
            top: 10
          },
          {
            left: 70,
            // containLabel: true,
            top: '55%',
            bottom: 10,
            right: 150
          }
        ],
        axisPointer: {
          link: [
            {
              xAxisIndex: 'all'
            }
          ],
          label: {
            backgroundColor: '#777'
          }
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: "cross",
          // },
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          textStyle: {
            color: '#000'
          },
          formatter: function(params) {
            if (params[0].data.异常信息) {
              return '标准值: ' + params[0].value + '<br>平均值: ' + params[1].value + '<br>' +
                                    '日期：' + params[0].data.日期 + '</br>' +
                                    // '备注：' + params[0].data.备注 + '</br>' +
                                    '异常信息：' + params[0].data.异常信息
            } else {
              return '标准值: ' + params[0].value + '<br>平均值: ' + params[1].value + '<br>' +
                                    '日期：' + params[0].data.日期 + '</br>'
              // '备注：' + params[0].data.备注
            }
          }
        },
        legend: {
          show: false
        },
        xAxis: [
          { type: 'category', gridIndex: 0, data: p.axisX },
          { type: 'category', gridIndex: 1, data: p.axisX }
        ],
        yAxis: [
          {
            axisLine: {
              show: true
            },
            gridIndex: 0,
            max: p.max + 3,
            min: p.min - 3,
            type: 'value',
            splitLine: { show: false }
          },
          {
            gridIndex: 1,
            axisLine: {
              show: true
            },
            min: p.vLCLr,
            max: p.max1 + 3,
            type: 'value',
            splitLine: { show: false }
          }
        ],

        series: [
          {
            itemStyle: { normal: { label: { show: true }}},
            type: 'line',
            // p.LineSeries3,
            data: p.LineSeries3,
            // data: this.LineSeries3,
            value: p.xbar,
            // markLine,
            markLine: {
              silent: true,
              data: [
                {
                  name: '平均线',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '均值 ' + p.xbb
                  },
                  yAxis: String(),
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
                    formatter: '控制下限 ' + p.lcl
                  },
                  yAxis: p.lcl,
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
                    formatter: '控制上限 ' + p.ucl
                  },
                  yAxis: p.ucl,
                  lineStyle: {
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                },

                {
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '规格上限 ' + p.usl
                  },
                  yAxis: p.usl,
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
                    formatter: '规格下限 ' + p.lsl
                  },
                  yAxis: p.lsl,
                  lineStyle: {
                    color: '#4EB3D3' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                }
              ]
            },

            markPoint: {
              symbol: 'circle',
              symbolSize: 12,
              name: '异常值',
              data: p.series8
            }
            // data: [
            //   {
            //     value: 3.4,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   },
            //   {
            //     value: 4.5,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   },
            //   {
            //     value: 15,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   },
            //   {
            //     value: 43,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   }
            // ]
          },
          {
            itemStyle: { normal: { label: { show: true }}},
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            // markLine,
            data: p.Series3,
            markLine: {
              // silent: true,
              data: [
                {
                  name: '平均线',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '平均差值' + p.vab
                  },
                  yAxis: p.vab,
                  lineStyle: {
                    color: 'red' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                },
                {
                  name: 'vLCLr',
                  // symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '控制下限 ' + p.vLCLr
                  },
                  yAxis: p.vLCLr,
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
                    formatter: '控制上限 ' + p.vUCLr
                  },
                  yAxis: p.vUCLr,
                  lineStyle: {
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'
                  }
                }
              ]
            }
            // data: [
            //   {
            //     value: 3.4,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   },
            //   {
            //     value: 4.5,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   },
            //   {
            //     value: 15,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   },
            //   {
            //     value: 43,
            //     myData: '啦啦啦啦' // 传入数据，变量名自己定
            //   }
            // ]
          }
        ]
      }

      this.myEcharts.line.setOption(options)
    },
    initEcharts2() {
      // this.myEcharts.line2 = this.$echarts.init(this.$refs.line2)
      // const option = {
      //   grid: {
      //     left: 10,
      //     containLabel: true,
      //     bottom: 10,
      //     top: 10,
      //     right: 30
      //   },
      //   xAxis: {
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [
      //     {
      //       data: [150, 230, 224, 218, 135, 147, 260],
      //       type: 'line'
      //     }
      //   ]
      // }
      // this.myEcharts.line2.setOption(option)
    },
    initEcharts3() {
      // const p = this.getLineData1()
      // this.normx = []
      // this.normy = []
      // this.normzz = []
      // if (!res) {
      //   this.wsj = true
      //   return
      // }
      // if (!res.Series3 || !res.LineSeries3) {
      //   this.wsj = true
      //   return
      // } else {
      //   this.wsj = false
      // }
      const p = {
        normx: [],
        normy: [],
        normzz: []
      }
      const res = chartData.data
      res.Series5.forEach((i) => {
        p.normx.push(Number(i.x) + 1)
        p.normy.push(Number(i.y))
      })
      res.Series1.forEach((i) => {
        if (i.y > this.max) {
          p.max = i.y
        }
        p.normzz.push(i.y)
      })
      this.myEcharts.bar1 = this.$echarts.init(this.$refs.bar1)

      // const option = {
      //   grid: {
      //     left: 10,
      //     containLabel: true,
      //     bottom: 10,
      //     top: 10,
      //     right: 30
      //   },
      //   xAxis: {
      //     type: 'category',
      //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      //   },
      //   yAxis: {
      //     type: 'value'
      //   },
      //   series: [
      //     {
      //       data: [120, 200, 150, 80, 70, 110, 130],
      //       type: 'bar'
      //     }
      //   ]
      // }
      const options = {
        grid: {
          left: 10,
          containLabel: true,
          bottom: 10,
          top: 50,
          right: 30
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#C23531'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          // data: ['蒸发量', '平均温度']
          show: false
        },
        xAxis: [
          {
            interval: 1,
            type: 'value',
            data: p.normx,
            axisTick: {
              alignWithLabel: true
            },
            splitLine: { // 网格线
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            min: 0,
            max: p.max + 10,
            interval: 10,
            axisLabel: {
              formatter: '{value} '
            },
            splitLine: { // 网格线
              show: false
            }
          }
        ],
        series: [
          {
            type: 'line',
            markLine: {
              data: [{
                silent: false,
                lineStyle: { // 警戒线的样式  ，虚实  颜色
                  type: 'solid',
                  color: '#3398DB'
                },
                xAxis: 7.5
              }]
            }
          },
          {
            type: 'line',
            markLine: {
              data: [{
                silent: false,
                lineStyle: { // 警戒线的样式  ，虚实  颜色
                  type: 'solid',
                  color: '#3398DB'
                },
                xAxis: 15
              }]
            }
          },
          {
            type: 'line',
            markLine: {
              data: [{
                silent: false,
                lineStyle: { // 警戒线的样式  ，虚实  颜色
                  type: 'solid',
                  color: '#3398DB'
                },
                xAxis: 22.5
              }]
            }
          },
          {
            name: '',
            type: 'bar',
            data: p.normzz.map((item, index) => {
              return [index, item]
            })
          },
          {
            name: '',
            type: 'line',
            data: p.normy.map((item, index) => {
              return [index, item]
            })
          }
        ]
      }
      this.myEcharts.bar1.setOption(options)
    }

  }
}
