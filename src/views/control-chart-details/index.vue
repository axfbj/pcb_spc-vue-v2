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
          <ki-button type="primary">导入数据</ki-button>
          <ki-button type="primary" @click="download_template">下载模板</ki-button>
          <ki-button type="primary">导出</ki-button>
        </div>
      </div>
    </template>

    <template v-slot:custum_content>
      <div style="height: 100%;">
        <el-tabs v-model="activeName" tab-position="bottom" style="height: 100%" @tab-click="handleClick">
          <el-tab-pane label="控制图" name="line">
            <div style="height: 100%;width:100%;">
              <div ref="line" class="line" />
            </div>
            <!-- 控制图 -->
          </el-tab-pane>
          <el-tab-pane label="正态分布图" name="bar">
            <div style="height: 100%;">
              <div style="height: 100%; width:30%;float:left;">
                <div ref="bar1" class="bar" style="width:100%;height:100%;min-height: 50px;" />
              </div>
              <div style="height: 100%; width:70%;float:left;">
                <el-row>
                  <el-col :span="12">
                    <el-card class="box-card">
                      <el-descriptions title="一般" direction="horizontal" :column="2">
                        <el-descriptions-item label="样本数：">8</el-descriptions-item>
                        <el-descriptions-item label="子组容量：">8</el-descriptions-item>
                        <el-descriptions-item label="目标值">100</el-descriptions-item>
                        <el-descriptions-item label="均值：">8</el-descriptions-item>
                        <el-descriptions-item label="USL：">90</el-descriptions-item>
                        <el-descriptions-item label="LSL">8</el-descriptions-item>
                        <el-descriptions-item label="Tol">-20.00</el-descriptions-item>
                      </el-descriptions>
                    </el-card>

                  </el-col>
                </el-row>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>

    <template v-slot:footer>

      <div style="position: relative;height: 100%;">
        <div style="padding:10px 0 10px 10px;position: absolute;top:0; left:0;">
          测试内容
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
              <span v-if="data.cellValue === 2" style="color: pink;">已处理</span>
            </template>
            <!-- <status-flag v-if="data.list.template === 'states'" :states="data.cellValue" /> -->
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
      @handleClose="add_data_close"
      @confirm="add_data_dialog_confirm"
    />

  </container-layout>
</template>

<script>
import chart from './mixins/chart'
import AddDataDialog from './components/add-data-dialog'
import { mapGetters } from 'vuex'
import XLSX from 'xlsx'

export default {
  name: 'ControlChartDetails',
  components: {
    AddDataDialog
  },
  mixins: [chart],
  data() {
    return {
      add_dialog_flag: '',
      controlChartSonId: '',
      controlChartType: '',
      pointHierarchicalTypeIds: [],
      sampleSize: 0,
      add_data_dialog: false,
      form: {
        dataType: '1',
        date: []
      },
      parseChartType: {
        'XBar-R': 1,
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
      activeName: 'bar',
      myEcharts: {},
      select_row: {},
      header_list_data: [
        { prop: 'inspectionSerial', label: '序号', width: '100' },
        { prop: 'id', label: 'ID', width: '180' },
        { prop: 'inspectionData', label: '抽检时间', width: '180' },
        { prop: 'createData', label: '录入时间', width: '180' },
        // 数据点层次信息与样本值
        { prop: 'inspectionStatus', label: '状态', width: '120', template: 'states', header_template: 'states' },
        { prop: 'average', label: '平均值', width: '120' },
        { prop: 'range', label: '极差值', width: '120' },
        { prop: 'sd', label: '标准差', width: '120' },
        { prop: 'max', label: '最大值', width: '120' },
        { prop: 'min', label: '最小值', width: '120' },
        { prop: 'createUser', label: '录入用户', width: '120' }
      ],
      header_list: [],
      inspectionRecords_data: {}
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes'])
  },
  watch: {
    '$route.query.controlChartSonId': {
      immediate: true,
      handler(controlChartSonId) {
        if (controlChartSonId) {
          if (this.controlChartSonId === controlChartSonId) return
          this.controlChartSonId = controlChartSonId
          this.controlChartType = this.$route.query.controlChartType
          this.init()
        }
      }
    }
  },
  async created() {
    Object.freeze(this.header_list_data)
    this.header_list = JSON.parse(JSON.stringify(this.header_list_data))
  },
  mounted() {
    this.initEcharts3()
    this.chart_resize()
  },

  methods: {
    async query() {
      await this.set_new_inspectionRecords_data()
    },
    async init() {
      this.clear()
      await this.get_inspectionRecords_data((data) => {
        this.inspectionRecords_data = data
        this.get_final_header_list()
        this.$refs.dy_table && this.$refs.dy_table.refresh()
      }, 'init')
    },
    clear() {
      this.inspectionRecords_data = {}
      this.pointHierarchicalTypeIds = []
      this.sampleSize = 0
      this.header_list = JSON.parse(JSON.stringify(this.header_list_data))
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
        await this.init()
      }
    },
    get_final_header_list() {
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
      const { pointHierarchicalTypeIds, inspectionRecords } = this.inspectionRecords_data
      this.pointHierarchicalTypeIds = pointHierarchicalTypeIds
      const arr = []
      pointHierarchicalTypeIds.forEach(id => {
        const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
        if (hierarchicalItem) {
          const list = {}
          list.prop = `hierarchicalTypeValue${parseNum[id]}`
          list.label = hierarchicalItem.hierarchicalName
          list.width = '180'
          list.header_template = 'hierarchicalTypeValue'
          // this.header_list.push(list)
          arr.push(list)
        }
      })
      const sampleSize = inspectionRecords[0].sampleSize
      this.sampleSize = sampleSize || 0
      if (!this.sampleSize) return

      for (let i = 1; i <= this.sampleSize; i++) {
        const list = {}
        list.prop = `value${i}`
        list.label = `样本${i}`
        list.width = '120'
        arr.push(list)
        // this.header_list.push(list)
      }
      // console.log('this.header_list', this.header_list)

      this.header_list.splice(4, 0, ...arr)
    },
    async set_new_inspectionRecords_data() {
      await this.get_inspectionRecords_data((data) => {
        this.inspectionRecords_data = data
        this.$refs.dy_table && this.$refs.dy_table.refresh()
      })
    },
    async get_inspectionRecords_data(callback, flag) {
      let params = {
        controlChartType: this.parseChartType[this.controlChartType],
        'controlChartSonId': this.controlChartSonId || 0,
        'dataType': this.form.dataType || '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : ''
      }
      if (flag === 'init') {
        params = {
          controlChartType: this.parseChartType[this.controlChartType],
          'controlChartSonId': this.controlChartSonId || 0
        }
      }
      const { code, data } = await this.$api.inspectionRecord_queryByControlChartSonId(params)
      if (code === '200' && data) {
        if (callback) callback(data)

        if (flag === 'init') {
          this.form.date = [data.thisMonthStart, data.thisMonthEnd]
        }
      }
    },
    add_data_dialog_btn(flag) {
      this.add_dialog_flag = flag
      this.add_data_dialog = true
    },
    add_data_close() {
      this.add_data_dialog = false
    },
    async add_data_dialog_confirm() {
      // await this.set_new_inspectionRecords_data()
      await this.init()
      this.add_data_dialog = false
    },
    handleClick() {
      this.$nextTick(() => {
        if (this.activeName === 'line') {
          if (!Object.keys(this.myEcharts).includes('line')) {
            this.initEcharts()
            // this.initEcharts2()
          }
        }
        if (this.activeName === 'bar') {
          if (!Object.keys(this.myEcharts).includes('bar1')) {
            this.initEcharts3()
          }
        }
        this.chart_resize()
      })
    },
    async request_data({ page_no, page_size, table_data }) {
      if (!Object.hasOwnProperty.call(this.inspectionRecords_data, 'inspectionRecords')) return
      // console.log(this.inspectionRecords_data)
      const { inspectionRecords } = this.inspectionRecords_data
      return {
        data: inspectionRecords.map((item, index) => ({
          ...item,
          inspectionSerial: index + 1
        })),
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

    get_column() {
      const columnList = {}
      this.header_list.forEach((header, index) => {
        let str_big = String.fromCharCode('A'.charCodeAt(0) + index)
        if (index > 25) {
          str_big = String.fromCharCode('A'.charCodeAt(0) + parseInt(index / 26) - 1) + String.fromCharCode('A'.charCodeAt(0) + index - parseInt(index / 26) * 26)
        }
        columnList[str_big] = header.label
      })
      // console.log(columnList)

      return columnList
    },
    download_template() {
      const columnList = this.get_column()
      // alert(1)
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
      var wb = XLSX.utils.book_new()
      // json转sheet
      var ws = XLSX.utils.json_to_sheet(table, { header: header, skipHeader: true })
      // 设置列宽
      // console.log('header', header)
      const colWidthArr = []
      header.forEach(() => {
        colWidthArr.push({ width: 15 })
      })
      ws['!cols'] = colWidthArr
      // ws['!cols'] = [
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 },
      //   { width: 15 }
      // ]
      var timestamp = (new Date()).getTime()
      // sheet写入book
      XLSX.utils.book_append_sheet(wb, ws, 'file')
      // 输出
      XLSX.writeFile(wb, 'file' + timestamp + '.xlsx')
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
</style>
