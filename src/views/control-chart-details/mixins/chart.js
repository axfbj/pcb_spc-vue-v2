export default {
  methods: {
    initEcharts() {
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
      const markLine = {
        data: [
          { type: 'average', name: 'Avg' },
          [
            {
              symbol: 'none',
              x: '90%',
              yAxis: 'max'
            },
            {
              symbol: 'circle',
              label: {
                position: 'start',
                formatter: 'Max'
              },
              type: 'max',
              name: '最高点'
            }
          ]
        ]
      }
      const options = {
        grid: [
          {
            left: 10,
            containLabel: true,
            bottom: '52%',
            right: 30,
            top: 10
          },
          {
            left: 10,
            containLabel: true,
            top: '52%',
            bottom: 10,
            right: 30
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
            // console.log('params', params)

            return '样本值: ' + params[0].value + '<br>平均值: ' + params[1].value + '<br>样本值: ' + params[1].data.myData
          }
        },
        legend: {
          show: false
        },
        xAxis: [
          { type: 'category', gridIndex: 0 },
          { type: 'category', gridIndex: 1 }
        ],
        yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],

        series: [
          {
            type: 'line',
            markLine,
            data: [
              {
                value: 3.4,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              },
              {
                value: 4.5,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              },
              {
                value: 15,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              },
              {
                value: 43,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              }
              // ...[3.4, 4.5, 15, 43],
              // [4.2, 2.3, 20, 91],
              // [10.8, 9.5, 30, 18],
              // [7.2, 8.8, 18, 57],
            ]
          },
          {
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            markLine,
            data: [
              {
                value: 3.4,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              },
              {
                value: 4.5,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              },
              {
                value: 15,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              },
              {
                value: 43,
                myData: '啦啦啦啦' // 传入数据，变量名自己定
              }
              // ...[3.4, 4.5, 15, 43],
              // [4.2, 2.3, 20, 91],
              // [10.8, 9.5, 30, 18],
              // [7.2, 8.8, 18, 57],
            ]
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
