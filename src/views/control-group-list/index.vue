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
          <!-- <ki-tree /> -->
          <control-group-tree
            ref="tree"
            :current-key="current_tree_node_key"
            @node-click="node_click"
            @render-after="render_after"
          />
        </template>
      </container-layout>
    </el-col>
    <el-col :span="20">
      <container-layout ref="control-pic-list">
        <template v-slot:btns>
          <div style="text-align: right;">
            <ki-button
              type="primary"
              @click="cc"
            >控制图设置</ki-button>
            <ki-button type="warning">单项目输入</ki-button>
            <ki-button
              type="danger"
            >删除</ki-button>
          </div>
        </template>
        <template v-slot:form>
          <el-form-item label="日期:">
            <el-col :span="11">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
            <el-col
              class="line"
              :span="1"
            >至</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="状态:">
            <allow-create-select
              v-model="value2"
              style="width: 100px;"
            />
          </el-form-item>
          <el-form-item label="编号:">
            <allow-create-select
              v-model="value1"
              style="width: 100px;"
            />
          </el-form-item>
          <el-form-item label="检测项目:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="图类:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="产品型号:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="产品名称:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="产线:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="班次:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="设备:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="供应商:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="客户:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="批次:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="dialogVisible = true"
            >查询</el-button>
          </el-form-item>
        </template>
        <template v-slot:custum_content>
          <dynamic-table
            ref="dy_table"
            v-model="select"
            :auto-init="false"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[20,60,100]"
            fixed-height="100%"
            @current-change="current_change"
            @select="select_callback"
          />
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
      :visible="chartSetting_dialog"
      @handleClose="chartSetting_dialog=false"
    />
    <add-group-tree-dialog
      :visible="add_group_tree_dialog"
      :flag="tree_flag"
      :node-data="current_tree_node_data"
      @handleClose="tree_dialog_close"
      @confirm="tree_confirm"
    />
  </el-row>

</template>

<script>
import { AllowCreateSelect } from '@/components/form-item'
import Rectangle from './components/status-graph/rectangle'
import RoundShape from './components/status-graph/round-shape'
import ControlChartSettings from './components/control-chart-settings'
import ControlGroupTree from './components/control-group-tree'
import AddGroupTreeDialog from './components/add-group-tree-dialog'
// import StatusFlag from './components/status-flag'
export default {
  name: 'ControlGroupList',
  components: {
    Rectangle,
    RoundShape,
    AllowCreateSelect,
    ControlChartSettings,
    ControlGroupTree,
    AddGroupTreeDialog
    // StatusFlag
  },
  data() {
    return {
      tree_flag: '',
      // current_tree_node_key: '',
      current_tree_node_data: {},
      add_group_tree_dialog: false,
      chartSetting_dialog: false,
      form_data: {
        state: '',
        s_number: '',
        test_item: '',
        graph_type: ''
      },
      value1: '111',
      value2: '222',
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
        { prop: 'doccode', label: '层次类型ID', width: '180' },
        { prop: 'name', label: '层次', width: '180' },
        { prop: 'address', label: '类型名称' }
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      checkList: ['选中且禁用', '复选框 A'],
      select2: [],
      select: [{
        id: 1
      }]
    }
  },
  computed: {
    current_tree_node_key() {
      return this.current_tree_node_data.id
    }
  },
  methods: {
    render_after(currentData) {
      this.current_tree_node_data = currentData
      this.$refs.dy_table.refresh()
    },
    cc() {
      this.chartSetting_dialog = true
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
      // if (flag === 'Y') {
      // const {code,data} = await this.$api.controlGroup_delete()
      // } else {
      //   this.$message.warning('操作取消')
      // }
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
    },
    click_link(data) {
      console.log(data)
    },
    current_change(val) {
      console.log('current_change')
      console.log(val)
    },
    request_data({ page_no, page_size, data }) {
      // console.log('------------------', page_no, page_size)
      // const total = 60
      // page_no = Number(page_no)
      // page_size = Number(page_size)
      // const list_num = page_no * page_size < total ? page_size : page_size - (page_no * page_size - total)
      // return new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve({
      //       data: Array(list_num).fill({
      //         date: '2016-05-02',
      //         name: '王小虎',
      //         address: '上海市普陀区金沙江路 1518 弄'
      //       }).map((i, index) => {
      //         const id = (page_no - 1) * page_size + index
      //         console.log(id)
      //         return {
      //           ...i,
      //           id
      //         }
      //       }),
      //       total
      //     })
      //   }, 1000)
      // })
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
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
