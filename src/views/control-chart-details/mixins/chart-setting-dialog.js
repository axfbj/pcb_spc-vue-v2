
export default {
  data() {
    return {
      axisXFlag: 1,
      dateFormatFlag: 'MM/DD',
      chart_setting_dialog: false,
      toogleSetting: false,
      dataPointFlag: '0' // 数据点默认值
    }
  },
  methods: {
    chart_setting_dialog_btn() {
      this.chart_setting_dialog = true
    },
    chart_setting_dialog_close() {
      this.chart_setting_dialog = false
    },
    chart_setting_dialog_confirm(config) {
      this.axisXFlag = config.axisX_value
      this.dateFormatFlag = config.dateFormatValue
      this.dataPointFlag = config.dataPointFlag
      this.chart_setting_dialog = false
      this.toogleSetting = !this.toogleSetting
    }
  }
}

