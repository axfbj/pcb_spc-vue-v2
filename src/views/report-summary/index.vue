<template>
  <div>
    <div style="padding: 10px 10px;">
      <el-row :gutter="20">
        <el-col :span="5" class="report-summary-card">
          <el-card class="box-card">
            <div slot="header">
              <span>计量型</span>
            </div>
            <ki-button type="primary" size="medium" @click="process_capability_report_btn">工序能力报表</ki-button>
            <ki-button type="primary" size="medium">失控点汇总</ki-button>
          </el-card>
        </el-col>
        <el-col :span="4" class="report-summary-card">
          <el-card class="box-card">
            <div slot="header">
              <span>计数型</span>
            </div>
            <ki-button type="primary" size="medium">良品率报表</ki-button>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <ki-button @click="col_field_dialog_btn">列字段过滤</ki-button>
    <ki-button @click="hierarchicalType_filtering_btn">层次信息过滤</ki-button>
    <ki-button @click="filter_options_btn">过滤选项</ki-button>
    <dynamic-table
      v-model="select_row"
      :one-page-show-pagination="false"
      :header-list="header_list"
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
    />

    <filter-options
      :visible="filter_options_dialog"
      @handleClose="filter_options_close"
      @confirm="filter_options_confirm"
    />

  </div>
</template>

<script>
import ControlGroupFiltering from './components/control-group-filtering'
import ColFieldDialog from './components/col-field-dialog'
import HierarchicalTypeFiltering from './components/hierarchicalType-filtering'
import FilterOptions from './components/filter-options'
export default {
  name: 'ReportSummary',
  components: {
    ControlGroupFiltering,
    ColFieldDialog,
    HierarchicalTypeFiltering,
    FilterOptions
  },
  data() {
    return {
      flag: '',
      filter_options_dialog: false,
      hierarchicalType_filtering: false,
      controlGroup_filtering_dialog: false,
      col_field_dialog: false,
      header_list: [],
      select_row: {}
    }
  },
  methods: {
    process_capability_report_btn() {
      this.flag = 'control-group-filtering'
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
    controlGroup_filtering_dialog_next(condition) {
      if (this.flag === 'control-group-filtering') {
        this.col_field_dialog_btn()
        this.$nextTick(() => {
          this.controlGroup_filtering_dialog = false
        })
      }
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
        this.controlGroup_filtering_dialog = true
        this.col_field_dialog_close()
      }
    },
    col_field_dialog_next() {
      if (this.flag === 'control-group-filtering') {
        this.hierarchicalType_filtering_btn()
        this.$nextTick(() => {
          this.col_field_dialog_close()
        })
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
    filter_options_btn() {
      this.filter_options_dialog = true
    },
    filter_options_close() {
      this.filter_options_dialog = false
    },
    filter_options_confirm() {
      this.filter_options_dialog = false
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
