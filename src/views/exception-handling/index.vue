<template>
  <el-row>
    <el-col :span="4" style="border-right: 1px solid #ccc;">
      <container-layout ref="left_tree">
        <template v-slot:btns>
          <el-row>
            <el-col :span="24" style="text-align: left; font-size: 14px;">
              控制组列表
            </el-col>
          </el-row>

        </template>
        <template v-slot:custum_content>
          <control-group-tree
            ref="tree"
            :control-group-id="controlGroupId"
            @node-click="node_click"
            @render-after="render_after"
            @path-change="path_change"
          />
        </template>
      </container-layout>
    </el-col>
    <el-col :span="20">
      <container-layout ref="contenter" adjustable-height footer-height="55%">
        <template v-slot:form>
          <el-form-item
            label="控制图ID"
            prop="controlChartSonId"
          >
            <el-input
              v-model="form2.controlChartSonId"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="控制图编号"
            prop="controlChartCode"
          >
            <el-input
              v-model="form2.controlChartCode"
              style="width: 200px"
              clearable
            />
          </el-form-item>
          <!-- <el-form-item
            label="控制图编号"
            prop="controlChartCode"
          >
            <el-input
              v-model="form2.controlChartCode"
              style="width: 160px"
              clearable
            />
          </el-form-item> -->
          <el-form-item
            label="检测项目"
            prop="inspectionName"
            clearable
          >
            <el-input
              v-model="form2.inspectionName"
              style="width: 160px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="query2"
            >查询</el-button>
          </el-form-item>
        </template>
        <template v-slot:custum_content>
          <dynamic-table
            ref="dy_table2"
            v-model="select_row2"
            :header-list="header_list2"
            :request="request_data2"
            :page-sizes="[20,60,120]"
            fixed-height="100%"
            :auto-init="false"
            @select="select_callback2"
          >
            <!-- <template slot="cell-template" slot-scope="data">
              <status-flag v-if="data.list.template === 'states'" :states="data.cellValue" />
              <template v-else-if="data.list.template === 'hierarchicalType'">
                {{ data.cellValue || 'N/A' }}
              </template>

              <template v-else>{{ data.cellValue }}</template>
            </template> -->
          </dynamic-table>

        </template>

        <template v-slot:footer>
          <container-title style="padding: 0 10px;">
            <div style="float: left;">
              <span style="font-size: 14px; color: #008040;">控制组路径: {{ path.pathStr }}</span>
            </div>
            <div style="float: right;">
              <!-- abnormalEmailRecipient -->
              <ki-button v-permission="['controlChartAbnormal.update']" type="warning" @click="exception_handling_btn">处理</ki-button>
              <ki-button v-permission="['controlChartAbnormal.updateReversal']" type="warning" @click="exception_HandleReversal_btn">反处理</ki-button>
              <ki-button v-permission="['controlChartAbnormal.audit']" type="primary" style="margin-left: 10px" @click="audit_btn">审核</ki-button>
              <ki-button v-permission="['controlChartAbnormal.auditReversal']" type="primary" style="margin-left: 10px" @click="reset_state_btn">反审核</ki-button>
            </div>
            <!--  -->
          </container-title>
          <el-form inline :model="form" class="exception-handling-form">
            <el-form-item
              label="检验单ID"
              prop="inspectionRecordId"
            >
              <el-input
                v-model="form.inspectionRecordId"
                style="width: 200px"
                clearable
              />
            </el-form-item>

            <el-form-item label="发生时间:">
              <el-date-picker
                v-model="form.date"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="处理状态:" style="height: 28px;">
              <el-checkbox-group v-model="form.checkList">
                <el-checkbox :label="0">未处理</el-checkbox>
                <el-checkbox :label="1">待审核</el-checkbox>
                <el-checkbox :label="2">已审核</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label-width="0">
              <el-checkbox v-model="currentUser">当前用户</el-checkbox>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="query"
              >查询</el-button>
            </el-form-item>
          </el-form>
          <dynamic-table
            ref="dy_table"
            v-model="select_row"
            checkbox-fixed="none"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[30, 80, 120]"
            fixed-height="calc(100% - 81px)"
            :auto-init="false"
            unique="inspectionRecordId"
          >
            <!-- @select="select_callback" -->
            <template slot="cell-template" slot-scope="data">
              <template v-if="data.list.template === 'state'">
                <!-- 0待处理,1代审核,2已处理) -->
                <span v-if="data.cellValue === 0" style="color: #F56C6C;">未处理</span>
                <span v-else-if="data.cellValue === 1" style="color: #E6A23C;">待审核</span>
                <span v-else-if="data.cellValue === 2" style="color: #67C23A;">已审核</span>
              </template>
              <template v-else-if="data.list.template === 'test'">
                <div style="padding:10px 0 10px 50px;">
                  <dynamic-table
                    ref="dy_table3"
                    v-model="select_row3"
                    :header-list="header_list3"
                    :allow-heightlight="false"
                    unique="abnormalId"
                    :request="() => {
                      const {abnormalIdList,
                             abnormalCodeList,
                             exceptionLevelList,
                             abnormalInformationList,
                             happenDateList,
                             currentValueList} = data.row

                      const d = []
                      abnormalIdList.forEach((abnormalId,index) => {
                        const o = {
                          abnormalId,
                          abnormalCode: abnormalCodeList[index],
                          exceptionLevel: exceptionLevelList[index],
                          abnormalInformation: abnormalInformationList[index],
                          happenDate: happenDateList[index],
                          currentValue: currentValueList[index]
                        }
                        d.push(o)
                      })

                      return {
                        data: d,
                        tatol: d.length
                      }
                    }"
                    :one-page-show-pagination="false"
                    :page-sizes="[160]"
                    :fixed-height="400"
                  />
                </div>
              </template>
              <el-link v-else-if="data.list.template === 'link'" style="font-size: 12px;" type="primary" @click.stop="detail_dialog(data.scope)">{{ data.cellValue }}</el-link>
              <template v-else>{{ data.cellValue }}</template>
            </template>
          </dynamic-table>

        </template>

      </container-layout>
    </el-col>

    <exception-handling-dialog
      :visible="exception_handling_dialog"
      :select-row="select_row"
      :send-row="send_row"
      :flag="dialog_flag"
      @handleClose="dialog_close"
      @confirm="dialog_confirm"
    />
  </el-row>
</template>

<script>
import ExceptionHandlingDialog from './components/exception-handling-dialog'
import ControlGroupTree from './components/control-group-tree'
import ChartListTable from './mixins/chart-list-table'
import { mapGetters } from 'vuex'

export default {
  name: 'ExceptionHandling',
  components: {
    ExceptionHandlingDialog,
    ControlGroupTree
  },
  mixins: [ChartListTable],
  data() {
    return {

      audit_handling_dialog: false,
      path: '',
      current_tree_node_data: {},
      dialog_flag: '',
      exception_handling_dialog: false,
      item2: {},
      header_list: [
        { label: '', width: '40', type: 'expand', template: 'test' },
        { prop: 'abnormalStatusList', label: '状态', width: '60', template: 'state', align: 'center' },
        { prop: 'inspectionRecordId', label: '检验单ID', template: 'link' }
        // { prop: 'controlChartCode', label: '控制图编号' }
        // { prop: 'inspectionName', label: '检测项目' },
        // { prop: 'controlChartType', label: '图类' }
      ],
      header_list3: [
        { prop: 'abnormalId', label: '失控Id', width: '160' },
        { prop: 'abnormalCode', label: '失控编号', width: '170' },
        { prop: 'currentValue', label: '当前值', width: '100' },
        { prop: 'happenDate', label: '发生时间', width: '140' },
        { prop: 'exceptionLevel', label: '失控等级', width: '120', align: 'center' },
        { prop: 'abnormalInformation', label: '失控信息', minWidth: '140' }
      ],
      form: {
        controlChartIds: '',
        controlChartCode: '',
        inspectionName: '',
        date: [],
        checkList: [0],
        inspectionRecordId: ''
      },
      currentUser: false,
      select_row: [],
      select_row3: {},
      send_row: {},
      fullPath: '',
      controlGroupId: ''
    }
  },
  computed: {
    current_tree_node_key() {
      return this.current_tree_node_data.id
    },
    ...mapGetters(['userId'])
  },
  beforeRouteEnter(to, form, next) {
    next(vm => {
      if (vm.fullPath !== to.fullPath) {
        vm.fullPath = to.fullPath
        vm.form.date = []
        vm.form.date[0] = to.query.thisMonthStart || ''
        vm.form.date[1] = to.query.thisMonthEnd || ''
        vm.form2['controlChartSonId'] = to.query.controlChartSonId
        vm.form2.controlChartCode = to.query.controlChartCode || ''
        vm.controlGroupId = to.query.controlGroupId
        // vm.inspectionRecordId = to.query.inspectionRecordId
        vm.form['inspectionRecordId'] = to.query.inspectionRecordId
        vm.$refs.tree.init()
      }
    })
  },
  watch: {
  },
  methods: {
    detail_dialog({ row }) {
      this.dialog_flag = 'details'
      this.send_row = row
      this.exception_handling_dialog = true
    },
    // 处理与详情弹框
    exception_handling_btn() {
      if (!this.$refs.dy_table.one_row_select()) return
      const limit = this.select_row.some(row => row.abnormalStatusList !== 0)
      if (limit) {
        this.$message.warning('只能处理未处理的数据!')
        return
      }
      this.dialog_flag = 'add'
      this.exception_handling_dialog = true
    },
    // 反处理
    exception_HandleReversal_btn() {
      if (!this.$refs.dy_table.one_row_select()) return
      const limit = this.select_row.some(row => row.abnormalStatusList !== 1)
      if (limit) {
        this.$message.warning('只能反处理待审核的数据!')
        return
      }
      this.$confirm('确定要反处理选中的信息吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = []
        this.select_row.forEach(row => {
          ids.push(...row.abnormalIdList)
        })
        const { code, data } = await this.$api.abnormalHandleReversalByInspectionRecordId({
          ids
        })
        if (code === '200' && data) {
          await this.$store.dispatch('abnormalMessage/changeAbnormalMessage')
          this.$message.success('反处理成功！')
          this.$refs.dy_table.refresh({ keep: true })
        }
      }).catch(() => {
      })
    },
    // 审核
    audit_btn() {
      if (!this.$refs.dy_table.one_row_select()) return
      const limit = this.select_row.some(row => row.abnormalStatusList !== 1)
      if (limit) {
        this.$message.warning('只能审核待审核的数据!')
        return
      }

      this.$confirm('确定要审核选中的信息吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = []
        this.select_row.forEach(row => {
          ids.push(...row.abnormalIdList)
        })
        const { code, data } = await this.$api.auditByInspectionRecordId({ ids })
        if (code === '200' && data) {
          await this.$store.dispatch('abnormalMessage/changeAbnormalMessage')
          this.$message.success('审核成功！')
          this.$refs.dy_table.refresh({ keep: true })
        }
      }).catch(() => {
      })
    },
    // 反审核
    reset_state_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      const limit = this.select_row.some(row => row.abnormalStatusList !== 2)
      if (limit) {
        this.$message.warning('只能反审核待已审核的数据!')
        return
      }
      this.$confirm('确定反审核选中的信息吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const ids = []
        this.select_row.forEach(row => {
          ids.push(...row.abnormalIdList)
        })
        const { code, data } = await this.$api.auditReversalByInspectionRecordId({ ids })
        if (code === '200' && data) {
          this.$message({
            type: 'success',
            message: '反审核成功!'
          })
          this.$refs.dy_table.refresh({ keep: true })
        }
      }).catch(() => {
      })
    },

    audit_close() {
      this.audit_handling_dialog = false
    },
    audit_confirm() {
      this.audit_handling_dialog = false
    },
    query() {
      this.refresh()
    },
    path_change(path) {
      this.path = path
    },
    node_click(data, node, com) {
      this.current_tree_node_data = data
      if (this.controlGroupId !== this.current_tree_node_key) {
        // 点击清理传来的控制组ID，控制图ID，检验单ID
        this.controlGroupId = ''
        this.form2.controlChartSonId = ''
        this.form.inspectionRecordId = ''
        this.$router.push({ path: '/statistical-process-control/exception-handling' })
        this.fullPath = this.$route.fullPath
      }
      this.$refs.dy_table2.refresh()
    },
    render_after(currentData) {
      this.current_tree_node_data = currentData

      this.$refs.dy_table2.refresh({ keep: true })
    },

    async reset_state(flag) {
      const ids =
        typeof this.select_row === 'object'
          ? [this.select_row.id]
          : this.select_row.map((item) => item.id)
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      const { code, data } = await this.$api.controlChartAbnorma_delete(ids)
      if (code === '200' && data) {
        this.$message.success('删除成功！')
      }
      this.refresh()
    },
    refresh() {
      this.$refs.dy_table.refresh()
    },
    dialog_close() {
      this.exception_handling_dialog = false
    },
    async dialog_confirm() {
      this.$refs.dy_table.refresh({ keep: true })
      await this.$store.dispatch('abnormalMessage/changeAbnormalMessage')
      this.exception_handling_dialog = false
    },
    async request_data({ page_no, page_size, table_data }) {
      if (!this.form.controlChartIds) {
        return false
      }
      const p = {
        page: page_no,
        limit: page_size,
        // controlChartGroupId: this.current_tree_node_key,
        'thisMonthStart': this.form.date ? (this.form.date[0] || '') : '',
        'thisMonthEnd': this.form.date ? (this.form.date[1] || '') : '',
        'abnormalStatus': this.form.checkList.length === 0 ? [0, 1, 2] : this.form.checkList,
        // 'inspectionName': this.form.inspectionName,
        // 'controlChartCode': this.form.controlChartCode,
        // 'controlChartIds': this.form.controlChartIds.toString(),
        'controlChartSonId': this.form.controlChartIds.toString(),
        'inspectionRecordId': this.form.inspectionRecordId || ''
      }

      if (this.currentUser) {
        p.userIds = [this.userId]
      }
      const { code, data } = await this.$api.listGroupByInspectionRecord(p)

      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    },
    select_callback(data) {
      // console.log('select_callback：  ', JSON.stringify(data))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .exception-handling-form {
  .el-form-item{
    // margin: 0;
    margin: 5px 10px;
  }
}
</style>

