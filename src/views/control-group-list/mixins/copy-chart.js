
import _ from 'lodash'
export default {
  data() {
    return {
      copy_chart: []
    }
  },
  methods: {
    copy_chart_btn() {
      this.copy_chart = _.cloneDeep(this.select_row)
      this.$message('控制图复制成功')
    },
    async paste_chart_btn(flag) {
      const ids = this.copy_chart.map(row => row.id)
      let [code, data] = ['203', false]
      if (flag === '7') { // 包含控制图数据
        ({ code, data } = await this.$api.copyControlChartContainInspectionRecord(ids))
      } else { // 不包含控制图数据
        ({ code, data } = await this.$api.copyControlChartNotContainInspectionRecord(ids))
      }
      if (code === '200' && data) {
        this.$message.success('复制成功')
        this.$refs.dy_table.refresh()
      }
    }
  }
}

