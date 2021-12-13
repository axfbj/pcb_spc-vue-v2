import chartData from './data'
export default {
  methods: {
    getLineData1() {
      console.log()
      const res = chartData.data
      const decimal = 2

      // this.usl = res.USL.toFixed(2)
      // this.lsl = res.LSL.toFixed(2)
      // this.sl = Number(res.target).toFixed(2)
      // this.ucl = res.vUCLx.toFixed(2)
      // this.lcl = res.vLCLx.toFixed(2)
      // this.xbb = res.vxbb.toFixed(2)
      // this.min = this.lsl
      // this.max = this.usl
      // this.vUCLr = res.vUCLr.toFixed(2)
      // this.max1 = res.vUCLr.toFixed(2)
      // this.vLCLr = res.vLCLr.toFixed(2)
      // this.vab = res.Series11[0].y.toFixed(2)
      // res.LineSeries3.forEach((i) => {
      //   if (i.exceptionInformation) {
      //     this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark, '异常信息': i.exceptionInformation })
      //   } else {
      //     this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
      //   }
      //   // const aaa = i.tdate.split(' ')[0]
      //   this.axisX.push(i.x)
      //   this.xbar.push(i.y)
      //   if (i.y < this.min) {
      //     this.min = i.y
      //   }
      //   if (i.y > this.max) {
      //     this.max = i.y
      //   }
      // })

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

      // const usl = Number(res.label83).toFixed(2)
      // const lsl = Number(res.label85).toFixed(2)
      // const sl = Number(res.label93).toFixed(2)
      // const ucl = Number(res.label87).toFixed(2)
      // const lcl = Number(res.label89).toFixed(2)
      // const xbb = Number(res.label81).toFixed(2)

      return p
    },
    initEcharts1() {
      const p = this.getLineData1()
      console.log(p)
      this.myEcharts.line = this.$echarts.init(this.$refs.line)
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
      // const markLine = {
      //   data: [
      //     { type: 'average', name: 'Avg' },
      //     [
      //       {
      //         symbol: 'none',
      //         x: '90%',
      //         yAxis: 'max'
      //       },
      //       {
      //         symbol: 'circle',
      //         label: {
      //           position: 'start',
      //           formatter: 'Max'
      //         },
      //         type: 'max',
      //         name: '最高点'
      //       }
      //     ]
      //   ]
      // }
      const options = {
        grid: [
          {
            left: 10,
            containLabel: true,
            bottom: '52%',
            right: 100,
            top: 10
          },
          {
            left: 10,
            containLabel: true,
            top: '52%',
            bottom: 10,
            right: 100
          }
        ],
        // grid: [{ bottom: '55%' }, { top: '55%' }],
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
          // formatter: function(params) {
          //   // console.log('params', params)

          //   return '标准值: ' + params[0].value + '<br>平均值: ' + params[1].value + '<br>样本值: ' + params[1].data.myData
          // }
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
            // yAxis.. show = true
            // data: [1, 3, 5],
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

          // {
          //   gridIndex: 0,
          //   max: p.max + 3,
          //   min: p.min - 3,
          //   type: 'category',
          //   splitLine: { show: false }
          // },
          // {
          //   gridIndex: 1,
          //   min: p.vLCLr,
          //   max: p.max1 + 3,
          //   type: 'category',
          //   splitLine: { show: false }
          // }
        ],

        series: [
          {
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
      this.myEcharts.bar1 = this.$echarts.init(this.$refs.bar1)
      const option = {
        grid: {
          left: 10,
          containLabel: true,
          bottom: 10,
          top: 10,
          right: 30
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      }
      this.myEcharts.bar1.setOption(option)
    }

  }
}
