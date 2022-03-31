<template>
  <div class="dashboard-editor-container">
    <!-- <github-corner class="github-corner" /> -->
    <panel-group ref="panel_group" />

    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <inspection-line-chart ref="raddar_chart" />
          <abnormal-bar-chart ref="abnormalBarChart" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <abnormal-line-chart ref="abnormalLineChart" />
        </div>
      </el-col> -->
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <full-month-abnormal-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <template>
          <el-tabs v-model="activeName" style="background-color: #fff;" @tab-click="handleClick">
            <el-tab-pane label="控制组" name="first">
              <!-- <check-by-group ref="check_by_group" @send-pie-data="sendPieData" /> -->
              <check-by-tree @send-pie-data="sendPieData" />
            </el-tab-pane>
            <el-tab-pane label="检验项目" name="second">
              <check-by-chart ref="check_by_chart" @send-pie-data="sendPieData" />
            </el-tab-pane>
            <!-- <el-tab-pane label="树" name="third">
              <check-by-tree @send-pie-data="sendPieData" />
            </el-tab-pane> -->
          </el-tabs>
        </template>

      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-bottom:30px;">
        <pie-chart1 ref="pie_chart1" class="chart-wrapper" style="padding: 0;" />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="padding-bottom:30px;">
        <pie-chart4 ref="pie_chart4" class="chart-wrapper" style="padding: 0;" />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import PanelGroup from './components/PanelGroup'

// import checkByGroup from './components/checkByGroup'
import checkByTree from './components/checkByTree'
import checkByChart from './components/checkByChart'
import PieChart1 from './components/PieChart1'

import PieChart4 from './components/PieChart4'

import FullMonthAbnormalChart from './components/fullMonthAbnormalChart'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    // checkByGroup,
    checkByChart,
    checkByTree,
    PieChart1,
    PieChart4,
    FullMonthAbnormalChart
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  async created() {
  },
  methods: {
    handleClick(activeName) {
      if (activeName === 'first') {
        // this.$refs['check_by_group'].refresh()
      } else {
        this.$refs['check_by_chart'].refresh()
      }
    },
    sendPieData(data) {
      this.$refs.pie_chart1.initChart(data)
      this.$refs.pie_chart4.initChart(data)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
  .chart-wrapper2 {
    background: #fff;
    padding: 16px 16px 0;
  }
  .el-tabs__header {
    margin-bottom:  0;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
