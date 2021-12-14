
<template>
  <!-- <div ref="chart" style="width:100%;height:100%"> -->
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <div ref="chart1" style="width:100%;height:calc(100% - 20px)" />
      <div style="text-align:center">
        均值:<span style="margin-right:20px">{{ label93 }}</span>
        <span><strong>P图</strong></span>
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
      axisX: [],
      target: '',
      vpb: '',
      Series3: [],
      label93: '',
      label93s: 0
    }
  },
  mounted() {

  },
  methods: {
    add_show4(res) {
      this.pMychart = echarts.init(this.$refs.chart1)
      // 默认初始化（清空）
      this.axisX = []
      this.target = ''
      this.vpb = ''
      this.Series3 = []
      this.label93 = ''
      // toFixed(2)
      // 赋值
      res.Series3.forEach((i) => {
        this.axisX.push(i.x)
        const ad = (i.y * 100).toFixed(2)
        this.Series3.push({ 'value': ad, '日期': i.tdate, '备注': i.remark })
      })
      this.label93 = res.label93
      this.label93s = this.label93.substring(0, this.label93.lastIndexOf('%'))// 截取百分号之前的所有字段
      this.vpb = res.Series1[0].y
      this.target = res.Series5[0].y
      // 移动极差（MR）图
      this.pMychart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            return '异常率：' + tt[0].data.value + '%' + '</br>' +
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
          name: '%',
          splitLine: { show: false }
        },
        series: [
          {
            type: 'line',
            smooth: true, // 平滑曲线
            markLine: {
              silent: true,
              lineStyle: {
                normal: {
                  color: 'green' // 这儿设置安全基线颜色
                }
              },
              data: [{
                yAxis: this.label93s
              }],
              label: {
                normal: {
                  formatter: '均值 ' + this.label93 // 这儿设置安全基线
                }
              }
            }
          },
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
          {
            data: this.Series3,
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: '{c}%'
              }
            }

          }]
      })
      return this.pMychart
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
