<template>
  <container-layout footer-height="50%" adjustable-height :after-calc="chart_resize">
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
                type="primary"
                icon="el-icon-search"
                @click="query"
              >查询</ki-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="overflow: hidden; text-align: right;">
          <ki-button type="primary" @click="add_data_dialog_btn('add')">添加数据</ki-button>
          <ki-button type="warning" @click="add_data_dialog_btn('edit')">修改数据</ki-button>
          <ki-message-box
            :next="del"
            @click="del_btn"
          >
            <ki-button
              type="danger"
              style="margin: 0 10px;"
            >删除</ki-button>
          </ki-message-box>
          <ki-button type="primary" @click="excel_import_dialog_btn">导入数据</ki-button>
          <ki-button type="primary" @click="download_template">下载模板</ki-button>
          <ki-button type="primary" @click="export_inspection">导出</ki-button>
        </div>
      </div>
    </template>

    <template v-slot:custum_content>
      <div style="height: 100%;">
        <el-tabs v-model="activeName" tab-position="bottom" style="height: 100%" @tab-click="handleClick">
          <el-tab-pane label="控制图" name="line">
            <div style="height: 100%;width:100%;">
              <!-- <div v-if="controlChartType === 'Xbar-R'" ref="line" class="line" /> -->
              <xbarr v-if="controlChartType === 'Xbar-R'" ref="xbarr" style="height: 100%;width:100%;" />
              <xbars v-if="controlChartType === 'Xbar-s'" ref="xbars" style="height: 100%;width:100%;" />
              <xbarmr v-if="controlChartType === 'X-MR'" ref="xbarmr" style="height: 100%;width:100%;" />
              <pchart v-if="controlChartType === 'p'" ref="pchart" style="height: 100%;width:100%;" />
              <npchart v-if="controlChartType === 'np'" ref="npchart" style="height: 100%;width:100%;" />
            </div>
            <!-- 控制图 -->
          </el-tab-pane>
          <el-tab-pane v-if="controlChartType === 'Xbar-R'" label="正态分布图" name="bar">
            <normal ref="normal" style="height: 100%;width:100%;" />
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>

    <template v-slot:footer>

      <div style="position: relative;height: 100%;">
        <div style="position: absolute;top:0; left:0; width: 100%; height: 38px;z-index: 2;">
          <div style="float: right;" class="r">
            <el-form label-width="auto" inline :model="form">
              <el-form-item label="数据点数量:">
                <el-input-number v-model="form.inspectionNum" controls-position="right" />
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
              <span v-if="data.cellValue === 2" style="color: #9932CC;">已处理</span>
            </template>
            <template v-else>{{ data.cellValue }}</template>
          </template>
        </dynamic-table>
      </div>
    </template>
    <add-data-dialog
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
    />

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

  </container-layout>
</template>

<script>
// import chart_xbarr from './mixins/chart-xbarr'
import AddDataDialog from './components/add-data-dialog'
import ExcelImportDialog from './components/excel-import-dialog'
import { mapGetters } from 'vuex'
import XLSX from 'xlsx'

import xbarr from './components/xbarr'
import normal from './components/normal'
import xbars from './components/xbars'
import xbarmr from './components/xbarmr'
import pchart from './components/pchart'
import npchart from './components/npchart'

// import chartData from './mixins/data'
// import Xbars_data from './mixins/Xbars_data'
// import p_data from './mixins/p_data'
// import XMR_data from './mixins/XMR_data'
import { dateformat } from '@/utils/date-method'

export default {
  // name: 'ControlChartDetails',
  components: {
    AddDataDialog,
    ExcelImportDialog,
    xbarr,
    normal,
    xbars,
    xbarmr,
    pchart,
    npchart
  },
  // mixins: [chart_xbarr],
  data() {
    return {
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

      data_num: '',
      form: {
        dataType: '1',
        date: [],
        inspectionNum: 30
      },
      parseChartType: {
        'Xbar-R': 1,
        'Xbar-s': 2,
        'X-MR': 3,
        'p': 4,
        'np': 5
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
      select_row: {},
      dy_header_list: [
        { prop: 'inspectionData', label: '抽检时间', width: '180' },
        { prop: 'createData', label: '录入时间', width: '180' }
      ],
      header_list_data: [
        { prop: 'inspectionSerial', label: '序号', width: '100' },
        { prop: 'id', label: 'ID', width: '180' },
        { prop: 'inspectionData', label: '抽检时间', width: '180' },
        { prop: 'createData', label: '录入时间', width: '180' },
        // 数据点层次信息与样本值
        { prop: 'inspectionStatus', label: '状态', width: '120', template: 'states', header_template: 'states' }
        // { prop: 'average', label: '平均值', width: '120' },
        // { prop: 'range', label: '极差值', width: '120' },
        // { prop: 'sd', label: '标准差', width: '120' },
        // { prop: 'max', label: '最大值', width: '120' },
        // { prop: 'min', label: '最小值', width: '120' },
        // { prop: 'createUser', label: '录入用户', width: '120' }
      ],
      header_list: [],
      inspectionRecords_data: {}
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes']),
    chartTypeNum() {
      return this.parseChartType[this.controlChartType] || ''
    }
  },
  watch: {
    '$route.query.controlChartSonId': {
      immediate: true,
      async handler(controlChartSonId) {
        if (controlChartSonId) {
          if (this.controlChartSonId === controlChartSonId) return
          this.controlChartSonId = controlChartSonId
          this.controlChartType = this.$route.query.controlChartType
          this.dispose_all_chart()
          this.set_data('init')
        }
      }
    }
  },
  async created() {
    Object.freeze(this.header_list_data)
    this.header_list = JSON.parse(JSON.stringify(this.header_list_data))
  },
  methods: {
    dispose_all_chart() {
      for (const key in this.myEcharts) {
        if (Object.hasOwnProperty.call(this.myEcharts, key)) {
          !this.myEcharts[key].isDisposed() && this.myEcharts[key].dispose()
        }
      }
    },
    async set_data(flag) {
      if (flag === 'init') {
        const { code, data } = await this.get_inspectionRecordDate(this.controlChartSonId)
        if (code === '200' && data) {
          this.form.dataType = '1'
          this.form.date = [data.thisMonthStart, data.thisMonthEnd]
        }
        // else {
        //   this.clear()
        // }
        this.clear()
      }
      const res = await this.get_controlChartSon_data()
      await this.get_inspectionRecords_data((data) => {
        this.inspectionRecords_data = data
        if (this.dy_header_list.length <= 2) {
          this.get_final_header_list()
        }
        this.$refs.dy_table && this.$refs.dy_table.refresh()
        this.$nextTick(() => {
          this.setChart(res)
        })
      })
    },
    async get_controlChartSon_data() {
      if (!this.form.date || this.form.date.length === 0) {
        return
      }
      const param = {
        'controlChartSonId': this.controlChartSonId,
        'controlChartType': this.chartTypeNum,
        'dataType': this.form.dataType || '',
        'inspectionNum': this.form.inspectionNum || '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : ''
      }
      const { code, data } = await this.$api.controlChartSon_data(param)
      if (code === '200' && data) {
        this.chartData = data
        return { data }
      }
    },
    async get_inspectionRecords_data(callback, flag) {
      const params = {
        controlChartType: this.chartTypeNum,
        'controlChartSonId': this.controlChartSonId || 0,
        'dataType': this.form.dataType || '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : '',
        'inspectionNum': this.form.inspectionNum
      }
      const { code, data } = await this.$api.inspectionRecord_queryByControlChartSonId(params)
      if (code === '200' && data) {
        if (callback) callback(data) // 添加和首次进入完成检验数据之后,需要重新设置时间
      }
    },
    excel_import_dialog_btn() {
      this.excel_import_dialog = true
    },
    async excel_import_confirm() {
      await this.set_data('init')
      this.excel_import_dialog = false
    },
    excel_import_close() {
      this.excel_import_dialog = false
    },
    async setChart(res) {
      // const res4 = this.chartData // 请求
      // const res4 = chartData// 请求
      // this.getChartData()
      const res4 = res
      // callback && callback()
      if (!res4) { // 返回undefined代表没有数据
        this.dispose_all_chart()
        return
      }
      if (this.chartTypeNum === 1) {
        // const chart = this.$refs['xbarr'].add_show(res4.data, this.thisMonthStart, this.thisMonthEnd, this.inspectionCode, this.productTypeCode, this.productCode)
        const chart = this.$refs['xbarr'].add_show(res4.data,
          this.$route.query.controlGroupId,
          this.form.date)
        this.myEcharts.line1 = chart[0]
        this.myEcharts.line2 = chart[1]
        if (this.activeName === 'bar') {
          this.$refs['normal'].add_show1(res4.data)
        }
      } else if (this.chartTypeNum === 2) {
        // const res4 = Xbars_data
        this.myEcharts.xbars = this.$refs['xbars'].add_show2(res4.data,
          this.$route.query.controlGroupId,
          this.form.date)
        // this.arr.Cpk = res4.data.vCPK
      } else if (this.chartTypeNum === 3) {
        // const res4 = XMR_data
        this.myEcharts.xbarmr = this.$refs['xbarmr'].add_show3(res4.data)
        this.arr.Cpk = res4.data.vCPK
      } else if (this.chartTypeNum === 4) {
        // const res4 = p_data
        this.myEcharts.pchart = this.$refs['pchart'].add_show4(res4.data)
      } else if (this.chartTypeNum === 5) {
        this.myEcharts.npchart = this.$refs['npchart'].add_show5(res4.data)
      }
      this.chart_resize()
    },
    async query(loading) {
      if (!this.form.date) {
        this.$message.warning('需要选择一个时间段！')
      }
      loading(true)
      await this.set_data()
      loading(false)
    },
    clear() {
      this.inspectionRecords_data = {}
      this.pointHierarchicalTypeIds = []
      this.sampleSize = 0
      this.header_list = JSON.parse(JSON.stringify(this.header_list_data))
      this.dy_header_list = [
        { prop: 'inspectionData', label: '抽检时间', width: '180' },
        { prop: 'createData', label: '录入时间', width: '180' }
      ]
      this.chartData = []
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
        this.select_row = {}
        this.$message.success('删除成功！')
        await this.set_data()
      }
    },
    get_final_header_list() {
      // 非动态固定列（图类分类）
      if (['p', 'np'].includes(this.controlChartType)) {
        let h = ''
        if (this.controlChartType === 'p') {
          h = { prop: 'failureRate', label: '不合格率', width: '120' }
        } else {
          h = { prop: 'failureNum', label: '不合格数', width: '120' }
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

      // 动态表头（样本值或不良项目分类）
      const parseNum = {
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine'
      }
      const { pointHierarchicalTypeIds, inspectionRecords, badDefinitionTitles, badDefinitionIds } = this.inspectionRecords_data
      this.pointHierarchicalTypeIds = pointHierarchicalTypeIds || []
      const arr = []
      this.pointHierarchicalTypeIds.forEach(id => {
        const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
        if (hierarchicalItem) {
          const list = {}
          list.prop = `hierarchicalTypeValue${parseNum[hierarchicalItem.serialNumber]}`
          list.label = hierarchicalItem.hierarchicalName
          list.width = '180'
          list.header_template = 'hierarchicalTypeValue'
          arr.push(list)
          this.dy_header_list.push(list)
        }
      })
      if (['p', 'np'].includes(this.controlChartType) && badDefinitionTitles) {
        this.badNames = {
          badDefinitionTitles,
          badDefinitionIds
        }
        arr.push({ prop: 'value1', label: '抽检数', width: '180' })
        if (this.controlChartType === 'p') {
          this.dy_header_list.push({ prop: 'value1', label: '抽检数', width: '180' })
        }
        badDefinitionTitles.forEach((item, index) => {
          const list = {} // 自定义不良名 badValue + 数字
          list.prop = `badValue${index + 1}`
          list.label = item
          list.width = '180'
          list.t = 'n'
          arr.push(list)
          this.dy_header_list.push(list)
        })
      }
      const sampleSize = inspectionRecords[0].sampleSize
      this.sampleSize = sampleSize || 0

      if (!['p', 'np'].includes(this.controlChartType)) {
        // p,np 不设置样本的动态表头，设置不良项目
        for (let i = 1; i <= this.sampleSize; i++) {
          const list = {}
          list.prop = `value${i}`
          list.label = `样本${i}`
          list.width = '120'
          list.t = 'n'
          arr.push(list)
          this.dy_header_list.push(list)
        }
      }

      this.header_list.splice(4, 0, ...arr)
    },
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
      await this.set_data('init')
      this.add_data_dialog = false
    },
    handleClick() {
      if (this.chartTypeNum !== 1) return // 目前只有 X-bars能切换 tabs
      this.$nextTick(() => {
        if (this.activeName === 'bar') {
          this.myEcharts.bar1 = this.$refs['normal'].add_show1(this.chartData)
        }
        this.chart_resize()
      })
    },
    async request_data({ page_no, page_size, table_data }) {
      if (!Object.hasOwnProperty.call(this.inspectionRecords_data, 'inspectionRecords')) return
      const { inspectionRecords } = this.inspectionRecords_data
      if (inspectionRecords[0].controlChartSonId === null) {
        return {
          data: [],
          total: 0
        }
      }
      return {
        data: inspectionRecords.map((item, index) => {
          const badList = {} // objectList  装不良项目的 针对p,np
          if (['p', 'np'].includes(this.controlChartType)) {
            if (item.objectList) {
              item.objectList.forEach((item, index) => {
                badList[`badValue${index + 1}`] = item.value
              })
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
      // var data = [{
      //   'a': 1,
      //   'x': 2,
      //   'b': 3,
      //   'y': 4,
      //   'success': true
      // }, {
      //   'a': 1,
      //   'x': 2,
      //   'b': 3,
      //   'y': 4,
      //   'success': false
      // }
      // ]
      // 数据表格
      var table = []

      // table.push({
      //   A: '列A',
      //   B: '列B',
      //   C: '列C',
      //   D: '列D',
      //   E: '列E'
      // })
      table.push(columnList)
      // data.forEach(function(item) {
      //   var row = {
      //     A: item.b,
      //     B: item.y,
      //     C: item.a,
      //     D: item.x,
      //     E: (item.success ? '成功' : '失败')
      //   }
      //   table.push(row)
      // })
      const header = Object.keys(columnList)
      // 创建book
      // console.log('dateformat(new Date())', dateformat(new Date(), 'YYYY/MM/DD HH:mm:ss'))
      // const row = {}
      // for (const key in columnList) {
      //   if (Object.hasOwnProperty.call(columnList, key)) {
      //     row[key] = ''
      //     if (key === 'A' || key === 'B') {
      //       row[key] = dateformat(new Date(), 'YYYY/MM/DD HH:mm:ss')
      //     }
      //   }
      // }
      // table.push(row)
      console.log(table)
      var wb = XLSX.utils.book_new()

      // json转sheet
      var ws = XLSX.utils.json_to_sheet(table, { header: header, skipHeader: true })
      console.log('ws', ws)
      // 设置列宽
      // console.log('header', header)
      const colWidthArr = []
      header.forEach(() => {
        colWidthArr.push({ width: 15 })
      })
      ws['!cols'] = colWidthArr
      // console.log('ws', ws)
      // console.log('wb', wb)
      // ws['!cols'] = [
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 }
      // ]
      // columnList
      var timestamp = (new Date()).getTime()
      // sheet写入book
      XLSX.utils.book_append_sheet(wb, ws, 'file')
      // 输出
      XLSX.writeFile(wb, 'file' + timestamp + '.xlsx')
    },
    download_excel(data, filename = '') {
      const blob = new Blob([data])
      const elink = document.createElement('a')
      elink.download = `${filename}${dateformat(new Date())}.xls`
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    },
    async export_inspection() {
      const type = this.parseChartType[this.controlChartType]
      const params = {
        controlChartType: type,
        'controlChartSonId': this.controlChartSonId || 0,
        'dataType': this.form.dataType || '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : '',
        'excelName': `检验记录报表${dateformat(new Date())}`,
        'inspectionNum': this.form.inspectionNum
      }
      const data = await this.$api.inspectionRecordExcel(params)
      if (data) {
        this.download_excel(data, '检验记录报表')
      }
    },
    async get_inspectionRecordDate(controlChartSonId) {
      return await this.$api.inspectionRecord_queryInspectionRecordDate({ id: controlChartSonId })
    }
  }
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 100%;
  min-height: 50px;
  margin: auto;
  margin-top: 5px;
}
::v-deep .el-tabs__content{
  height: calc(100% - 50px);
  .el-tab-pane {
    height: 100%;
  }
}

::v-deep .r {
    margin-top: 5px;
    margin-right: 10px;
  .el-form--inline .el-form-item {
    margin: 0;
  }
}
</style>
