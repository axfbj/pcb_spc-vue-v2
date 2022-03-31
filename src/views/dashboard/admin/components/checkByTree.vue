<template>
  <div style="height: 400px;" class="clearfix">
    <div style="width: 30%; height: 100%; overflow: auto; float: left; border-right: 1px solid #ccc; padding-top: 15px;">
      <control-group-tree
        ref="tree"
        @node-click="node_click"
        @render-after="render_after"
        @path-change="path_change"
      />
    </div>
    <div style="float: left; width: 70%; height: 100%; position:relative">
      <div class="abnormal-control-title">
        {{ path || '' }}
      </div>
      <div class="abnormal-progress">
        <div class="progress-content">
          <el-progress type="circle" :percentage="oos_percentage" :width="200" :stroke-width="20" color="#67C23A" :format="oosTextFormat" />
        </div>
        <div class="progress-content">
          <el-progress type="circle" :percentage="ooc_percentage" :width="200" :stroke-width="20" color="#67C23A" :format="oocTextFormat" />
        </div>
      </div>
      <!--  -->
    </div>
  </div>

</template>

<script>
import ControlGroupTree from './components/control-group-tree.vue'

export default {
  components: {
    ControlGroupTree
  },
  data() {
    return {
      oos_percentage: 0,
      ooc_percentage: 0,
      abnormalGroupData: {},
      current_tree_node_data: {},
      select_row: {},
      path: '',
      header_list: [
        { prop: '控制组名称', label: '控制组名称' },
        // { prop: 'inspection_name', label: '检测项目' },
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
  computed: {
    current_tree_node_key() {
      return this.current_tree_node_data.id
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    oosTextFormat(percentage) {
      if (parseFloat(this.abnormalGroupData['OOS异常率']) === 0) {
        return '-'
      }
      return `OOS回复率: ${percentage}%`
    },
    oocTextFormat(percentage) {
      if (parseFloat(this.abnormalGroupData['OOC异常率']) === 0) {
        return '-'
      }
      return `OOC回复率: ${percentage}%`
    },
    path_change(path) {
      // console.log(path)
      const { pathStr } = path
      const pathNames = pathStr.split('/')
      this.path = pathNames[pathNames.length - 1]
    },
    async getAbnormalGroupByControlGroupId() {
      const { code, data } = await this.$api.getAbnormalGroupByControlGroupId({
        controlGroupId: this.current_tree_node_key
      })
      if (code === '200' && data) {
        this.abnormalGroupData = data
        if (parseFloat(data['OOS异常率']) === 0) {
          this.oos_percentage = 100
        } else {
          this.oos_percentage = parseFloat(data['OOS异常回复率'])
        }

        if (parseFloat(data['OOC异常率']) === 0) {
          this.ooc_percentage = 100
        } else {
          this.ooc_percentage = parseFloat(data['OOC异常回复率'])
        }
        // data['OOS异常率'] = '50%'
        // data['OOC异常率'] = '50%'
        // console.log('data', data)
        this.$emit('send-pie-data', data)
        // console.log('data1111', data)
        // this.oos_percentage =
        // if()
      }
    },
    async node_click(data, node, com) {
      this.current_tree_node_data = data
      this.getAbnormalGroupByControlGroupId()
    },
    render_after(currentData) {
      this.current_tree_node_data = currentData
      this.getAbnormalGroupByControlGroupId()
    },
    select_callback() {},
    fetchData(records) {
    }
  }
}
</script>

<style lang="scss" scoped>
.abnormal-control-title {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  line-height: 50px;
}
 ::v-deep.abnormal-progress {
  position: absolute;
  width: 100%;
  left: 0;
  top: 200px;
  // top: 50%;
  transform: translate(0,-50%);
  .progress-content {
    width: 50%;
    text-align: center;
    float: left;
   .el-progress__text {
      font-size: 14px !important;
      font-weight: bold;
    }
    .el-progress-circle__track {
      stroke: #F56C6C;  //elementUi修改环形进度条底色
    }
  }

}
</style>
