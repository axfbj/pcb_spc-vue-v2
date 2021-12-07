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
              >查询</ki-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="overflow: hidden; text-align: right;">
          <ki-button type="primary" @click="add_data_btn">添加数据</ki-button>
          <ki-button type="primary">导入数据</ki-button>
          <ki-button type="primary">下载模板</ki-button>
          <ki-button type="primary">导出</ki-button>
        </div>
      </div>
    </template>

    <template v-slot:custum_content>
      <div style="height: 100%;">
        <el-tabs v-model="activeName" tab-position="bottom" style="height: 100%" @tab-click="handleClick">
          <el-tab-pane label="控制图" name="line">
            <div style="height: 100%;width:100%;">
              <div ref="line1" class="line" />
              <div ref="line2" class="line" />
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
          ref="lists"
          v-model="select_row"
          style="padding-top:38px;"
          :request="request_data"
          :header-list="header_list"
          fixed-height="100%"
          :one-page-show-pagination="false"
          :page-sizes="[999999]"
        />
      </div>
    </template>
    <add-data-dialog
      :visible="add_data_dialog"
      @handleClose="add_data_close"
      @confirm="add_data_confirm"
    />

  </container-layout>
</template>

<script>
import chart from './mixins/chart'
import AddDataDialog from './components/add-data-dialog'
export default {
  name: 'ControlChartDetails',
  components: {
    AddDataDialog
  },
  mixins: [chart],
  data() {
    return {
      add_data_dialog: false,
      form: {
        dataType: '1',
        date: []
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
      header_list: [
        { prop: 'id', label: '序号', width: '100' },
        { prop: 'name', label: '抽检时间', width: '180' },
        { prop: 'address', label: '录入时间', width: '180' },
        // 数据点层次信息与样本值
        { prop: 'address', label: '状态', width: '120' },
        { prop: 'address1', label: '平均值', width: '120' },
        { prop: 'address1', label: '极差值', width: '120' },
        { prop: 'address1', label: '标准差', width: '120' },
        { prop: 'address1', label: '最大值', width: '120' },
        { prop: 'address1', label: '最小值', width: '120' },
        { prop: 'address1', label: '录入用户', width: '120' },
        { prop: 'address1', label: '最小值' }
      ]
    }
  },
  mounted() {
    this.initEcharts3()
    this.chart_resize()
  },
  activated() {
    if (this.controlChartSonId === this.$route.query.controlChartSonId) return
    this.controlChartSonId = this.$route.query.controlChartSonId
    // const params = { controlChartSonId: this.controlChartSonId }
    // this.get_inspectionRecord_query(params)
  },
  created() {},
  methods: {
    add_data_btn() {
      this.add_data_dialog = true
    },
    add_data_close() {
      this.add_data_dialog = false
    },
    add_data_confirm() {
      this.add_data_dialog = false
    },
    handleClick() {
      this.$nextTick(() => {
        if (this.activeName === 'line') {
          if (!Object.keys(this.myEcharts).includes('line1')) {
            this.initEcharts()
            this.initEcharts2()
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
    async get_inspectionRecord_query(params) {
      const { code, data } = await this.$api.inspectionRecord_queryByControlChartSonId(params)
      if (code === '200' && data) {
        console.log('data', data)
      }
    },
    async request_data({ page_no, page_size, table_data }) {
      const params = {
        'controlChartSonId': this.controlChartSonId || 0,
        'dataType': this.form.dataType || '',
        'thisMonthEnd': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthStart': this.form.date ? (this.form.date[1] || '') : ''
      }
      const { code, data } = await this.$api.inspectionRecord_queryByControlChartSonId(params)
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount

        }
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
    }

  }
}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 50%;
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
