<template>
  <el-row>
    <el-col :span="4" style="border-right: 1px solid #ccc;">
      <container-layout ref="left_tree">
        <template v-slot:btns>
          <el-row>
            <span style="float: left;" class="c-text">
              控制组列表
            </span>
            <span style="float: right;">
              <el-button-group>
                <ki-button v-permission="['control.group.save']" type="primary" icon="el-icon-plus" @click="tree_add" />
                <!-- <ki-button v-permission="['control.group.update']" type="warning" icon="el-icon-edit" @click="tree_edit" />
                <ki-message-box
                  v-permission="['control.group.delete']"
                  :next="tree_del_next"
                  style="float: left;"
                  @click="tree_del"
                >
                  <ki-button type="danger" icon="el-icon-delete" />
                </ki-message-box> -->
              </el-button-group>
            </span>
          </el-row>
        </template>
        <template v-slot:custum_content>
          <control-group-tree
            ref="tree"
            @node-click="node_click"
            @render-after="render_after"
            @path-change="path_change"
            @menu-click="tree_menu_click"
          />
        </template>
      </container-layout>
    </el-col>
    <el-col :span="20">
      <container-layout ref="control-pic-list">
        <template v-slot:btns>
          <el-row>
            <span style="font-size: 14px; color: #008040;">控制组路径: {{ path.pathStr }}</span>
            <span style="float: right;">
              <!-- <ki-button
                type="primary"
                @click="compare_graphs_btn"
              >多图对比</ki-button> -->
              <ki-button
                v-permission="['badDefinitionGroup.update']"
                type="primary"
                icon="el-icon-s-fold"
                @click="badGroup_btn"
              >不良分组</ki-button>
              <ki-button
                v-permission="['control.save']"
                type="primary"
                icon="el-icon-plus"
                @click="check_setting_dialog('add')"
              >新增控制图</ki-button>
              <!-- <ki-button
                v-permission="['control.update']"
                type="warning"
                @click="check_setting_dialog('update')"
              >修改控制图</ki-button> -->

              <!-- 'inspectionRecord.save',
                    'inspectionRecord.update',
                    'inspectionRecord.delete',
                    'excel.inspectionRecordExcel' -->
              <!-- <ki-button
                v-permission="['inspectionRecord.list']"
                type="warning"
                @click="inspectionr_record_btn"
              >单项目输入</ki-button> -->
              <ki-message-box
                v-permission="['control.delete']"
                :next="del"
                @click="del_btn"
              >
                <ki-button
                  type="danger"
                  style="margin-left: 10px;"
                  icon="el-icon-delete"
                >删除</ki-button>
              </ki-message-box>
            </span>
          </el-row>

        </template>
        <template v-slot:form>
          <el-form-item label="更新时间:">
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
            row-contextmenu
            :menu-items="menu_items"
            @row-dbclick="dbclick"
            @select="select_callback"
            @menu-click="menu_click"
          >
            <template slot="cell-template" slot-scope="data">
              <status-flag v-if="data.list.template === 'states'" :states="data.cellValue" />
              <template v-else-if="data.list.template === 'controlLimitStatus'">
                <el-tag v-if="data.cellValue === '解析'" type="info">{{ data.cellValue }}</el-tag>
                <el-tag v-if="data.cellValue === '管制'" type="primary">{{ data.cellValue }}</el-tag>
              </template>
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
    <!-- 控制图设置弹框 -->
    <control-chart-settings
      :control-group-id="current_tree_node_key"
      :visible="chartSetting_dialog"
      top="5vh"
      :tree-path="path"
      :setting-flag="control_chart_settings_flag"
      :select-row="select_row"
      :send-row="send_row"
      @handleClose="control_chart_settings_close"
      @confirm="control_chart_settings_confirm"
    />
    <!-- 批量控制图设置弹框 -->
    <batch-control-chart-settings
      :control-group-id="current_tree_node_key"
      :visible="batch_chartSetting_dialog"
      top="5vh"
      :tree-path="path"
      :setting-flag="batch_control_chart_settings_flag"
      :select-row="select_row"
      @handleClose="batch_control_chart_settings_close"
      @confirm="batch_control_chart_settings_confirm"
    />
    <!-- 树图添加节点 -->
    <add-group-tree-dialog
      :visible="add_group_tree_dialog"
      :flag="tree_flag"
      :node-data="current_tree_node_data"
      @handleClose="tree_dialog_close"
      @confirm="tree_confirm"
    />
    <!-- 不良定义分组 -->
    <bad-group-dialog
      :select-row="select_row"
      :visible="badGroup_dialog"
      @handleClose="badGroup_close"
      @confirm="badGroup_confirm"
    />
    <multiple-entry-dialog
      :select-row="select_row"
      :visible="multipleEntry_dialog"
      @handleClose="multipleEntry_dialog_close"
      @confirm="multipleEntry_dialog_confirm"
    />
    <copy-position-dialog
      :level="level"
      :copy-node="copy_node"
      :current-tree-node-data="current_tree_node_data"
      :visible="copyPosition_dialog"
      @handleClose="copyPosition_dialog_close"
      @confirm="copyPosition_dialog_confirm"
    />
  </el-row>

</template>

<script>
import { AllowCreateSelect } from '@/components/form-item'
import Rectangle from './components/status-graph/rectangle'
import RoundShape from './components/status-graph/round-shape'
import StatusFlag from './components/status-graph/status-flag'
import ControlChartSettings from './components/control-chart-settings'
import BatchControlChartSettings from './components/batch-control-chart-settings'
import ControlGroupTree from './components/control-group-tree'
import AddGroupTreeDialog from './components/add-group-tree-dialog'
import BadGroupDialog from './components/bad-group-dialog'
import HierarchicalTypeData from './mixins/hierarchicalType-data'
import compare_graphs from './mixins/compare-multiple-graphs'
import batch_control_chart_settings_dialog from './mixins/batch-control-chart-settings-dialog'
import MultipleEntryDialog from './components/multiple-entry-dialog'
import multiple_entry_dialog from './mixins/multiple-entry-dialog'
import CopyPositionDialog from './components/copy-position-dialog'
import copy_position_dialog from './mixins/copy-position-dialog'
import copy_chart from './mixins/copy-chart.js'
import { mapGetters } from 'vuex'
export default {
  name: 'ControlGroupList',
  components: {
    Rectangle,
    RoundShape,
    AllowCreateSelect,
    ControlChartSettings,
    BatchControlChartSettings,
    ControlGroupTree,
    AddGroupTreeDialog,
    StatusFlag,
    BadGroupDialog,
    // 多项目输入弹框
    MultipleEntryDialog,
    CopyPositionDialog
  },
  mixins: [HierarchicalTypeData, compare_graphs, batch_control_chart_settings_dialog, multiple_entry_dialog, copy_position_dialog, copy_chart],
  data() {
    return {
      // count_graph: ['p', 'np', 'c', 'u'],
      menu_items: [
        {
          key: '1',
          label: '修改控制图',
          permission: ['control.update']

        },
        {
          key: '2',
          label: '单项目输入',
          permission: ['inspectionRecord.list']
        },
        {
          key: '3',
          label: '多图对比',
          permission: ['control.comparison']
        },
        {
          key: '4',
          label: '批量修改控制图',
          permission: ['control.update']

        },
        {
          key: '5',
          label: '多项目录入',
          permission: ['inspectionRecord.save']
        },
        {
          key: '6',
          label: '复制控制图'
        },
        {
          key: '7',
          label: '粘贴控制图(包含数据)'
        },
        {
          key: '8',
          label: '粘贴控制图(不包含数据)'
        }
      ],

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
      header_data: [
        { prop: 'id', label: '控制图ID', width: '160' },
        { prop: 'states', label: '状态', width: '60', template: 'states', align: 'center' },
        { prop: 'controlLimitStatus', label: '控制限状态', width: '85', template: 'controlLimitStatus', align: 'center' },
        { prop: 'controlChartCode', label: '编号', width: '140' },
        { prop: 'inspectionName', label: '检测项目', width: '200' },
        { prop: 'controlChartType', label: '图类', width: '80' },
        { prop: 'sampleSize', label: '样本容量', width: '100' },
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
        { prop: 'discriminationRules', label: '判异规则', width: '280' },
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
      send_row: {},
      path: ''
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes', 'powerCodes', 'commonVariable']),
    current_tree_node_key() {
      return this.current_tree_node_data.id || ''
    },
    header_list() {
      const inx = this.header_data.indexOf('$1')
      const temp_headers = JSON.parse(JSON.stringify(this.header_data))
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
      temp_headers.splice(inx, 1, ...headers)
      return temp_headers
    },
    count_graph() {
      return this.commonVariable['count_graph']
    }
  },
  created() {
    Object.freeze(this.header_data)
  },
  activated() {
    this.$refs.dy_table.refresh({ keep: true })
  },
  methods: {
    tree_menu_click({ node, menuKey }) {
      if (menuKey === '1') { // 添加
        this.tree_add()
      } else if (menuKey === '2') {
        this.tree_edit()
      } else if (menuKey === '3') {
        if (Object.hasOwnProperty.call(this.current_tree_node_data, 'children') && Array.isArray(this.current_tree_node_data['children']) && this.current_tree_node_data['children'].length !== 0) {
          this.$message.warning('不能直接删除含有子节点的节点')
          return
        }
        this.tree_del_next()
      } else if (menuKey === '4') {
        this.copy_node = node.data
        this.$message.info('复制成功')
      } else if (menuKey === '5') {
        if (!Object.hasOwnProperty.call(this.copy_node, 'id')) {
          this.$message.warning('没有复制一个控制组')
          return
        }
        this.copyPosition_dialog_btn({ level: '1' })
      } else if (menuKey === '6') {
        if (!Object.hasOwnProperty.call(this.copy_node, 'id')) {
          this.$message.warning('没有复制一个控制组')
          return
        }
        this.copyPosition_dialog_btn({ level: '0' })
      }
    },
    menu_click({ row, menuKey }) {
      if (menuKey === '1') { // 修改控制图
        this.check_setting_dialog('update', row)
      } else if (menuKey === '2') { // 单项目输入
        this.inspectionr_record_btn({ row })
      } else if (menuKey === '3') { // 多图对比
        this.compare_graphs_btn({ rows: this.select_row })
      } else if (menuKey === '4') { // 批量修改
        this.batch_setting_dialog(true)
      } else if (menuKey === '5') { // 多项目录入
        const has_count_graph = this.select_row.some(item => this.count_graph.includes(item.controlChartType))
        if (has_count_graph) {
          this.$message.warning('多项目输入只支持Xbar-R、Xbar-s、X-MR')
          return
        }
        this.multipleEntry_dialog_btn(true)
      } else if (menuKey === '6') {
        this.copy_chart_btn()
      } else if (['7', '8'].includes(menuKey)) {
        if (this.copy_chart.length === 0) {
          this.$message.warning('没有复制一个控制图')
          return
        }
        this.paste_chart_btn(menuKey)
      }
    },

    dbclick() {
      this.inspectionr_record_btn({ row: this.select_row[0] })
    },
    badGroup_btn() {
      // 单项目输入跳转
      if (this.select_row.length === 0) {
        this.$message.warning('请选择一行数据')
        return
      }
      if (Array.isArray(this.select_row) && this.select_row.length > 1) {
        this.$message.warning('不良分组只能选择一行')
        return
      }
      if (!this.count_graph.includes(this.select_row[0].controlChartType)) {
        this.$message.warning('只有计数型图类才需要进行不良分组!')
        return
      }
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
      const { controlLimitStatus, id, controlChartType } = this.select_row[0]
      this.$router.push({ path: '/statistical-process-control/control-chart-details', query: {
        controlGroupId: this.current_tree_node_key,
        controlChartSonId: id,
        // controlChartCode: this.select_row[0].controlChartCode,
        controlChartType,
        controlLimitStatus: controlLimitStatus === '解析' ? '0' : '1'
      }})
    },
    formatter_states(row) { // 格式化控制图状态
      const { historicalPointNotOutOfControl, historicalPointNotHandle, historicalPointHandle } = row
      const { lastPointNotOutOfControl, lastPointNotHandle, lastPointHandle } = row
      const historicalPoint = [historicalPointNotOutOfControl, historicalPointNotHandle, historicalPointHandle]
      const lastPoint = [lastPointNotOutOfControl, lastPointNotHandle, lastPointHandle]
      const state1 = historicalPoint.indexOf(1)
      const state2 = lastPoint.indexOf(1)
      return [String(state1), String(state2)]
    },
    async inspectionr_record_btn({ row }) {
      // 单项目输入跳转
      // if (this.select_row.length === 0) {
      //   this.$message.warning('请选择一行数据')
      //   return
      // }
      // if (Array.isArray(this.select_row) && this.select_row.length > 1) {
      //   this.$message.warning('查看控制图设置详情只能选择一行')
      //   return
      // }
      if (this.count_graph.includes(row.controlChartType)) {
        // this.controlChartSonId
        const { code, data } = await this.$api.badDefinitionGroup_info({ id: row.id })
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
      this.send_row = {}
      this.chartSetting_dialog = false
      this.$refs.dy_table.refresh()
    },
    control_chart_settings_close(refresh) {
      this.chartSetting_dialog = false
      refresh && this.$refs.dy_table.refresh({ keep: true })
    },
    path_change(path) {
      this.path = path
    },
    formart_hierarchicalType() {},
    render_after(currentData) {
      this.current_tree_node_data = currentData
      this.$refs.dy_table.refresh({ keep: true })
    },
    check_setting_dialog(flag, row) {
      if (row) {
        this.send_row = row
      }
      if (!this.current_tree_node_key) {
        this.$message.warning('添加控制图需要选中一个节点！')
        return
      }
      this.control_chart_settings_flag = flag
      // if (this.control_chart_settings_flag === 'update') {
      //   if (!this.$refs.dy_table.one_row_select()) return
      //   if (Array.isArray(this.select_row) && this.select_row.length > 1) {
      //     this.$message.warning('查看控制图设置详情只能选择一行')
      //     return
      //   }
      // }

      // if (this.control_chart_settings_flag === 'add') {
      //   if (!this.current_tree_node_key) {
      //     this.$message.warning('请选择一个控制组')
      //     return
      //   }
      // }
      // if (['[]', '{}'].includes(JSON.stringify(this.select_row))) {
      //   this.control_chart_settings_flag = 'add'
      // } else {
      //   if (Array.isArray(this.select_row) && this.select_row.length > 1) {
      //     this.$message.warning('查看控制图设置详情只能选择一行')
      //     return
      //   }
      //   this.control_chart_settings_flag = 'update'
      // }
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
    // tree_del(open) {
    //   if (!this.current_tree_node_data.id) {
    //     this.$message.warning('请选择一个节点')
    //     return
    //   }
    //   console.log('this.current_tree_node_data', this.current_tree_node_data)
    //   if (Object.hasOwnProperty.call(this.current_tree_node_data, 'children') && Array.isArray(this.current_tree_node_data['children']) && this.current_tree_node_data['children'].length !== 0) {
    //     this.$message.warning('不能直接删除含有子节点的节点')
    //     return
    //   }

    //   open()
    // },
    async tree_del_next() {
      this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code, data } = await this.$api.controlGroup_delete([this.current_tree_node_key])
        if (code === '200' && data) {
          this.current_tree_node_data = {}
          this.$message.success('删除成功！')
          this.$refs.tree.refresh(this.$refs.tree.resetNodeData)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
      if (!this.current_tree_node_key) {
        // this.$message.warning('请点击选择一个控制组!,若没有请添加控制组!')
        return
      }
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
        // 'order': 'asc',
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
}

@media screen and (max-width: 1200px) {
    .c-text {
        // display: none;
        font-size: 14px;
    }
}

</style>
