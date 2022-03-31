
export default {
  data() {
    return {
      filter_options: false
    }
  },
  methods: {
    filter_options_btn() {
      this.filter_options = true
    },
    filter_options_close() {
      this.filter_options = false
    },
    filter_options_confirm(formData) {
      this.filter_options = false
      this.set_data2('query', formData)
    },
    async set_data2(flag, filterParams) {
      await this.get_inspectionRecords_data((data) => {
        this.inspectionRecords_data = data
        if (this.dy_header_list.length <= 2) {
          this.get_final_header_list()
        }
        this.$refs.dy_table && this.$refs.dy_table.refresh()
        this.$nextTick(async() => {
          const inspectionRecordIds = data.inspectionRecords.map(item => item.id)
          const res = await this.get_controlChartSon_data({ flag, inspectionRecordIds })
          this.setChart(res)
        })
      }, filterParams)
    }
  }
}

