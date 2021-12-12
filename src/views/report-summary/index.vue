<template>
  <div>
    <div style="padding: 10px 10px;">
      <el-row :gutter="20">
        <el-col :span="7" class="report-summary-card">
          <el-card class="box-card">
            <div slot="header">
              <span>计量型</span>
            </div>
            <ki-button type="primary" size="medium" @click="process_capability_report_btn">工序能力报表</ki-button>
            <ki-button type="primary" size="medium" @click="abnormalPoint_btn">失控点汇总</ki-button>
          </el-card>
        </el-col>
        <el-col :span="5" class="report-summary-card">
          <el-card class="box-card">
            <div slot="header">
              <span>计数型</span>
            </div>
            <ki-button type="primary" size="medium" @click="yieldRateReport_btn">良品率报表</ki-button>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div style="display: flex; align-items: flex-end;justify-content: flex-end;height: 117px; width: 100%;">
            <ki-button type="primary" size="small" :disabled="export_disabled" @click="export_btn">导出</ki-button>
          </div>
        </el-col>

      </el-row>
    </div>
    <ki-button @click="controlGroup_filtering_dialog_btn">控制组过滤</ki-button>
    <ki-button @click="col_field_dialog_btn">列字段过滤</ki-button>
    <ki-button @click="hierarchicalType_filtering_btn">层次信息过滤</ki-button>
    <ki-button @click="filter_options_btn">过滤选项</ki-button>
    <dynamic-table
      ref="dy_table"
      v-model="select_row"
      :one-page-show-pagination="false"
      :header-list="header_list"
      :request="request_data"
      :page-sizes="[999999]"
      unique="序号"
    />
    <control-group-filtering
      :visible="controlGroup_filtering_dialog"
      @handleClose="controlGroup_filtering_dialog_close"
      @confirm="controlGroup_filtering_dialog_confirm"
      @next="controlGroup_filtering_dialog_next"
    />
    <col-field-dialog
      :visible="col_field_dialog"
      @handleClose="col_field_dialog_close"
      @confirm="col_field_dialog_confirm"
      @prev="col_field_dialog_prev"
      @next="col_field_dialog_next"
    />
    <hierarchical-type-filtering
      :visible="hierarchicalType_filtering"
      @handleClose="hierarchicalType_filtering_close"
      @confirm="hierarchicalType_filtering_confirm"
      @prev="hierarchicalType_filtering_prev"
      @next="hierarchicalType_filtering_next"
    />

    <filter-options
      :visible="filter_options_dialog"
      @handleClose="filter_options_close"
      @confirm="filter_options_confirm"
      @prev="filter_options_prev"
    />

  </div>
</template>

<script>
import ControlGroupFiltering from './components/control-group-filtering'
import ColFieldDialog from './components/col-field-dialog'
import HierarchicalTypeFiltering from './components/hierarchicalType-filtering'
import FilterOptions from './components/filter-options'
import QueryPreview from './mixins/query-preview'
import { mapGetters } from 'vuex'
export default {
  name: 'ReportSummary',
  components: {
    ControlGroupFiltering,
    ColFieldDialog,
    HierarchicalTypeFiltering,
    FilterOptions
  },
  mixins: [QueryPreview],
  data() {
    return {
      flag: '',
      export_flag: '',
      parseNum: {
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine'
      },
      export_disabled: true,
      filter_options_dialog: false,
      hierarchicalType_filtering: false,
      controlGroup_filtering_dialog: false,
      col_field_dialog: false,
      header_list: [],
      select_row: {},
      t_data: [],
      form: {
        controlGroupKeys: [],
        colFieldKeys: [],
        hierarchicalTypeKeys: [],
        filteOptions_data: []
      },
      export_form: {}
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes'])
  },
  methods: {
    process_capability_report_btn() {
      this.flag = 'control-group-filtering'
      this.controlGroup_filtering_dialog_btn()
    },
    abnormalPoint_btn() {
      this.flag = 'abnormalPoint'
      this.controlGroup_filtering_dialog_btn()
    },
    yieldRateReport_btn() {
      this.flag = 'yieldRateReport'
      this.controlGroup_filtering_dialog_btn()
    },

    controlGroup_filtering_dialog_btn() {
      this.controlGroup_filtering_dialog = true
    },
    controlGroup_filtering_dialog_close() {
      this.controlGroup_filtering_dialog = false
    },
    controlGroup_filtering_dialog_confirm() {
      this.controlGroup_filtering_dialog = false
    },
    // controlGroup_filtering_dialog_prev() {
    //   this.controlGroup_filtering_dialog = false
    //   this.$nextTick(() => {
    //     this.controlGroup_filtering_dialog = true
    //   })
    // },
    controlGroup_filtering_dialog_next(controlGroupKeys) {
      if (this.flag === 'control-group-filtering') {
        this.col_field_dialog_btn()
      } else if (this.flag === 'abnormalPoint') {
        this.filter_options_btn()
      } else if (this.flag === 'yieldRateReport') {
        this.filter_options_btn()
      }
      this.$nextTick(() => {
        this.controlGroup_filtering_dialog_close()
        this.form.controlGroupKeys = controlGroupKeys
      })
    },
    col_field_dialog_btn() {
      this.col_field_dialog = true
    },
    col_field_dialog_close() {
      this.col_field_dialog = false
    },
    col_field_dialog_confirm() {
      this.col_field_dialog = false
    },
    col_field_dialog_prev() {
      if (this.flag === 'control-group-filtering') {
        this.controlGroup_filtering_dialog_btn()
        this.col_field_dialog_close()
      }
    },
    col_field_dialog_next(colFieldKeys) {
      if (this.flag === 'control-group-filtering') {
        this.hierarchicalType_filtering_btn()
        this.$nextTick(() => {
          this.col_field_dialog_close()
        })
        this.form.colFieldKeys = colFieldKeys
        console.log(this.form)
      //    form: {
      //   controlGroupKeys: [],
      //   colFieldKeys: [],
      //   hierarchicalTypeKeys: [],
      //   filteOptions_data: []
      // }
      }
    },
    hierarchicalType_filtering_btn() {
      this.hierarchicalType_filtering = true
    },
    hierarchicalType_filtering_close() {
      this.hierarchicalType_filtering = false
    },
    hierarchicalType_filtering_confirm() {
      this.hierarchicalType_filtering = false
    },
    hierarchicalType_filtering_prev() {
      if (this.flag === 'control-group-filtering') {
        this.col_field_dialog_btn()
        this.hierarchicalType_filtering_close()
      }
    },
    hierarchicalType_filtering_next(hierarchicalTypeKeys) {
      if (this.flag === 'control-group-filtering') {
        this.filter_options_btn()
        this.$nextTick(() => {
          this.hierarchicalType_filtering_close()
          this.form.hierarchicalTypeKeys = hierarchicalTypeKeys
          console.log(this.form)
        })
      }
    },
    filter_options_btn() {
      this.filter_options_dialog = true
    },
    filter_options_close() {
      this.filter_options_dialog = false
    },
    filter_options_confirm(filteOptions_data) {
      this.filter_options_dialog = false
      this.form.filteOptions_data = filteOptions_data
      this.export_form = JSON.parse(JSON.stringify(this.form))
      if (this.flag === 'control-group-filtering') {
        // console.log(this.form)
        // this.export_form = JSON.parse(JSON.stringify(this.form))
        this.processCapabilityExcelQuery_preview()
      } else if (this.flag === 'abnormalPoint') {
        this.abnormalPointExcelQuery_preview()
        this.export_flag = 'abnormalPoint'
        // abnormalPoint
      } else if (this.flag === 'yieldRateReport') {
        this.yieldRateReportExcelQuery_preview()
        this.export_flag = 'yieldRateReport'
      }
    },
    filter_options_prev() {
      if (this.flag === 'control-group-filtering') {
        this.hierarchicalType_filtering_btn()
        this.filter_options_close()
      }
    },
    filter_options_next() {},
    export_btn() {
      if (this.export_flag === 'control-group-filtering') {
        this.processCapabilityExcel_export()
      } else if (this.export_flag === 'abnormalPoint') {
        this.abnormalPointExcel_export()
        // abnormalPoint
      } else if (this.export_flag === 'yieldRateReport') {
        this.yieldRateReportExcel_export()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report-summary-card {
  text-align: center;
  ::v-deep .el-card__header {
    padding: 10px 20px;
  }
}
</style>
