<template>
  <dynamic-table
    ref="dy_table"
    v-model="select_row"
    :header-list="header_list"
    :request="request_data"
    :page-sizes="[20,60,100]"
    :fixed-height="'400px'"
    :auto-init="false"
    @select="select_callback"
    @row-click="row_click"
  >
    <template slot="cell-template" slot-scope="data">
      <!-- <el-progress v-if="['oos','ooc'].includes(data.list.template)" :percentage="parseFloat(data.cellValue)" color="#67C23A" /> -->
      <el-progress v-if="['ooc'].includes(data.list.template) && parseFloat(data.row['OOC异常率']) !== 0" :percentage="parseFloat(data.cellValue)" color="#67C23A" />
      <el-progress v-else-if="['oos'].includes(data.list.template) && parseFloat(data.row['OOS异常率']) !== 0" :percentage="parseFloat(data.cellValue)" color="#67C23A" />
      <template v-else-if="['oos'].includes(data.list.template) && parseFloat(data.row['OOS异常率']) === 0">
        <div style="width: 100%; text-align:center">-</div>
      </template>
      <template v-else-if="['ooc'].includes(data.list.template) && parseFloat(data.row['OOC异常率']) === 0">
        <div style="width: 100%; text-align:center">-</div>
      </template>
      <template v-else>
        {{ data.cellValue }}
      </template>

    </template>
  </dynamic-table>

</template>

<script>

export default {
  data() {
    return {
      select_row: {},
      header_list: [
        { prop: 'control_chart_name', label: '控制组名称' },
        { prop: 'inspection_name', label: '检测项目' },
        // { prop: '待处理', label: '待处理' },
        // { prop: '待审核', label: '待审核' },
        // { prop: '已处理', label: '已处理' },
        // { prop: '处理率', label: '处理率'
        // { prop: 'OOS异常率', label: 'OOS异常率' },
        { prop: 'OOS异常回复率', label: 'OOS异常回复率', template: 'oos' },
        // { prop: 'OOC异常率', label: 'OOC异常率' },
        { prop: 'OOC异常回复率', label: 'OOC异常回复率', template: 'ooc' }
      ]
      // list: null
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    refresh() {
      this.$nextTick(() => {
        this.$refs.dy_table.refresh()
      })
    },
    row_click(row) {
      this.$emit('send-pie-data', row)
    },
    async request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.dashboard_getAbnormal({
        'page': page_no,
        'limit': page_size
      })
      if (code === '200' && data) {
        if (!data.abnormalPage || !data.abnormalPage.list) {
          return {
            data: [],
            total: 0
          }
        }
        const d = data.abnormalPage.list[0]
        this.select_row = { id: d.id }
        this.row_click(d)
        return {
          data: data.abnormalPage.list,
          total: data.abnormalPage.totalCount
        }
      }
    },
    select_callback() {},
    fetchData(records) {
    }
  }
}
</script>
