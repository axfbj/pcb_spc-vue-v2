
<template>
  <!-- <div ref="chart" style="width:100%;height:100%"> -->
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <div ref="chart1" style="width:100%;height:calc(100% - 20px)" />
      <div style="text-align:center">
        异常均值:<span style="margin-right:20px">{{ lable93 }}</span>
        <span><strong>NP图</strong></span>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// Rb：<span style="margin-right:20px">{{ vab }}</span>
export default {
  data() {
    return {
      lable100: '',
      lable93: '',
      axisX: [],
      target: '',
      // vpb: '',
      Series3: []
    }
  },
  mounted() {

  },
  methods: {
    add_show5(res) {
      this.npMychart = this.$echarts.init(this.$refs.chart1)
      // 默认初始化（清空）
      this.Series3 = []
      this.axisX = []
      this.lable100 = ''
      this.lable93 = ''
      this.target = ''
      // 赋值
      res.Series3.forEach((i) => {
        this.axisX.push(i.x)
        // this.Series3.push(i.y)
        this.Series3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark })
      })
      this.lable93 = res.label93 // 均值
      this.lable100 = res.label100// 平均样本容量
      this.target = res.Series5[0].y

      // 移动极差（MR）图
      this.npMychart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            return '异常个数：' + tt[0].data.value + '</br>' +
                                '日期：' + tt[0].data.日期 + '</br>' +
                                '备注：' + tt[0].data.备注
          }
        },
        legend: { show: true },
        xAxis: {
          type: 'category',
          data: this.axisX
        },
        yAxis: {
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
                  name: 'lable93',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '异常均值 ' + this.lable93
                  },
                  yAxis: this.lable93,
                  lineStyle: {
                    color: 'green' // 这儿设置安全基线颜色
                    // type: 'solid'/
                  }
                }
              ]
            }
          }
          // {
          //   type: 'line',
          //   smooth: true, // 平滑曲线
          //   markLine: {
          //     silent: true,
          //     lineStyle: {
          //       normal: {
          //         color: '#01fef9' // 这儿设置安全基线颜色
          //       }
          //     },
          //     data: [{
          //       yAxis: this.lable93
          //     }],
          //     label: {
          //       normal: {
          //         formatter: '均值 ' + this.lable93 // 这儿设置安全基线
          //       }
          //     }
          //   }
          // },
          // {
          //   type: 'line',
          //   smooth: true, // 平滑曲线
          //   markLine: {
          //     silent: true,
          //     lineStyle: {
          //       normal: {
          //         color: '#01fef9' // 这儿设置安全基线颜色
          //       }
          //     },
          //     data: [{
          //       yAxis: this.target
          //     }],
          //     label: {
          //       normal: {
          //         formatter: '目标值 ' + this.target // 这儿设置安全基线
          //       }
          //     }
          //   }
          // },
          // {
          //   data: this.Series3,
          //   type: 'line'
          // }
        ]
      })

      return this.npMychart
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
