<template>
  <el-row style="height: 100%;width:100%;">
    <el-col v-if="wsj!==true" :span="12" style="height:100%">
      <div ref="chart" style="height: 100%;width:100%;" />
    </el-col>
    <el-col v-if="wsj!==true" :span="12" style="height:100%">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-card class="box-card">
            <el-descriptions title="一般" direction="horizontal" :column="2">
              <el-descriptions-item label="样本数">{{ arr.label59 }}</el-descriptions-item>
              <el-descriptions-item label="子组容量">{{ arr.subgroupSize }}</el-descriptions-item>
              <el-descriptions-item label="目标值">{{ arr.target }}</el-descriptions-item>
              <el-descriptions-item label="均值">{{ arr.label67 }}</el-descriptions-item>
              <el-descriptions-item label="USL">{{ arr.USL }}</el-descriptions-item>
              <el-descriptions-item label="LSL">{{ arr.LSL }}</el-descriptions-item>
              <el-descriptions-item label="Tol">{{ arr.Tol }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="8">
          <!-- <div style="height: 100%;">
              <div style="height: 100%; width:50%;float:left;">
                <div ref="bar1" class="bar" style="width:100%;height:100%;min-height: 50px;" />
              </div>
              <div style="height: 100%; width:50%;float:left;">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-card class="box-card">
                      <el-descriptions title="一般" direction="horizontal" :column="2">
                        <el-descriptions-item label="样本数">{{ arr.label59 }}</el-descriptions-item>
                        <el-descriptions-item label="子组容量">{{ arr.subgroupSize }}</el-descriptions-item>
                        <el-descriptions-item label="目标值">{{ arr.target }}</el-descriptions-item>
                        <el-descriptions-item label="均值">{{ arr.label67 }}</el-descriptions-item>
                        <el-descriptions-item label="USL">{{ arr.USL }}</el-descriptions-item>
                        <el-descriptions-item label="LSL">{{ arr.LSL }}</el-descriptions-item>
                        <el-descriptions-item label="Tol">{{ arr.Tol }}</el-descriptions-item>
                      </el-descriptions>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="box-card">
                      <el-descriptions title="能力" direction="horizontal" :column="2">
                        <el-descriptions-item label="Cr">{{ arr.Cr }}</el-descriptions-item>
                        <el-descriptions-item label="Cp">{{ arr.Cp }}</el-descriptions-item>
                        <el-descriptions-item label="Cpk">{{ arr.Cpk }}</el-descriptions-item>
                        <el-descriptions-item label="Z(usl)">{{ arr.Zusl }}</el-descriptions-item>
                        <el-descriptions-item label="Z(lsl)">{{ arr.Zlsl }}</el-descriptions-item>
                        <el-descriptions-item label="Cpl">{{ arr.Cpl }}</el-descriptions-item>
                        <el-descriptions-item label="Tol">{{ arr.Tol }}</el-descriptions-item>
                        <el-descriptions-item label="Cpu">{{ arr.Cpu }}</el-descriptions-item>
                        <el-descriptions-item label="Cpm">{{ arr.Cpm }}</el-descriptions-item>
                        <el-descriptions-item label="Pr">{{ arr.Pr }}</el-descriptions-item>
                        <el-descriptions-item label="Pp">{{ arr.Pp }}</el-descriptions-item>
                        <el-descriptions-item label="Ppk">{{ arr.Ppk }}</el-descriptions-item>
                      </el-descriptions>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="box-card">
                      <el-descriptions title="变差" direction="horizontal" :column="2">
                        <el-descriptions-item label="Std Dev">{{ arr.std_dev }}</el-descriptions-item>
                        <el-descriptions-item label="Max">{{ arr.Max }}</el-descriptions-item>
                        <el-descriptions-item label="Min">{{ arr.Min }}</el-descriptions-item>
                        <el-descriptions-item label="Range">{{ arr.Range }}</el-descriptions-item>
                        <el-descriptions-item label="R-bar">{{ arr.r_bar }}</el-descriptions-item>
                        <el-descriptions-item label="LSL">{{ arr.LSL }}</el-descriptions-item>
                        <el-descriptions-item label="Tol">{{ arr.Tol }}</el-descriptions-item>
                        <el-descriptions-item label="S(est)">{{ arr.est }}</el-descriptions-item>
                      </el-descriptions>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
            </div> -->
          <el-card class="box-card">
            <el-descriptions title="能力" direction="horizontal" :column="2">
              <el-descriptions-item label="Cr">{{ arr.Cr }}</el-descriptions-item>
              <el-descriptions-item label="Cp">{{ arr.Cp }}</el-descriptions-item>
              <el-descriptions-item label="Cpk">{{ arr.Cpk }}</el-descriptions-item>
              <el-descriptions-item label="Z(usl)">{{ arr.Zusl }}</el-descriptions-item>
              <el-descriptions-item label="Z(lsl)">{{ arr.Zlsl }}</el-descriptions-item>
              <el-descriptions-item label="Cpl">{{ arr.Cpl }}</el-descriptions-item>
              <el-descriptions-item label="Tol">{{ arr.Tol }}</el-descriptions-item>
              <el-descriptions-item label="Cpu">{{ arr.Cpu }}</el-descriptions-item>
              <el-descriptions-item label="Cpm">{{ arr.Cpm }}</el-descriptions-item>
              <el-descriptions-item label="Pr">{{ arr.Pr }}</el-descriptions-item>
              <el-descriptions-item label="Pp">{{ arr.Pp }}</el-descriptions-item>
              <el-descriptions-item label="Ppk">{{ arr.Ppk }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="box-card">
            <el-descriptions title="变差" direction="horizontal" :column="2">
              <el-descriptions-item label="Std Dev">{{ arr.std_dev }}</el-descriptions-item>
              <el-descriptions-item label="Max">{{ arr.Max }}</el-descriptions-item>
              <el-descriptions-item label="Min">{{ arr.Min }}</el-descriptions-item>
              <el-descriptions-item label="Range">{{ arr.Range }}</el-descriptions-item>
              <el-descriptions-item label="R-bar">{{ arr.r_bar }}</el-descriptions-item>
              <el-descriptions-item label="LSL">{{ arr.LSL }}</el-descriptions-item>
              <el-descriptions-item label="Tol">{{ arr.Tol }}</el-descriptions-item>
              <el-descriptions-item label="S(est)">{{ arr.est }}</el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-else :span="24" style="height:100%">
      <aa ref="aa" :receipt-show="true" />
    </el-col>
  </el-row>
</template>

<script>
const echarts = require('echarts/lib/echarts') // 引入柱状图组件

export default {
  name: 'Add',
  data() {
    return {
      wsj: false,
      myChart: null,
      normx: [], // X轴
      normy: [], // 折线
      normzz: [], // 柱子
      max: 0,
      arr: {
        label59: '',
        subgroupSize: '',
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
        Range: '',
        r_bar: '',
        est: '',
        target: '',
        label67: ''
      }
    }
  },
  mounted() {

  },
  methods: {
    add_show1(res) {
      // console.log(res)
      this.arr.label59 = res.label59
      this.arr.subgroupSize = res.label59
      this.arr.USL = res.USL
      this.arr.LSL = res.LSL
      this.arr.Tol = res['USL-LSL']
      this.arr.Cr = res.vCR
      this.arr.Cp = res.vCp
      this.arr.Cpk = res.vCPK
      this.arr.Zusl = res.vZusl
      this.arr.Zlsl = res.vZlsl
      this.arr.Cpl = res.vCPL
      this.arr.Cpu = res.vCPU
      this.arr.Cpm = res.vCpm
      this.arr.Pr = res.vPR
      this.arr.Pp = res.vPp
      this.arr.Ppk = res.vPpk
      this.arr.std_dev = res.vs0
      this.arr.Max = res.umax
      this.arr.Min = res.umin
      this.arr.Range = res['umax-umin']
      this.arr.r_bar = res.label73
      this.arr.est = res.vs
      this.arr.target = res.target
      this.arr.label67 = res.label67

      this.myChart = echarts.init(this.$refs.chart)
      this.normx = []
      this.normy = []
      this.normzz = []
      if (!res) {
        this.wsj = true
        return
      }
      if (!res.Series3 || !res.LineSeries3) {
        this.wsj = true
        return
      } else {
        this.wsj = false
      }
      res.Series5.forEach((i) => {
        this.normx.push(Number(i.x) + 1)
        this.normy.push(Number(i.y))
      })
      res.Series1.forEach((i) => {
        if (i.y > this.max) {
          this.max = i.y
        }
        this.normzz.push(i.y)
      })

      // console.log('this.normx', this.normx)
      // console.log('this.normy', this.normy)
      // console.log('this.normzz', this.normzz)
      const option = {
        grid:
          {
            left: 70,
            // containLabel: true,
            bottom: 25,
            right: 70,
            top: 30
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
        // toolbox: {
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        xAxis: [
          {
            interval: 1,
            type: 'value',
            data: this.normx,
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
            boundaryGap: [0, '10%'],
            // max: this.max + 10,
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
              data: [
                {
                  silent: false,
                  lineStyle: { // 警戒线的样式  ，虚实  颜色
                    type: 'solid',
                    color: '#3398DB'
                  },
                  xAxis: 7.5
                  // coord: ['6', 0]
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
            data: this.normzz.map((item, index) => {
              return [index + 1, item]
            })
          },
          {
            name: '',
            type: 'line',
            data: this.normy.map((item, index) => {
              return [index + 1, item]
            })
          }
        ]
      }
      this.myChart.setOption(option, true)
      return this.myChart
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
