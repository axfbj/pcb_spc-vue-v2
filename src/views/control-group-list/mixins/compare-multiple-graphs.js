export default {
  methods: {
    toCompareGraphsPage(params) {
      // this.$router.push({ path: '/components/compare-multiple-graphs', params })
      this.$router.push({ name: 'CompareMultipleGraphs' })
    },
    compare_graphs_btn({ rows }) {
      if (rows.length < 2) {
        this.$message.warning('至少选中两张控制图')
        return
      }
      const limit1 = rows.every(row => this.count_graph.includes(row.controlChartType))
      const limit2 = rows.every(row => !this.count_graph.includes(row.controlChartType))
      if (limit1 || limit2) {
        this.$store.commit('compareMultipleGraphs/setChartRows', rows)
        this.toCompareGraphsPage()
        return
      }
      this.$alert('计量类型: Xbar-R、Xbar-s、XMR<br>计数类型: p、np、u、c、y', '选择的控制图类型不相同，请重新选择！', {
        dangerouslyUseHTMLString: true
      })
    }
  }
}
