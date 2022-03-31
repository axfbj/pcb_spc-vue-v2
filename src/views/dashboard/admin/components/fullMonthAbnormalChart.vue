<template>
  <div class="main">
    <el-row>
      <div class="month-input">
        <el-date-picker
          v-model="month"
          type="month"
          placeholder="选择月份"
          :picker-options="{disabledDate:disabledDate}"
          style="width: 140px;"
          @change="month_change"
        />
      </div>

      <ki-button v-permission="['control.target.list']" @click="setting_target_dialog_btn">设置目标值</ki-button>

    </el-row>
    <div ref="chart" :style="{width:'100%',height:'300px'}" />

    <setting-target-dialog
      :visible="setting_target_dialog"
      @handleClose="setting_target_dialog_close"
      @confirm="setting_target_dialog_confirm"
    />
  </div>
</template>

<script>

import resize from './mixins/resize'
import toggleMoth from './mixins/toggleMonth'
import settingTargetDialog from './setting-target-dialog'
import setting_target_dialog from './mixins/setting-target-dialog'
// import settingTargetDialog from './mixins/setting-target-dialog'
export default {
  components: {
    settingTargetDialog
  },
  mixins: [resize, toggleMoth, setting_target_dialog],
  props: {
    className: {
      type: String,
      default: 'chart'
    }
  },
  data() {
    return {
      month: Date.now(),
      chart: null
    }
  },

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
    async setChart(date) {
      const p = {
        beginOfMonth: date
      }
      // showLoading遮盖层显示
      this.chart.showLoading({
        text: '数据正在加载...',
        textStyle: { fontSize: 30, color: '#444' }
        // effectOption: { backgroundColor: 'rgba(0, 0, 0, 0)' }
      })
      const { code, data } = await this.$api.dashboard_getPageByDate(p)
      if (code === '200' && data) {
        const { dates, abnormalRates, abnormalNums, inspectionRecordNums, targetValue } = data
        this.initChart({ dates, abnormalRates, abnormalNums, inspectionRecordNums, targetValue })
      }
      // showLoading遮盖层隐藏
      this.chart.hideLoading()
    },
    initChart({ dates, abnormalRates, abnormalNums, inspectionRecordNums, targetValue }) {
      const option = {
        grid: {
          left: 70,
          // containLabel: true,
          bottom: 55,
          right: 120,
          top: 50
        },
        title: {
          left: 'center',
          text: 'SPC异常率监控'
          // textStyle: {
          //   fontWeight: 'normal'
          // }
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'cross',
          //   crossStyle: {
          //     color: '#999'
          //   }
          // },
          formatter(params) {
            const { name, dataIndex } = params[0]
            let str0 = ''
            let str1 = ''
            let inspectionRecordStr = ''
            {
              const marker = `<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:blue;\"></span>`
              const value = inspectionRecordNums[dataIndex]
              const seriesName = '检验数目'
              inspectionRecordStr = `${marker}${seriesName} ${value}`
            }
            {
              const { marker, value, seriesName } = params[0]
              str0 += `${marker}${seriesName} ${value}`
            }
            {
              const { marker, value, seriesName } = params[1]
              str1 += `${marker}${seriesName} ${value}%`
            }
            return `${name}<br>
              ${inspectionRecordStr}<br>
              ${str0}<br>
              ${str1}
            `
          }
        },
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        legend: {
          right: 140,
          data: ['异常数', '异常率']
        },
        xAxis: [
          {
            type: 'category',
            data: dates,
            axisLabel: {
              interval: 0,
              rotate: 40
            },
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '异常数',
            // interval: 50,
            axisLabel: {
              formatter: '{value} '
            }
          },
          {
            type: 'value',
            name: '异常率',
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '异常数',
            type: 'bar',
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#83bff6' },
                { offset: 0.5, color: '#188df0' },
                { offset: 1, color: '#188df0' }
              ])
            },
            tooltip: {
              valueFormatter: function(value) {
                return value + ' '
              }
            },
            data: abnormalNums
          },
          {
            name: '异常率',
            type: 'line',
            yAxisIndex: 1,
            lineStyle: {
              color: '#ffc405'
            },
            label: {
              show: true,
              formatter: '{c} %'
            },
            itemStyle: {
              color: '#ffc405'
            },
            tooltip: {
              valueFormatter: function(value) {
                return value + ' %'
              }
            },
            data: abnormalRates
          }
        ]
      }
      if (targetValue !== null) {
        let max = Math.max(...abnormalRates)
        if (targetValue > max) {
          max = targetValue
          option.yAxis[1].max = max
        }

        option.series[1].markLine = {
          symbol: 'none',
          silent: true,
          data: [
            {
              name: 'target',
              symbol: 'none',
              label: {
                show: true,
                position: 'end',
                formatter: 'target ' + targetValue + '%'
              },
              yAxis: targetValue,
              lineStyle: {
                color: '#F56C6C', // 这儿设置安全基线颜色
                type: 'solid'
              }
            }
          ]
        }
      }

      this.chart.setOption(option, true)
    }
  }
}
</script>
<style lang="scss" scoped>
.main {
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;
  .month-input {
    position: absolute;
    top: 0;
    left: 120px;
    z-index: 2;
  }
}
// .month-input {

// }
</style>
