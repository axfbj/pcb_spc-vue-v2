
<template>
  <!-- <div ref="chart" style="width:100%;height:100%"> -->
  <el-row style="height:100%">
    <el-col :span="24" style="height:100%">
      <!-- <div ref="chart1" style="width:100%;height:calc(100% - 20px)" /> -->
      <div id="createChartImg" ref="createChartImg" style="height: calc(100% - 20px);">
        <div style="text-align: center; line-height: 24px;">
          <span style="font-size: 14px; color: #0c6dcd;font-weight: 500;">{{ inspectionRecordsData.customTitle || '' }} ({{ inspectionRecordsData.inspectionName || '' }})</span>
          <control-limit-status-info :control-limit-status="$route.query.controlLimitStatus" />
        </div>
        <div style="height: calc(100% - 24px);">
          <!-- <div ref="chart" style="width:100%;height:50%" /> -->
          <div ref="chart1" style="width:100%;height:100%" />
        </div>
      </div>
      <div style="text-align:center;font-size: 14px;">
        异常均值:<span style="margin-right:20px">{{ cl_label93 }}</span>
        LCL:<span style="margin-right:20px">{{ lcl_label99 }}</span>
        UCL:<span style="margin-right:20px">{{ ucl_label97 }}</span>
        <span><strong>NP图</strong></span>
      </div>
    </el-col>
  </el-row>
</template>
<script>
// Rb：<span style="margin-right:20px">{{ vab }}</span>
import chart_mixins from '../../mixins/chart-mixins'
export default {
  mixins: [chart_mixins],
  data() {
    return {
      lable100: '',
      lable93: '',
      lable97: '',
      axisX: [],
      target: '',
      // vpb: '',
      Series3: [],
      cl_label93: '',
      ucl_label97: '',
      lcl_label99: '',
      min1: 0,
      max1: 0,
      series9: []
    }
  },
  mounted() {

  },
  methods: {
    get_createChartImgDom() {
      return this.$refs.createChartImg
    },
    add_show(res) {
      this.npMychart = this.$echarts.init(this.$refs.chart1)
      // 默认初始化（清空）
      this.Series3 = []
      this.axisX = []
      this.lable100 = ''
      this.lable93 = ''
      this.lable97 = ''
      this.target = ''
      this.series9 = []

      // if(reslabel93)

      // 加入异常点
      res.Series9.forEach(item => {
        // console.log('i.', i)
        // this.series9.push({ itemStyle: { color: '#FF0000' }, name: '异常点', xAxis: item.x, yAxis: item.y })
        const isProcessed = this.processedData.some(processedItem => processedItem.id === item.inspectionRecordId)
        const abnormalPinit = { itemStyle: { color: '#FF0000' }, name: '异常点', coord: [parseInt(item.x), item.y], inspectionRecordId: item.inspectionRecordId }
        if (isProcessed) {
          abnormalPinit.name = '处理点'
          abnormalPinit.itemStyle.color = '#9932CC'
        }
        this.series9.push(abnormalPinit)
        // const has_exceptionInformation_point = this.Series3.find(i => item.inspectionRecordId === i.inspectionRecordId)
        // if (has_exceptionInformation_point) {
        //   has_exceptionInformation_point['异常信息'] = item.exceptionInformation
        // }
        // 浮框内信息，确认有是个异常点，并添加上异常信息
        // const has_exceptionInformation_point = this.LineSeries3.find(i => item.inspectionRecordId === i.inspectionRecordId)
        // if (has_exceptionInformation_point) {
        //   has_exceptionInformation_point['异常信息'] = item.exceptionInformation
        // }
        // this.LineSeries3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark || '', '异常信息': i.exceptionInformation })
      })

      // 赋值
      res.Series3.forEach((i) => {
        this.axisX.push(i.x)
        // this.Series3.push(i.y)
        // this.Series3.push({ 'value': i.y, '日期': i.tdate, '备注': i.remark, inspectionRecordId: i.inspectionRecordId })
        const r = { 'value': i.y, 'date': i.tdate, '备注': i.remark || '' }
        const has_exceptionInformation_point = res.Series9.filter(item => item.inspectionRecordId === i.inspectionRecordId)
        if (has_exceptionInformation_point.length > 0) {
          let str = ''
          has_exceptionInformation_point.forEach((item, index) => {
            str += item.exceptionInformation
            if (index !== has_exceptionInformation_point.length - 1) {
              str += '<br/>&emsp;&emsp;&emsp;&emsp;&emsp;'
            }
          })
          // r['异常信息'] = `<span style="color: red;">${str}</span>`
          r['异常信息'] = str
        }

        this.Series3.push(r)

        if (this.min1 > i.y) {
          this.min1 = i.y
        }

        if (this.max1 < i.y) {
          this.max1 = i.y
        }
      })

      this.lable93 = res.label93 // 均值
      this.lable100 = res.label100// 平均样本容量
      this.target = res.Series5[0].y

      this.cl_label93 = res.label93
      this.ucl_label97 = res.label97
      this.lcl_label99 = res.label99

      if (this.lcl_label99 < this.min1) {
        this.min1 = this.lcl_label99
      }

      if (this.ucl_label97 > this.max1) {
        this.max1 = this.ucl_label97
      }

      const min1 = this.min1
      const max1 = this.max1
      // alert(this.ucl_label97)
      // alert(min1)
      // alert(max1)
      // 移动极差（MR）图
      this.inspectionRecordPointsArr = []
      this.inspectionRecordPointsArr = this.Series3
      this.chartOption = {
        grid: {
          left: 70,
          // containLabel: true,
          bottom: 25,
          right: 120,
          top: 50
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(tt) {
            // return '异常个数：' + tt[0].data.value + '</br>' +
            //                     '日期：' + tt[0].data.日期 + '</br>' +
            //                     '备注：' + tt[0].data.备注
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
        legend: {
          show: true,
          data: ['控制限']
        },
        xAxis: {
          type: 'category',
          data: this.newAxisX
        },
        yAxis: {
          min: min1,
          max: max1,
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
            data: this.Series3,
            type: 'line',
            // smooth: true, // 曲线有弧度
            symbol: 'circle',
            label: {
              show: true,
              position: 'top'
            },
            symbolSize: 6,
            markPoint: {
              name: '异常值',
              symbol: 'circle',
              symbolSize: 10,
              data: this.series9
            }
          },
          {
            name: '控制限',
            type: 'line',
            symbol: 'line',
            // smooth: true,
            lineStyle: {
              color: '#FFD700'
            },
            markLine: {
              symbol: 'none',
              silent: true,
              data: [
                {
                  name: 'cl_label93',
                  // symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '异常均值 ' + this.cl_label93
                  },
                  yAxis: this.cl_label93,
                  lineStyle: {
                    color: '#FFD700' // 这儿设置安全基线颜色

                  }
                },
                {
                  name: 'ucl_lable97',
                  // symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    // formatter: 'USL ' + this.ucl_label97
                    formatter: '控制上限 ' + this.ucl_label97
                  },
                  yAxis: this.ucl_label97,
                  lineStyle: {
                    type: 'solid',
                    color: '#FFD700' // 这儿设置安全基线颜色
                  }
                },
                {
                  name: 'lcl_label99',
                  symbol: 'none',
                  label: {
                    show: true,
                    position: 'end',
                    formatter: '控制下限 ' + this.lcl_label99
                  },
                  yAxis: this.lcl_label99,
                  lineStyle: {
                    type: 'solid',
                    color: '#FFD700' // 这儿设置安全基线颜色
                  }
                }
              ]
            }
          }
        ]
      }
      this.addChartOptionInitSytle()
      this.npMychart.setOption(this.chartOption)
      this.charts = []
      this.charts.push(this.npMychart)
      this.click_point(this.charts)
      return this.npMychart
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
