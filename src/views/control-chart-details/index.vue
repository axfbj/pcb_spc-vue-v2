<template>
  <container-layout footer-height="50%" adjustable-height :after-calc="chart_resize" class="chart-details">
    <!-- 按钮组 -->
    <template v-slot:btns>
      <div>
        <div style="line-height: normal; padding-top: 5px; float: left;">
          <el-form :inline="true">
            <el-form-item label="显示范围:" style="margin: 0;">
              <el-select v-model="form.dataType" placeholder="请选择" style="width: 100px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            &nbsp;
            <el-form-item label="从" style="margin: 0;">
              <el-date-picker
                v-model="form.date"
                type="datetimerange"
                range-separator="到"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
            <el-form-item style="margin: 0 10px;">
              <ki-button
                v-permission="['inspectionRecord.list']"
                type="primary"
                icon="el-icon-search"
                @click="query"
              >查询</ki-button>
            </el-form-item>
            <el-form-item style="margin: 0 10px;">
              <ki-button
                type="primary"
                @click="states_re"
              >重置状态</ki-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="text-align: right;" class="right-buttonGroup">
          <ki-button type="primary" @click="filter_options_btn">过滤</ki-button>
          <ki-button type="primary" @click="chart_setting_dialog_btn">设置</ki-button>
          <ki-message-box
            v-permission="['inspectionRecord.delete']"
            :next="del"
            @click="del_btn"
          >
            <ki-button
              type="danger"
              style="margin: 0 10px;"
            >删除</ki-button>
          </ki-message-box>

          <el-dropdown>
            <el-button type="primary">
              导入相关<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-permission="['inspectionRecord.save']" @click.native="excel_import_dialog_btn2">excel指定项导入</el-dropdown-item>
              <el-dropdown-item v-permission="['inspectionRecord.save']" @click.native="excel_import_dialog_btn">导入数据</el-dropdown-item>
              <el-dropdown-item @click.native="download_template">下载模板</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!-- <ki-button v-permission="['inspectionRecord.save']" type="primary" @click="excel_import_dialog_btn">导入数据</ki-button>
          <ki-button v-permission="['inspectionRecord.save']" type="primary" @click="excel_import_dialog_btn2">excel指定项导入</ki-button>
          <ki-button type="primary" @click="download_template">下载模板</ki-button> -->
          <ki-button v-permission="['excel.inspectionRecordExcel']" style="margin-left: 10px;" type="primary" @click="export_inspection">导出</ki-button>
        </div>
      </div>
    </template>

    <template v-slot:custum_content>
      <div style="height: 100%;" class="chart-area">
        <el-tabs v-model="activeName" tab-position="bottom" style="height: 100%" type="card" @tab-click="handleClick">
          <el-tab-pane label="控制图" name="line">
            <div ref="saveContent" style="height: 100%;width:100%;">
              <div style="height: 100%;width:100%;">
                <xbarr
                  v-if="controlChartType === 'Xbar-R'"
                  ref="xbarr"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
                <xbars
                  v-if="controlChartType === 'Xbar-s'"
                  ref="xbars"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
                <xbarmr
                  v-if="controlChartType === 'X-MR'"
                  ref="xbarmr"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
                <pchart
                  v-if="controlChartType === 'p'"
                  ref="pchart"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
                <npchart
                  v-if="controlChartType === 'np'"
                  ref="npchart"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
                <cchart
                  v-if="controlChartType === 'c'"
                  ref="cchart"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
                <uchart
                  v-if="controlChartType === 'u'"
                  ref="uchart"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
                <ychart
                  v-if="controlChartType === 'y'"
                  ref="ychart"
                  style="height: 100%;width:100%;"
                  :digit="digit"
                  :inspection-records-data="inspectionRecords_data"
                  :axis-x-flag="axisXFlag"
                  :date-format-flag="dateFormatFlag"
                  :toogle-setting="toogleSetting"
                />
              </div>
            </div>
            <!-- 控制图 -->
          </el-tab-pane>
          <!-- <el-tab-pane v-if="controlChartType === 'Xbar-R'" label="正态分布图" name="bar"> -->
          <el-tab-pane v-if="!count_graph.includes(controlChartType)" label="正态分布图" name="bar">
            <normal ref="normal" style="height: 100%;width:100%;" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>

    <template v-slot:footer>
      <div v-loading="footer_loading" style="position: relative;height: 100%;">
        <div style="position: absolute;top:0; left:0; width: 100%; height: 38px;z-index: 2;">
          <div style="float: left;">
            <!-- <span style="font-size: 14px; color: #0c6dcd;">检测项目: {{ inspectionRecords_data.inspectionName || '' }}</span> -->
            <span style="font-size: 14px; color: #0c6dcd;">控制图路径: <span style="font-weight: 600;">{{ controlChartName }}</span></span>
            &nbsp;&nbsp;
            <br>
            <span style="font-size: 14px; color: #0c6dcd;">控制图层次信息: <span style="font-weight: 600;">{{ chartHierarchicalTypeString }}</span></span>
          </div>

          <div class="r clearfix">
            <el-form label-width="auto" inline :model="form" style="float: right;">
              <el-form-item style="margin-right: 20px;">
                <!-- <el-checkbox v-model="auto_">
                  失控点自动弹出警告
                </el-checkbox> -->
              </el-form-item>
              <el-form-item label="数据点数量:">
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
                    },
                  ]"
                  @change="num_change"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <dynamic-table
          ref="dy_table"
          v-model="select_row"
          style="padding-top:38px;"
          :request="request_data"
          :header-list="header_list"
          fixed-height="100%"
          :one-page-show-pagination="false"
          :page-sizes="[999999]"
          :auto-init="false"
          :row-class-name="tableRowClassName"
          @row-dbclick="dbclick"
        >
          <template
            slot="header-template"
            slot-scope="data"
          >
            <template v-if="data.list.header_template === 'states'">
              <span style="color: #eb0808;">{{ data.label }}</span>
            </template>
            <template v-else-if="data.list.header_template === 'hierarchicalTypeValue'">
              <span style="color: #0303e5;">{{ data.label }}</span>
            </template>
            <template v-else>{{ data.label }}</template>
          </template>
          <template slot="cell-template" slot-scope="data">
            <template v-if="data.list.template === 'states'">
              <span v-if="data.cellValue === 0" style="color: green;">正常</span>
              <span v-if="data.cellValue === 1" style="color: red;">失控</span>
              <span v-if="data.cellValue === 2" style="color: #E6A23C;">待处理</span>
              <span v-if="data.cellValue === 3" style="color: #9932CC;">已处理</span>
            </template>
            <!-- <el-input v-else-if="data.list.edit === 'date'" v-model="data.scope.row[data.list.prop]" style="width: 98%;" size="mini" :disabled="disabled" /> -->
            <allow-create-select
              v-else-if="(data.list.edit === 'hierarchicalType' && editRowIndex === data.index)"
              v-model="data.row[data.list.prop]"
              style="width:100%;height: 28px;"
              :props="keywordProps"
              :options="hierarchicalType_options[`hierarchicalType${data.list.serialNumber}`]"
              @focus="getHierarchicalType(data.list.id)"
            />
            <el-date-picker
              v-else-if="(data.list.edit === 'date' && editRowIndex === data.index)"
              v-model="data.row[data.list.prop]"
              type="datetime"
              size="mini"
              placeholder=""
              style="width: 98%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="date-input"
              @keyup.enter.native="add_data($event,data.row)"
            />
            <el-input
              v-else-if="(data.list.edit === 'text' && editRowIndex === data.index)"
              v-model="data.row[data.list.prop]"
              class="v-input"
              style="width: 98%;"
              size="mini"
              @keyup.enter.native="add_data($event,data.row)"
            />
            <el-input-number
              v-else-if="(data.list.edit === 'number' && editRowIndex === data.index)"
              v-model="data.row[data.list.prop]"
              class="v-input"
              style="width: 98%;"
              size="mini"
              :controls="false"
              :step="1"
              :step-strictly="count_graph.includes(controlChartType)"
              @keyup.enter.native="add_data($event,data.row)"
            />
            <template v-else>{{ data.cellValue }}</template>
          </template>
        </dynamic-table>
      </div>
    </template>
    <!-- <add-data-dialog
      :control-chart-son-id="controlChartSonId "
      :visible="add_data_dialog"
      :point-hierarchical-type-ids="pointHierarchicalTypeIds"
      :sample-size="sampleSize"
      :select-row="select_row"
      :flag="add_dialog_flag"
      :inspection-records-data="inspectionRecords_data"
      :control-chart-type="controlChartType"
      :bad-names="badNames"
      @handleClose="add_data_close"
      @confirm="add_data_dialog_confirm"
    /> -->

    <excel-import-dialog
      :control-chart-son-id="controlChartSonId"
      :bad-names="badNames"
      :dy-header-list="dy_header_list"
      :select-row="select_row"
      :control-chart-type="controlChartType"
      :visible="excel_import_dialog"
      :point-hierarchical-type-ids="pointHierarchicalTypeIds"
      @handleClose="excel_import_close"
      @confirm="excel_import_confirm"
    />

    <excel-import-dialog2
      :control-chart-son-id="controlChartSonId"
      :bad-names="badNames"
      :dy-header-list="dy_header_list"
      :select-row="select_row"
      :control-chart-type="controlChartType"
      :visible="excel_import_dialog2"
      :point-hierarchical-type-ids="pointHierarchicalTypeIds"
      @handleClose="excel_import_close2"
      @confirm="excel_import_confirm2"
    />
    <excel-import-dialog2
      :control-chart-son-id="controlChartSonId"
      :bad-names="badNames"
      :dy-header-list="dy_header_list"
      :select-row="select_row"
      :control-chart-type="controlChartType"
      :visible="excel_import_dialog2"
      :point-hierarchical-type-ids="pointHierarchicalTypeIds"
      @handleClose="excel_import_close2"
      @confirm="excel_import_confirm2"
    />

    <filter-options
      :visible="filter_options"
      :hierarchical-types="current_hierarchicalTypes"
      @handleClose="filter_options_close"
      @confirm="filter_options_confirm"
    />
    <chart-setting
      :visible="chart_setting_dialog"
      :axis-x-flag="axisXFlag"
      :date-format-flag="dateFormatFlag"
      :data-point-flag="dataPointFlag"
      @handleClose="chart_setting_dialog_close"
      @confirm="chart_setting_dialog_confirm"
    />

  </container-layout>
</template>

<script>
// import AddDataDialog from './components/add-data-dialog'

import { AllowCreateSelect } from '@/components/form-item'
import xbarr from './components/chart/xbarr'
import normal from './components/chart/normal'
import xbars from './components/chart/xbars'
import xbarmr from './components/chart/xbarmr'
import pchart from './components/chart/pchart'
import npchart from './components/chart/npchart'
import cchart from './components/chart/cchart'
import uchart from './components/chart/uchart'
import ychart from './components/chart/ychart'
import addData from './mixins/add-data'
import resetState from './mixins/reset-state'

import ExcelImportDialog from './components/dialog/excel-import-dialog'
import ExcelImportDialog2 from './components/dialog/excel-import-dialog2'
import FilterOptions from './components/dialog/filter-options'
import ChartSetting from './components/dialog/chart-setting-dialog'
import { mapGetters } from 'vuex'
import XLSX from 'xlsx'
import html2canvas from 'html2canvas'

import filter_options_dialog from './mixins/filter-options-dialog'
import chart_setting_dialog from './mixins/chart-setting-dialog'

import { dateformat } from '@/utils/date-method'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export default {
  name: 'ControlChartDetails',
  components: {
    // AddDataDialog,
    ExcelImportDialog,
    ExcelImportDialog2,
    FilterOptions,
    ChartSetting,
    xbarr,
    normal,
    AllowCreateSelect,
    xbars,
    xbarmr,
    pchart,
    npchart,
    cchart,
    uchart,
    ychart
  },
  mixins: [addData, resetState, filter_options_dialog, chart_setting_dialog],
  data() {
    return {
      digit: 0,
      editRowIndex: undefined,
      disabled: false,
      arr: [],
      chartData: [],
      add_dialog_flag: '',
      controlChartSonId: '',
      controlChartType: '',
      pointHierarchicalTypeIds: [],
      badNames: [],
      sampleSize: 0,
      add_data_dialog: false,
      excel_import_dialog: false,
      excel_import_dialog2: false,
      data_num: '',
      form: {
        dataType: '1',
        date: [],
        inspectionNum: 30
      },
      keywordProps: {
        value: 'keywordName',
        label: 'keywordName'
      },
      hierarchicalType_options: {
        hierarchicalType1: [],
        hierarchicalType2: [],
        hierarchicalType3: [],
        hierarchicalType4: [],
        hierarchicalType5: [],
        hierarchicalType6: [],
        hierarchicalType7: [],
        hierarchicalType8: [],
        hierarchicalType9: []
      },
      options: [{
        value: '1',
        label: '录入时间'
      }, {
        value: '2',
        label: '抽检时间'
      }],
      activeName: 'line',
      myEcharts: {},
      // select_row: {},
      select_row: [],
      dy_header_list: [
        { prop: 'inspectionDate', label: '抽检时间', width: '210', edit: 'date' },
        { prop: 'createDate', label: '录入时间', width: '210', edit: 'date' }
      ],
      header_list_data: [
        { prop: 'inspectionSerial', label: '序号', width: '100' },
        { prop: 'id', label: 'ID', width: '180' },
        { prop: 'inspectionDate', label: '抽检时间', width: '210', edit: 'date' },
        { prop: 'createDate', label: '录入时间', width: '210', edit: 'date' },
        // 数据点层次信息与样本值
        { prop: 'inspectionStatus', label: '状态', width: '70', template: 'states', header_template: 'states', align: 'center' }
        // { prop: 'average', label: '平均值', width: '120' },
        // { prop: 'range', label: '极差值', width: '120' },
        // { prop: 'sd', label: '标准差', width: '120' },
        // { prop: 'max', label: '最大值', width: '120' },
        // { prop: 'min', label: '最小值', width: '120' },
        // { prop: 'createUser', label: '录入用户', width: '120' }
      ],
      header_list: [],
      inspectionRecords_data: {},
      current_hierarchicalTypes: []
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes', 'powerCodes']),
    chartHierarchicalTypeString() {
      let str = ''
      if (Object.hasOwnProperty.call(this.inspectionRecords_data, 'chartHierarchicalTypeStr')) {
        str = this.inspectionRecords_data.chartHierarchicalTypeStr || ''
        const strArr = str.replaceAll('|', '=').split(',')
        return strArr.join(',')
      } else {
        return ''
      }
    },
    controlChartName() {
      if (Object.hasOwnProperty.call(this.inspectionRecords_data, 'inspectionRecords')) {
        const { inspectionRecords } = this.inspectionRecords_data
        return inspectionRecords[0].controlChartName || ''
      }
      return ''
    }
  },
  watch: {
    '$route.query.controlChartSonId': {
      immediate: true,
      async handler(controlChartSonId) {
        // console.log(this.$route.name)
        if (this.$route.name !== 'ControlChartDetails') return
        if (controlChartSonId) {
          // if (this.controlChartSonId === controlChartSonId) return
          this.controlChartSonId = controlChartSonId
          this.controlChartType = this.$route.query.controlChartType
          this.set_data('init')
        }
      }
    }
  },
  async created() {
    Object.freeze(this.header_list_data)
    this.header_list = JSON.parse(JSON.stringify(this.header_list_data))
  },
  // activated() {
  //   this.set_data('refresh')
  // },
  methods: {
    async num_change() {
      await this.set_data('query')
    },
    async getHierarchicalType(id) {
      const { code, data } = await this.$api.keywordValue_list({
        page: '1',
        limit: '20',
        hierarchicalTypeId: id,
        order: 'asc'
      })
      if (code === '200' && data) {
        this.hierarchicalType_options[`hierarchicalType${id}`] = data.list
      }
    },

    dbclick(row, col, e) {
      this.$refs.dy_table.refresh({ keep: true })
      if (!this.powerCodes.includes('inspectionRecord.update')) {
        return
      }
      const trs = document.querySelectorAll('.chart-details .el-table__fixed-body-wrapper tr')
      trs.forEach(tr => {
        tr.style.height = '31px'
      })
      const d = document.querySelector('.chart-details .el-table__fixed-body-wrapper .current-row')
      d.style.height = '37px'
      this.editRowIndex = row.inspectionSerial - 1
    },
    tableRowClassName({ row }) {
      if (row.id === '') {
        return 'success-row'
      }
    },
    dispose_all_chart() {
      for (const key in this.myEcharts) {
        if (Object.hasOwnProperty.call(this.myEcharts, key)) {
          !this.myEcharts[key].isDisposed() && this.myEcharts[key].dispose()
        }
      }
      this.myEcharts = {}
    },
    async set_data(flag) {
      this.footer_loading = true
      if (flag === 'init' || flag === 'reset') {
        const { code, data } = await this.get_inspectionRecordDate(this.controlChartSonId)
        if (code === '200' && data) {
          this.form.dataType = '1'
          this.form.date = [data.thisMonthStart, data.thisMonthEnd]
        }
        this.clean()
      }
      const res = await this.get_controlChartSon_data({ flag })
      await this.get_inspectionRecords_data((data) => {
        this.inspectionRecords_data = data
        if (this.dy_header_list.length <= 2) {
          this.get_final_header_list()
        }
        this.$refs.dy_table && this.$refs.dy_table.refresh()
        this.$nextTick(() => {
          this.setChart(res)
          this.footer_loading = false
        })
      })
    },
    async get_controlChartSon_data({ flag, inspectionRecordIds }) {
      if (!this.form.date || this.form.date.length === 0) {
        return
      }
      const param = {
        'controlChartSonId': this.controlChartSonId,
        'controlChartType': this.chartTypeNum,
        'dataType': this.form.dataType || '',
        'inspectionNum': this.form.inspectionNum || '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : '',
        'exceptionHandlingAddress': window.location.href.split('#')[0] + `#statistical-process-control/exception-handling?controlGroupId=${this.$route.query.controlGroupId}&controlChartSonId=${this.$route.query.controlChartSonId}`
      }
      if (inspectionRecordIds && inspectionRecordIds.length > 0) {
        param['inspectionRecordIds'] = inspectionRecordIds
      }
      if (flag === 'reset' || flag === 'sate_reset') {
        param.isSaveAbnormal = 1
        // const createChartImg = this.$refs.saveContent.querySelector('#createChartImg')
        // const canvas = await html2canvas(createChartImg)
        // param.chartBase64Data = canvas.toDataURL()
      }
      if (flag === 'sate_reset') {
        param.resetState = 1
      }
      const { code, data } = await this.$api.controlChartSon_data(param)
      if (code === '200' && data) {
        this.chartData = data
        return { data }
      }
    },
    async get_inspectionRecords_data(callback, filterParams = {}) {
      const params = {
        controlChartType: this.chartTypeNum,
        'controlChartSonId': this.controlChartSonId || 0,
        'dataType': this.form.dataType || '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : '',
        'inspectionNum': this.form.inspectionNum,
        ...filterParams
      }

      // if (flag === 'init') {
      //   params.isSaveAbnormal = 1
      // }

      const { code, data } = await this.$api.inspectionRecord_queryByControlChartSonId(params)
      if (code === '200' && data) {
        if (callback) callback(data) // 添加和首次进入完成检验数据之后,需要重新设置时间
      }
    },
    excel_import_dialog_btn() {
      this.excel_import_dialog = true
    },
    excel_import_dialog_btn2() {
      this.excel_import_dialog2 = true
    },
    async excel_import_confirm() {
      await this.set_data('reset')
      this.excel_import_dialog = false
    },
    excel_import_close() {
      this.excel_import_dialog = false
    },
    async excel_import_confirm2() {
      await this.set_data('reset')
      this.excel_import_dialog2 = false
    },
    excel_import_close2() {
      this.excel_import_dialog2 = false
    },
    async setChart(res) {
      const res4 = res
      if (!res4) { // 返回undefined代表没有数据
        this.dispose_all_chart()
        return
      }
      // this.myEcharts = []
      // alert(this.chartTypeNum)
      if ([1, 2, 3].includes(this.chartTypeNum)) {
        if (this.activeName === 'bar') {
          const normalChart = this.$refs['normal'].add_show1(res4.data)
          this.myEcharts.normalChart = normalChart
        }
      } else {
        this.activeName = 'line'
      }

      if (this.chartTypeNum === 1) {
        const chart = this.$refs['xbarr'].add_show(res4.data,
          this.$route.query.controlGroupId,
          this.form.date)
        this.myEcharts.line1 = chart[0]
        this.myEcharts.line2 = chart[1]
      } else if (this.chartTypeNum === 2) {
        // const res4 = Xbars_data
        this.myEcharts.xbars = this.$refs['xbars'].add_show(res4.data,
          this.$route.query.controlGroupId,
          this.form.date)
        // this.arr.Cpk = res4.data.vCPK
      } else if (this.chartTypeNum === 3) {
        // const res4 = XMR_data
        const xbarmr = this.$refs['xbarmr'].add_show(res4.data)
        this.myEcharts.xbarmr1 = xbarmr[0]
        this.myEcharts.xbarmr2 = xbarmr[1]
        this.arr.Cpk = res4.data.vCPK
      } else if (this.chartTypeNum === 4) {
        // const res4 = p_data
        this.myEcharts.pchart = this.$refs['pchart'].add_show(res4.data)
      } else if (this.chartTypeNum === 5) {
        this.myEcharts.npchart = this.$refs['npchart'].add_show(res4.data)
      } else if (this.chartTypeNum === 6) {
        this.myEcharts.cchart = this.$refs['cchart'].add_show(res4.data)
      } else if (this.chartTypeNum === 7) {
        this.myEcharts.uchart = this.$refs['uchart'].add_show(res4.data)
      } else if (this.chartTypeNum === 8) {
        const ychart = this.$refs['ychart'].add_show(res4.data)
        this.myEcharts.ychart1 = ychart[0]
        this.myEcharts.ychart2 = ychart[1]
      }

      this.chart_resize()
    },
    async query(loading) {
      if (!this.form.date) {
        this.$message.warning('需要选择一个时间段！')
      }
      loading(true)
      await this.set_data('query')
      loading(false)
    },
    clean() {
      this.inspectionRecords_data = {}
      this.pointHierarchicalTypeIds = []
      this.sampleSize = 0
      this.header_list = JSON.parse(JSON.stringify(this.header_list_data))
      this.dy_header_list = [
        { prop: 'inspectionDate', label: '抽检时间', width: '210', edit: 'date' },
        { prop: 'createDate', label: '录入时间', width: '210', edit: 'date' }
      ]
      this.chartData = []
      this.current_hierarchicalTypes = []
      this.dispose_all_chart()
      this.$refs.dy_table && this.$refs.dy_table.refresh()
    },
    del_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    async del(flag) {
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const ids = Array.isArray(this.select_row) ? this.select_row.map(item => item.id) : [this.select_row.id]
      const { code, data } = await this.$api.inspectionRecord_delete(ids)
      if (code === '200' && data) {
        this.select_row = []
        this.$message.success('删除成功！')
        await this.set_data('reset')
      }
    },
    // 获取所有的表头
    get_final_header_list() {
      // 非动态固定列（图类分类）
      if (this.count_graph.includes(this.controlChartType)) {
        let h = ''
        if (this.controlChartType === 'p') {
          h = { prop: 'failureRate', label: '不合格率', width: '120' }
        }
        if (this.controlChartType === 'np') {
          h = { prop: 'failureNum', label: '不合格数', width: '120' }
        }
        if (this.controlChartType === 'c') {
          h = { prop: 'failureNum', label: '缺陷数', width: '120' }
        }
        if (this.controlChartType === 'u') {
          h = { prop: 'failureRate', label: '缺陷率', width: '120' }
        }
        if (this.controlChartType === 'y') {
          h = { prop: 'yield', label: '良品率(%)', width: '120' }
        }
        this.header_list.push(h)
      } else {
        const h = [
          { prop: 'average', label: '平均值', width: '120' },
          { prop: 'range', label: '极差值', width: '120' },
          { prop: 'sd', label: '标准差', width: '120' },
          { prop: 'max', label: '最大值', width: '120' },
          { prop: 'min', label: '最小值', width: '120' }
        ]
        this.header_list.push(...h)
      }
      this.header_list.push({ prop: 'createUser', label: '录入用户', minWidth: '120' })

      // 动态表头（样本值和不良项目分类，层次信息）
      const { pointHierarchicalTypeIds, inspectionRecords, badDefinitionTitles, badDefinitionIds } = this.inspectionRecords_data
      this.pointHierarchicalTypeIds = pointHierarchicalTypeIds || []
      const arr = []
      this.pointHierarchicalTypeIds.forEach(id => {
        const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
        if (hierarchicalItem) {
          const list = {}
          list.prop = `hierarchicalTypeValue${this.commonVariable['parseNum'][hierarchicalItem.serialNumber]}`
          list.label = hierarchicalItem.hierarchicalName
          list.width = '180'
          list.header_template = 'hierarchicalTypeValue'
          list.edit = 'hierarchicalType'
          list.id = hierarchicalItem.id
          list.hierarchicalName = hierarchicalItem.hierarchicalName
          list.serialNumber = hierarchicalItem.serialNumber
          arr.push(list)
          this.current_hierarchicalTypes.push(list)
          this.dy_header_list.push(list)
        }
      })
      if (this.count_graph.includes(this.controlChartType) && badDefinitionTitles) {
        this.badNames = {
          badDefinitionTitles,
          badDefinitionIds
        }
        const v1 = { prop: 'value1', label: '抽检数', width: '180' }
        if (['p', 'u', 'y'].includes(this.controlChartType)) {
          v1.edit = 'number'
          this.dy_header_list.push(v1)
        }
        arr.push(v1)
        // if (this.controlChartType === 'p') {
        //   this.dy_header_list.push(v1)
        // }
        badDefinitionTitles.forEach((item, index) => {
          const list = {} // 自定义不良名 badValue + 数字
          list.prop = `badValue${index + 1}`
          list.label = item
          list.width = '180'
          list.t = 'n'
          list.edit = 'number'
          arr.push(list)
          this.dy_header_list.push(list)
        })
      }
      const sampleSize = inspectionRecords[0].sampleSize
      this.sampleSize = sampleSize || 0
      const digit = inspectionRecords[0].digit
      this.digit = digit || 0

      if (!this.count_graph.includes(this.controlChartType)) {
        // p,np 不设置样本的动态表头，设置不良项目
        for (let i = 1; i <= this.sampleSize; i++) {
          const list = {}
          list.prop = `value${i}`
          list.label = `样本${i}`
          list.width = '120'
          list.t = 'n'
          list.edit = 'number'
          arr.push(list)
          this.dy_header_list.push(list)
        }
      }

      this.header_list.splice(4, 0, ...arr)
    },
    // 添加数据的弹框
    add_data_dialog_btn(flag) {
      if (flag !== 'add') {
        if (!this.$refs.dy_table.one_row_select()) return
      }
      this.add_dialog_flag = flag
      this.add_data_dialog = true
    },
    add_data_close() {
      this.add_data_dialog = false
    },
    async add_data_dialog_confirm(times) {
      // await this.init()
      // await this.set_new_inspectionRecords_data2(times)
      await this.set_data('reset')
      this.add_data_dialog = false
    },
    handleClick() {
      if (![1, 2, 3].includes(this.chartTypeNum)) return // 目前只有 X-bars能切换 tabs
      this.$nextTick(() => {
        if (this.activeName === 'bar') {
          this.myEcharts.bar1 = this.$refs['normal'].add_show1(this.chartData)
        }
        this.chart_resize()
      })
    },
    getEmptyRow(d) {
      if (!this.powerCodes.includes('inspectionRecord.save')) {
        return
      }
      const empty_row = {}
      this.header_list.forEach(head => {
        empty_row[head.prop] = ''
      })
      empty_row['inspectionSerial'] = d.length + 1
      if (['np', 'c'].includes(this.controlChartType)) {
        empty_row.value1 = d[0].sampleSize
      }
      this.editRowIndex = d.length
      //   { prop: 'inspectionDate', label: '抽检时间', width: '210', edit: 'date' },
      // { prop: 'createDate', label: '录入时间', width: '210', edit: 'date' }
      if (d.length !== 0) {
        // empty_row['inspectionDate'] = d[d.length - 1]['inspectionDate']
        // empty_row['createDate'] = d[d.length - 1]['createDate']
        empty_row['inspectionDate'] = dateformat(new Date())
        empty_row['createDate'] = dateformat(new Date())
      }
      // 设置数据点的默认值
      this.default_dataPoint_value.forEach(item => {
        const key = `hierarchicalTypeValue${this.commonVariable['parseNum'][item.id]}`
        if (this.dataPointFlag === '2') {
          const { inspectionRecords } = this.inspectionRecords_data
          empty_row[key] = inspectionRecords[inspectionRecords.length - 1][key]
        } else {
          const o = {
            '0': '',
            '1': item.value || ''
          }
          empty_row[key] = o[this.dataPointFlag]
        }
      })
      return empty_row
    },
    async request_data({ page_no, page_size, table_data }) {
      if (!Object.hasOwnProperty.call(this.inspectionRecords_data, 'inspectionRecords')) return
      const { inspectionRecords } = this.inspectionRecords_data
      const t_data = {
        data: inspectionRecords.map((item, index) => {
          const badList = {} // objectList  装不良项目的 针对p,np
          if (this.count_graph.includes(this.controlChartType)) {
            if (item.objectList) {
              item.objectList.forEach((item, index) => {
                badList[`badValue${index + 1}`] = item.value
              })
            }
          }

          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              item[key] = item[key] === 'undefined' ? '' : item[key]
            }
          }
          return {
            ...item,
            ...badList,
            inspectionSerial: index + 1
          }
        }),
        total: inspectionRecords[0].id ? inspectionRecords.length : 0
      }
      if (this.powerCodes.includes('inspectionRecord.save')) {
        t_data.data.push(this.getEmptyRow(t_data.data))
      }
      if (inspectionRecords[0].controlChartSonId === null) {
        t_data.data.splice(0, 1)
        t_data.data[0]['inspectionSerial'] = 1
      }
      return t_data
    },
    chart_resize() {
      this.$nextTick(() => {
        for (const key in this.myEcharts) {
          if (Object.hasOwnProperty.call(this.myEcharts, key)) {
            this.myEcharts[key].resize()
          }
        }
      })
    },
    get_excelColumn() {
      // 获取excel的列号
      // 1-26 A-Z
      // 大于 26 AA AB AC 以此类推
      const columnList = {}
      this.dy_header_list.forEach((header, index) => {
        let str_big = String.fromCharCode('A'.charCodeAt(0) + index)
        if (index > 25) {
          str_big = String.fromCharCode('A'.charCodeAt(0) + parseInt(index / 26) - 1) + String.fromCharCode('A'.charCodeAt(0) + index - parseInt(index / 26) * 26)
        }
        columnList[str_big] = header.label
      })
      return columnList
    },
    download_template() {
      const columnList = this.get_excelColumn()
      // 数据表格
      var table = []
      table.push(columnList)
      const header = Object.keys(columnList)
      var wb = XLSX.utils.book_new()

      // json转sheet
      var ws = XLSX.utils.json_to_sheet(table, { header: header, skipHeader: true })
      // console.log('ws', ws)
      // 设置列宽
      // console.log('header', header)
      const colWidthArr = []
      header.forEach(() => {
        colWidthArr.push({ width: 15 })
      })
      ws['!cols'] = colWidthArr
      var timestamp = (new Date()).getTime()
      // sheet写入book
      XLSX.utils.book_append_sheet(wb, ws, 'file')
      // 输出
      XLSX.writeFile(wb, 'file' + timestamp + '.xlsx')
    },
    getHeaderRow(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    download_excel(data, filename = '') {
      const blob = new Blob([data])
      var zip = new JSZip()
      zip.file(`${filename}.xls`, blob)

      html2canvas(this.$refs.saveContent).then(canvas => {
        zip.file('控制图.png', this.dataURLtoBlob(canvas.toDataURL()), { base64: true })
        zip.generateAsync({ type: 'blob' })
          .then(function(content) {
            saveAs(content, `${filename}（${dateformat(new Date())}）.zip`)
          })
      })

      // const elink = document.createElement('a')
      // elink.download = `${filename}${dateformat(new Date())}.xls`
      // elink.style.display = 'none'
      // elink.href = URL.createObjectURL(blob)
      // document.body.appendChild(elink)
      // elink.click()
      // URL.revokeObjectURL(elink.href) // 释放URL 对象
      // document.body.removeChild(elink)
    },
    async export_inspection(loading) {
      loading(true)
      const type = this.commonVariable['parseChartType'][this.controlChartType]
      const params = {
        controlChartType: type,
        'controlChartSonId': this.controlChartSonId || 0,
        'dataType': this.form.dataType || '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : '',
        'excelName': `${this.inspectionRecords_data.inspectionName}${dateformat(new Date())}`,
        'inspectionNum': this.form.inspectionNum
      }

      const createChartImg = this.$refs.saveContent.querySelector('#createChartImg')
      html2canvas(createChartImg).then(async(canvas) => {
        params.chartBase64Data = canvas.toDataURL()
        const data = await this.$api.inspectionRecordExcel(params)
        if (data) {
          const blob = new Blob([data])
          saveAs(blob, `${this.inspectionRecords_data.inspectionName}（${dateformat(new Date())}）.xls`)
        }
        loading(false)
      })
    },
    async get_inspectionRecordDate(controlChartSonId) {
      return await this.$api.inspectionRecord_queryInspectionRecordDate({ id: controlChartSonId })
    }
  }
}
</script>

<style lang="scss" scoped>

$tabHeight: 24px;
::v-deep .chart-area {
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__item {
      height: $tabHeight;
      line-height: $tabHeight;
    }
    .el-tabs__content{
    height: calc(100% - ($tabHeight + 1px));
    .el-tab-pane {
      height: 100%;
    }
  }

}

::v-deep .r {
    margin-top: 5px;
    margin-right: 10px;
  .el-form--inline .el-form-item {
    margin: 0;
  }
}

@media screen and (max-width: 1200px) {
    .right-buttonGroup {
        // display: none;
        .el-button--mini {
          padding: 7px 7px;
          margin-left: 8px;
        }
    }
}

</style>
