<template>
  <el-row>
    <el-col :span="4" style="border-right: 1px solid #ccc;">
      <container-layout ref="left_tree">
        <template v-slot:btns>
          <el-row>
            <el-col :span="24" style="text-align: left; font-size: 14px;">
              控制组列表
            </el-col>
            <!-- <el-col :span="16" style="text-align: right;">
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
            </el-col> -->
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
      <container-layout ref="contenter">
        <template v-slot:btns>
          <div style="float: left;">
            <span style="font-size: 14px; color: #008040;">控制组路径: {{ path }}</span>
          </div>
          <div style="text-align: right;">
            <!-- <ki-button type="primary" @click="add">添加</ki-button> -->
            <ki-button type="warning" @click="exception_handling_btn">异常处理</ki-button>
            <!-- <ki-message-box :next="del" @click="del_btn">
              <ki-button type="danger" style="margin-left: 10px">删除</ki-button>
            </ki-message-box> -->
          </div>
        </template>
        <template v-slot:form>
          <el-form-item
            label="检测项目名称："
            prop="inspectionName"
          >
            <el-input
              v-model="form.inspectionName"
              style="width: 150px"
            />
          </el-form-item>
          <el-form-item label="检验时间:">
            <el-date-picker
              v-model="form.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="处理状态:">
            <el-checkbox-group v-model="form.checkList">
              <el-checkbox label="0">未处理</el-checkbox>
              <el-checkbox label="1">已处理</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="query"
            >查询</el-button>
          </el-form-item>
        </template>
        <template v-slot:custum_content>
          <dynamic-table
            ref="dy_table"
            v-model="select_row"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[20, 60, 100]"
            fixed-height="100%"
            :auto-init="false"
            @select="select_callback"
          >
            <template slot="cell-template" slot-scope="data">
              <template v-if="data.list.template === 'state'">
                <span :style="{color: data.cellValue === 0 ? 'red': '#9932CC'}">
                  {{ data.cellValue === 0? '未处理': '已处理' }}
                </span>
              </template>
              <!-- <el-link v-if="data.list.template === 'link'" type="primary" @click="detail_dialog(data.scope)">{{ data.cellValue }}</el-link> -->
              <template v-else>{{ data.cellValue }}</template>
            </template>
          </dynamic-table>
        </template>
      </container-layout>
    </el-col>

    <bad-item-dialog
      :visible="bad_item_dialog"
      :select-row="select_row"
      :flag="dialog_flag"
      @handleClose="dialog_close"
      @confirm="refresh"
    />
  </el-row>
</template>

<script>
import badItemDialog from './components/bad-item-dialog'
import ControlGroupTree from '../control-group-list/components/control-group-tree'
import { getMothStartAndEnd } from '@/utils/date-method'
export default {
  name: 'ExceptionHandling',
  components: {
    badItemDialog,
    ControlGroupTree
  },
  data() {
    return {
      path: '',
      current_tree_node_data: {},
      dialog_flag: 'add',
      bad_item_dialog: false,
      item2: {},
      header_list: [
        { prop: 'id', label: 'ID', width: '180' },
        { prop: 'abnormalCode', label: '失控编号', width: '180' },
        { prop: 'abnormalStatus', label: '状态', width: '180', template: 'state' },
        { prop: 'inspectionName', label: '检测项目', width: '180' },
        { prop: 'controlChartType', label: '图类', width: '180' },
        { prop: 'happenDate', label: '发生时间', width: '180' },
        { prop: 'abnormalInformation', label: '异常信息' }
      ],
      form: {
        inspectionName: '',
        date: getMothStartAndEnd(),
        checkList: []
      },
      select_row: {}
    }
  },
  computed: {
    current_tree_node_key() {
      return this.current_tree_node_data.id
    }
  },

  methods: {
    query() {
      if (!this.form.date) {
        this.$message.warning('必须选择一个时间段！！')
        return
      }
      this.refresh()
    },
    path_change(path) {
      this.path = path
    },
    node_click(data, node, com) {
      this.current_tree_node_data = data
      this.$refs.dy_table.refresh()
    },
    render_after(currentData) {
      this.current_tree_node_data = currentData
      this.$refs.dy_table.refresh({ keep: true })
    },
    // add() {
    //   this.dialog_flag = 'add'
    //   this.bad_item_dialog = true
    // },
    exception_handling_btn() {
      if (!this.$refs.dy_table.one_row_select()) return
      this.bad_item_dialog = true
    },
    // edit() {
    //   if (!this.$refs.dy_table.one_row_select()) return
    //   this.dialog_flag = 'edit'
    //   this.bad_item_dialog = true
    // },
    // del_btn(open) {
    //   if (!this.$refs.dy_table.one_row_select()) return
    //   open()
    // },
    // async del(flag) {
    //   const ids =
    //     typeof this.select_row === 'object'
    //       ? [this.select_row.id]
    //       : this.select_row.map((item) => item.id)
    //   if (flag === 'N') {
    //     this.$message('操作取消')
    //     return
    //   }
    //   const { code, data } = await this.$api.controlChartAbnorma_delete(ids)
    //   if (code === '200' && data) {
    //     this.$message.success('删除成功！')
    //   }
    //   this.refresh()
    // },
    refresh() {
      this.$refs.dy_table.refresh()
    },
    dialog_close() {
      this.bad_item_dialog = false
    },
    async request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.controlChartAbnorma_list({
        page: page_no,
        limit: page_size,
        // order: 'asc',
        controlChartGroupId: this.current_tree_node_key,
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : '',
        'abnormalStatus': this.form.checkList.length === 0 ? [0, 1] : this.form.checkList,
        'inspectionName': this.form.inspectionName
        // 'abnormalStatus': [
        //   0,
        //   1
        // ],
        // 'inspectionName': '',
        // 'thisMonthEnd': '2021-11-30 11:59:57',
        // 'thisMonthStart': '2021-11-30 11:59:57',
        // 'sidx': 'id',
        // 'order': 'desc'
        // 'abnormalStatus': [
        //   0,
        //   1
        // ],
        // 'inspectionName': '',
        // 'thisMonthEnd': '2021-11-30 11:59:57',
        // 'thisMonthStart': '2021-11-30 11:59:57',
        // 'sidx': 'id',
        // 'order': 'desc'
      })
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalPage
        }
      }
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    }
  }
}
</script>

