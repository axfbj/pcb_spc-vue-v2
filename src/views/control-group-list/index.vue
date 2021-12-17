<template>
  <el-row>
    <el-col :span="4" style="border-right: 1px solid #ccc;">
      <container-layout ref="left_tree">
        <template v-slot:btns>
          <el-row>
            <el-col :span="8" style="text-align: left; font-size: 14px;">
              控制组列表
            </el-col>
            <el-col :span="16" style="text-align: right;">
              <el-button-group>
                <ki-button type="primary" icon="el-icon-plus" @click="tree_add" />
                <ki-button type="warning" icon="el-icon-edit" @click="tree_edit" />
                <ki-message-box
                  :next="tree_del_next"
                  style="float: left;"
                  @click="tree_del"
                >
                  <ki-button type="danger" icon="el-icon-delete" />
                </ki-message-box>
              </el-button-group>
            </el-col>
          </el-row>
        </template>
        <template v-slot:custum_content>
          <control-group-tree
            ref="tree"
            @node-click="node_click"
            @render-after="render_after"
            @path-change="path_change"
          />
        </template>
      </container-layout>
    </el-col>
    <el-col :span="20">
      <container-layout ref="control-pic-list">
        <template v-slot:btns>
          <el-row>
            <span style="font-size: 14px; color: #008040;">控制组路径: {{ path }}</span>
            <span style="float: right;">
              <ki-button
                type="primary"
                @click="badGroup_btn"
              >不良分组</ki-button>
              <ki-button
                type="primary"
                @click="check_setting_dialog"
              >控制图设置</ki-button>
              <ki-button type="warning" @click="inspectionr_record_btn">单项目输入</ki-button>
              <ki-message-box
                :next="del"
                @click="del_btn"
              >
                <ki-button
                  type="danger"
                  style="margin-left: 10px;"
                >删除</ki-button>
              </ki-message-box>
            </span>
          </el-row>

        </template>
        <template v-slot:form>
          <el-form-item label="日期:">
            <el-date-picker
              v-model="form.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="form.controlChartStatus" placeholder="请选择" clearable style="width: 100px;">
              <el-option
                v-for="item in options.states"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <!-- <allow-create-select
              v-model="form.state"
              style="width: 100px;"
              :options="options.states"
            /> -->
          </el-form-item>
          <el-form-item label="编号:">
            <el-input v-model="form.controlChartCode" style="width: 140px;" clearable />
          </el-form-item>
          <el-form-item label="检测项目:">
            <allow-create-select
              v-model="form.inspectionItemsId"
              style="width: 100px;"
              :options="options.inspectionNames"
              :props="inspectionNamesProps"
              @focus="getInspectionNames"
            />
          </el-form-item>
          <el-form-item label="图类:">
            <allow-create-select
              v-model="form.controlChartType"
              style="width:100px"
              :options="options.chartTypes"
              :props="chartTypesProps"
              @focus="getChartTypes"
            />
          </el-form-item>
          <el-form-item v-for="item in hierarchicalTypes" :key="item.id" :label="item.hierarchicalName">
            <!-- :disabled="disabled_select_arr.includes(String(item.serialNumber))" -->
            <allow-create-select
              v-model="form[`hierarchicalTypeValue${parseNum[item.serialNumber]}`]"
              style="width:100px"
              :props="hierarchicalTypeProps"
              :options="options[`hierarchicalType${item.serialNumber}`]"
              @focus="getHierarchicalType(item.id)"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search_btn"
            >查询</el-button>
          </el-form-item>

        </template>
        <template v-slot:custum_content>
          <dynamic-table
            ref="dy_table"
            v-model="select_row"
            :auto-init="false"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[20,60,100]"
            fixed-height="100%"
            @select="select_callback"
          >
            <template slot="cell-template" slot-scope="data">
              <status-flag v-if="data.list.template === 'states'" :states="data.cellValue" />
              <template v-else-if="data.list.template === 'hierarchicalType'">
                {{ data.cellValue || 'N/A' }}
              </template>
              <!-- <el-link v-if="data.list.template === 'link'" type="primary" @click="detail_dialog(data.scope)">{{ data.cellValue }}</el-link> -->
              <template v-else>{{ data.cellValue }}</template>
            </template>
          </dynamic-table>
        </template>
        <template v-slot:footer>
          <div class="states-list">
            <span
              v-for="(item,index) in states_text"
              :key="index"
            >
              <rectangle
                v-if="item.flag === 'history'"
                :state="item.state"
              />
              <round-shape
                v-else
                :state="item.state"
              />
              {{ item.text }}
            </span>
          </div>
        </template>
      </container-layout>
    </el-col>
    <control-chart-settings
      :control-group-id="current_tree_node_key"
      :visible="chartSetting_dialog"
      top="5vh"
      :tree-path="path"
      :setting-flag="control_chart_settings_flag"
      :select-row="select_row"
      @handleClose="chartSetting_dialog=false"
      @confirm="control_chart_settings_confirm"
    />
    <add-group-tree-dialog
      :visible="add_group_tree_dialog"
      :flag="tree_flag"
      :node-data="current_tree_node_data"
      @handleClose="tree_dialog_close"
      @confirm="tree_confirm"
    />

    <bad-group-dialog
      :select-row="select_row"
      :visible="badGroup_dialog"
      @handleClose="badGroup_close"
      @confirm="badGroup_confirm"
    />
  </el-row>

</template>

<script>
import { AllowCreateSelect } from '@/components/form-item'
import Rectangle from './components/status-graph/rectangle'
import RoundShape from './components/status-graph/round-shape'
import StatusFlag from './components/status-graph/status-flag'
import ControlChartSettings from './components/control-chart-settings'
import ControlGroupTree from './components/control-group-tree'
import AddGroupTreeDialog from './components/add-group-tree-dialog'
import HierarchicalTypeData from './components/mixins/hierarchicalType-data'
import BadGroupDialog from './components/bad-group-dialog'
import { mapGetters } from 'vuex'
export default {
  name: 'ControlGroupList',
  components: {
    Rectangle,
    RoundShape,
    AllowCreateSelect,
    ControlChartSettings,
    ControlGroupTree,
    AddGroupTreeDialog,
    StatusFlag,
    BadGroupDialog
  },
  mixins: [HierarchicalTypeData],
  data() {
    return {
      badGroup_dialog: false,
      tree_flag: '',
      badGroup_flag: '',
      control_chart_settings_flag: '',
      // current_tree_node_key: '',
      current_tree_node_data: {},
      add_group_tree_dialog: false,
      chartSetting_dialog: false,
      parseNum: {
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine'
      },
      states_text: [
        { flag: 'history', state: '0', text: '历史点未失控' },
        { flag: 'history', state: '1', text: '历史点未处理' },
        { flag: 'history', state: '2', text: '历史点已处理' },
        { flag: 'last', state: '0', text: '最后点未失控' },
        { flag: 'last', state: '1', text: '最后点未处理' },
        { flag: 'last', state: '2', text: '最后点已处理' }
      ],
      item2: {},
      header_list: [
        { prop: 'id', label: '控制图ID', width: '180' },
        { prop: 'states', label: '状态', width: '80', template: 'states' },
        { prop: 'controlChartCode', label: '编号', width: '180' },
        { prop: 'inspectionName', label: '检测项目', width: '150' },
        { prop: 'controlChartType', label: '图类', width: '150' },
        { prop: 'sampleSize', label: '样本容量', width: '150' },
        '$1',
        // { prop: 'hierarchicalTypeValueOne', label: '产品型号', width: '150' },
        // { prop: 'hierarchicalTypeValueTwo', label: '产品名称', width: '150' },
        // { prop: 'hierarchicalTypeValueThree', label: '产线', width: '150' },
        // { prop: 'hierarchicalTypeValueFour', label: '班次', width: '150' },
        // { prop: 'hierarchicalTypeValueFive', label: '设备', width: '150' },
        // { prop: 'hierarchicalTypeValueSix', label: '供应商', width: '150' },
        // { prop: 'hierarchicalTypeValueSeven', label: '客户', width: '150' },
        // { prop: 'hierarchicalTypeValueEight', label: '批次', width: '150' },
        // { prop: 'hierarchicalTypeValueNine', label: '工单编号', width: '150' },
        { prop: 'usl', label: '规格上限', width: '150' },
        { prop: 'sl', label: '目标值', width: '150' },
        { prop: 'lsl', label: '规格下限', width: '150' },
        { prop: 'discriminationRules', label: '判异规则', width: '150' },
        { prop: 'userName', label: '更新用户', width: '150' },
        { prop: 'updateDate', label: '更新时间', width: '150' }
      ],
      form: {
        // name: '',
        // region: '',
        // date1: '',
        // date2: '',
        // delivery: false,
        // type: [],
        // resource: '',
        // desc: ''
      },
      select_row: [],
      path: ''
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes']),
    current_tree_node_key() {
      return this.current_tree_node_data.id
    }
  },
  created() {
    const inx = this.header_list.indexOf('$1')
    const headers = []
    this.hierarchicalTypes.forEach(item => {
      const o = {
        prop: `hierarchicalTypeValue${this.parseNum[item.serialNumber]}`,
        label: item.hierarchicalName,
        width: '150',
        template: 'hierarchicalType'
      }
      headers.push(o)
    })
    this.header_list.splice(inx, 1, ...headers)
  },
  methods: {
    badGroup_btn() {
      this.badGroup_dialog = true
    },
    badGroup_confirm(flag) {
      if (flag === 'link') {
        this.toDetils()
      }
      this.badGroup_dialog = false
    },
    badGroup_close() {
      this.badGroup_dialog = false
    },
    toDetils() {
      this.$router.push({ path: '/statistical-process-control/control-chart-details', query: { controlChartSonId: this.select_row[0].id, controlChartType: this.select_row[0].controlChartType }})
    },
    formatter_states(row) {
      const { historicalPointNotOutOfControl, historicalPointNotHandle, historicalPointHandle } = row
      const { lastPointNotOutOfControl, lastPointNotHandle, lastPointHandle } = row
      const historicalPoint = [historicalPointNotOutOfControl, historicalPointNotHandle, historicalPointHandle]
      const lastPoint = [lastPointNotOutOfControl, lastPointNotHandle, lastPointHandle]
      const state1 = historicalPoint.indexOf(1)
      const state2 = lastPoint.indexOf(1)
      return [String(state1), String(state2)]
    },
    async inspectionr_record_btn() {
      // 单项目输入跳转
      if (this.select_row.length === 0) {
        this.$message.warning('请选择一行数据')
      }
      if (Array.isArray(this.select_row) && this.select_row.length > 1) {
        this.$message.warning('查看控制图设置详情只能选择一行')
        return
      }

      if (['p', 'np'].includes(this.select_row[0].controlChartType)) {
        // this.controlChartSonId
        const { code, data } = await this.$api.badDefinitionGroup_info({ id: this.select_row[0].id })
        if (code === '200' && data) {
          if (data.length === 0) {
            this.$confirm('此控制图需要进行不良分组', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.badGroup_btn()
            }).catch(() => {
            })
          } else {
            this.toDetils()
          }
        }
      } else {
        this.toDetils()
      }
    },
    control_chart_settings_confirm() {
      this.chartSetting_dialog = false
      this.$refs.dy_table.refresh()
    },
    path_change(path) {
      this.path = path
    },
    formart_hierarchicalType() {},
    render_after(currentData) {
      this.current_tree_node_data = currentData
      this.$refs.dy_table.refresh({ keep: true })
    },
    check_setting_dialog() {
      if (['[]', '{}'].includes(JSON.stringify(this.select_row))) {
        this.control_chart_settings_flag = 'add'
      } else {
        if (Array.isArray(this.select_row) && this.select_row.length > 1) {
          this.$message.warning('查看控制图设置详情只能选择一行')
          return
        }
        this.control_chart_settings_flag = 'update'
      }
      this.chartSetting_dialog = true
    },
    search_btn() {
      if (!this.form.date) {
        this.$message.warning('必须选择一个时间段！！')
        return
      }
      this.$refs.dy_table.refresh()
    },
    tree_confirm() {
      this.$refs.tree.refresh()
    },
    tree_add() {
      this.tree_flag = 'add'
      this.add_group_tree_dialog = true
    },
    tree_edit() {
      this.tree_flag = 'edit'
      this.add_group_tree_dialog = true
    },
    tree_del(open) {
      if (!this.current_tree_node_data.id) {
        this.$message.warning('请选择一个节点')
        return
      }
      open()
    },
    async tree_del_next(flag) {
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const { code, data } = await this.$api.controlGroup_delete([this.current_tree_node_key])
      if (code === '200' && data) {
        this.$message.success('删除成功！')
      }
      this.$refs.tree.refresh()
    },
    tree_dialog_close() {
      this.add_group_tree_dialog = false
    },
    node_click(data, node, com) {
      this.current_tree_node_data = data
      this.$refs.dy_table.refresh()
    },
    del_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    async del(flag) {
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }

      const ids = Array.isArray(this.select_row) ? this.select_row.map(item => item.id) : [this.select_row.id]
      const { code, data } = await this.$api.controlChartSon_delete(ids)
      if (code === '200' && data) {
        this.select_row = []
        this.$message.success('删除成功！')
        this.$refs.dy_table.refresh()
      }
    },
    async request_data({ page_no, page_size, table_data }) {
      const { controlChartCode,
        controlChartType,
        inspectionItemsId,
        controlChartStatus,
        hierarchicalTypeValueOne,
        hierarchicalTypeValueTwo,
        hierarchicalTypeValueThree,
        hierarchicalTypeValueFour,
        hierarchicalTypeValueFive,
        hierarchicalTypeValueSix,
        hierarchicalTypeValueSeven,
        hierarchicalTypeValueEight,
        hierarchicalTypeValueNine
      } = this.form
      const params = {
        'controlGroupId': this.current_tree_node_key,
        controlChartCode,
        controlChartType,
        controlChartStatus,
        inspectionItemsId,
        hierarchicalTypeValueOne,
        hierarchicalTypeValueTwo,
        hierarchicalTypeValueThree,
        hierarchicalTypeValueFour,
        hierarchicalTypeValueFive,
        hierarchicalTypeValueSix,
        hierarchicalTypeValueSeven,
        hierarchicalTypeValueEight,
        hierarchicalTypeValueNine,
        'limit': page_size,
        'order': 'asc',
        'page': page_no,
        // 'sidx': '',
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : ''
      }
      const { code, data } = await this.$api.controlChart_list(params)
      if (code === '200' && data) {
        return {
          data: data.list.map(item => ({
            ...item,
            states: this.formatter_states(item)
          })),
          total: data.totalCount
        }
      }
    },
    select_callback(data) {
    }
  }
}
</script>

<style lang="scss" scoped>
.states-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  padding-bottom: 2px;
  // span {
  // &+span {
  //   margin-left: 10px;
  // }
  // }
}
</style>
