import { debounce } from '@/utils/tools'
export default {
  data() {
    return {
      form2: {
        controlChartSonId: '',
        controlChartCode: '',
        inspectionName: ''
      },
      select_row2: {},
      header_list2: [
        { prop: 'id', label: '控制图ID', width: '160' },
        // { prop: 'states', label: '状态', width: '60', template: 'states', align: 'center' },
        { prop: 'controlChartCode', label: '编号', width: '140' },
        { prop: 'controlChartName', label: '控制组名称', width: '180' },
        { prop: 'inspectionName', label: '检测项目', minWidth: '200' },
        { prop: 'controlChartType', label: '图类', width: '80' },
        { prop: 'sampleSize', label: '样本容量', width: '100' },
        { prop: 'usl', label: '规格上限', width: '150' },
        { prop: 'sl', label: '目标值', width: '150' },
        { prop: 'lsl', label: '规格下限', width: '150' }
        // { prop: 'discriminationRules', label: '判异规则', width: '280' },
        // { prop: 'userName', label: '更新用户', width: '150' },
        // { prop: 'updateDate', label: '更新时间', width: '150' }
      ]
    }
  },
  methods: {
    query2() {
      this.$refs.dy_table2.refresh({ keep: true })
    },
    async request_data2({ page_no, page_size, table_data }) {
      if (!this.current_tree_node_key) {
        // this.$message.warning('请点击选择一个控制组!,若没有请添加控制组!')
        return
      }

      const params = {
        isAbnormal: 1, // 去掉没有异常的控制图
        'controlGroupId': this.current_tree_node_key,
        'controlChartSonId': this.form2.controlChartSonId,
        'controlChartCode': this.form2.controlChartCode,
        'inspectionName': this.form2.inspectionName,
        'limit': page_size,
        'page': page_no
      }
      const { code, data } = await this.$api.abnormalControlChart_list(params)
      if (code === '200' && data) {
        if (data.list.length > 0) {
          this.select_row2 = data.list[0]
        } else {
          this.select_row2 = {}
          this.form.controlChartIds = ''
          this.$refs.dy_table.refresh()
        }
        const d = {
          data: data.list.map(item => ({
            ...item
            // states: this.formatter_states(item)
          })),
          total: data.totalCount
        }
        return d
      }
    },
    m: debounce(({ vm, data }) => {
      if (data) {
        vm.form.controlChartIds = data.id
        vm.$refs.dy_table.refresh()
      }
    }, 50),
    select_callback2(data) {
      // console.log(111)
      this.m({ vm: this, data })
    }
  }
}
