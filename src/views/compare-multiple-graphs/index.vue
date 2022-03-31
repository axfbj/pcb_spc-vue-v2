<template>
  <container-layout :after-calc="chart_resize">
    <template v-slot:custum_content>
      <div style="float: left; height: 100%;width: 15%;border-right: 1px solid #ccc;">
        <div style="padding: 8px 8px;">
          <div style="margin: 10px 0;" />
          <el-form ref="form" :model="form">
            <el-form-item style="margin-right: 20px;" label="数据点数量:">
              <allow-create-select
                v-model="form.inspectionNum"
                style="width:100%;height: 28px;"
                :options="[
                  {
                    value:50,
                    label:50
                  },
                  {
                    value:100,
                    label:100
                  }
                ]"
                @change="num_change"
              />
            </el-form-item>
          </el-form>
          <el-checkbox-group v-model="checkboxValue">
            <el-checkbox v-for="row in params" :key="row.id" :label="row.id">{{ row.id }}</el-checkbox>
          </el-checkbox-group>
          <!-- <el-form label-width="auto" inline :model="form">
            <el-form-item style="margin-right: 20px;">
            </el-form-item>
          </el-form> -->
          <ki-button type="primary" style="width: 100%; margin: 10px 0;" @click="compareResult_dialog_btn">比较</ki-button>
        </div>
      </div>
      <div style="float: left; height: 100%;width: 85%; overflow: auto;">
        <div v-for="(row,index) in params" :key="row.id" style="height: 50%;width: 100%; border-bottom: 1px solid #ccc;">
          <xbarr v-if="row.controlChartType === 'Xbar-R'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
          <xbars v-else-if="row.controlChartType === 'Xbar-s'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
          <xbarmr v-else-if="row.controlChartType === 'X-MR'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
          <pchart v-else-if="row.controlChartType === 'p'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
          <npchart v-else-if="row.controlChartType === 'np'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
          <cchart v-else-if="row.controlChartType === 'c'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
          <uchart v-else-if="row.controlChartType === 'u'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
          <ychart v-else-if="row.controlChartType === 'y'" :ref="`chart_${index}`" style="height: 100%;width:100%;" :inspection-records-data="inspectionRecords_data[`data${index}`]" />
        </div>
      </div>
    </template>
    <!-- :params="params" -->
    <compare-result-dialog
      :visible="compareResult_dialog"
      :compare-chart-ids="checkboxValue"
      @handleClose="compareResult_dialog_close"
      @confirm="compareResult_dialog_confirm"
    />
  </container-layout>
</template>

<script>
import xbarr from '../control-chart-details/./components/chart/xbarr'
import xbars from '../control-chart-details/components/chart/xbars'
import xbarmr from '../control-chart-details/components/chart/xbarmr'
import pchart from '../control-chart-details/components/chart/pchart'
import npchart from '../control-chart-details/components/chart/npchart'
import cchart from '../control-chart-details/components/chart/cchart'
import uchart from '../control-chart-details/components/chart/uchart'
import ychart from '../control-chart-details/components/chart/ychart'

import compareResultDialog from './components/compare-result-dialog'
import compare_result_dialog from './mixins/compare-result-dialog'
import { AllowCreateSelect } from '@/components/form-item'
// import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'CompareMultipleGraphs',
  components: {
    AllowCreateSelect,
    xbarr,
    xbars,
    xbarmr,
    pchart,
    npchart,
    cchart,
    uchart,
    ychart,
    compareResultDialog
  },
  mixins: [compare_result_dialog],
  data() {
    return {
      myEcharts: [],
      controlChartType: 1,
      digit: 0,
      params: [],
      inspectionRecords_data: {}, // customTitle inspectionName
      form: {
        date: [],
        inspectionNum: 30
      }
    //   chartData: {}
    }
  },
  computed: {
    ...mapGetters(['commonVariable'])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.params = vm.$store.state.compareMultipleGraphs.rows || []
      vm.checkboxValue = []
      vm.set_data()
    })
  },
  methods: {
    chart_resize() {
      this.$nextTick(() => {
        for (let i = 0; i < this.myEcharts.length; i++) {
          this.myEcharts[i].resize()
        }
      })
    },
    num_change(val) {
      if (val < 1) {
        this.$message.warning('请输入数据点数量')
        return
      }
      this.set_data()
    },
    async set_data() {
      const arr = []
      for (let i = 0; i < this.params.length; i++) {
        const row = this.params[i]
        const controlChartSonId = row.id
        const dataType = '1'
        const chartTypeNum = this.commonVariable['parseChartType'][row.controlChartType]
        this.inspectionRecords_data[`data${i}`] = {
          customTitle: row.customTitle,
          inspectionName: row.inspectionName
        }

        const r = await this.get_controlChartSon_data({
          controlChartSonId,
          dataType,
          chartTypeNum
        })
        arr.push(r)
      }

      this.$nextTick(() => {
        this.myEcharts.forEach(chart => {
          !chart.isDisposed() && chart.dispose()
        })
        this.myEcharts = []
        Promise.all(arr).then(res => {
          res.forEach((r, index) => {
            if (r.code && r.data) {
              const chart = this.$refs[`chart_${index}`][0].add_show(r.data)
              if (Array.isArray(chart)) {
                this.myEcharts.push(...chart)
              } else {
                this.myEcharts.push(chart)
              }
            }
          })
        })
      })
    },
    get_controlChartSon_data({ controlChartSonId, dataType, chartTypeNum }) {
      const param = {
        'controlChartSonId': controlChartSonId,
        'controlChartType': chartTypeNum,
        'dataType': dataType || '',
        'inspectionNum': this.form.inspectionNum || ''
      }
      return this.$api.controlChartSon_data(param)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
