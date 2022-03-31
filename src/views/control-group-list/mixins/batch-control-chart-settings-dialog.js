export default {
  data() {
    return {
      batch_chartSetting_dialog: false,
      batch_control_chart_settings_flag: 'update'

    }
  },
  methods: {
    batch_control_chart_settings_close(refresh) {
      this.batch_chartSetting_dialog = false
    },
    batch_control_chart_settings_confirm() {
      this.batch_chartSetting_dialog = false
      this.$refs.dy_table.refresh()
    },
    batch_setting_dialog() {
      const has_different_chartType = this.select_row.every(row => this.select_row[0]['controlChartType'] === row['controlChartType'])
      if (!has_different_chartType) {
        this.$message.warning('批量修改只支持相同的图类')
        return
      }
      this.batch_chartSetting_dialog = true
    }
  }
}

