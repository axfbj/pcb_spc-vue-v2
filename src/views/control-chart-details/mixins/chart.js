export default {
  methods: {
    initEcharts() {
      this.myEcharts.line1 = this.$echarts.init(this.$refs.line1)
      const option = {
        grid: {
          left: 10,
          containLabel: true,
          bottom: 10,
          top: 10,
          right: 30
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      }
      this.myEcharts.line1.setOption(option)
    },
    initEcharts2() {
      this.myEcharts.line2 = this.$echarts.init(this.$refs.line2)
      const option = {
        grid: {
          left: 10,
          containLabel: true,
          bottom: 10,
          top: 10,
          right: 30
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line'
          }
        ]
      }
      this.myEcharts.line2.setOption(option)
    },
    initEcharts3() {
      this.myEcharts.bar1 = this.$echarts.init(this.$refs.bar1)
      const option = {
        grid: {
          left: 10,
          containLabel: true,
          bottom: 10,
          top: 10,
          right: 30
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar'
          }
        ]
      }
      this.myEcharts.bar1.setOption(option)
    }

  }
}
