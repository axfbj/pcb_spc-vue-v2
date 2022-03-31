<template>
  <ki-dialog
    :visible="visible"
    title="控制图"
    width="60%"
    v-bind="$attrs"
    :flag="settingFlag"
    class="control-chart-settings"
    :permission="['control.save','control.update']"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
    @closed="closed"
  >
    <div style="padding: 0px 20px; overflow:hidden;">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        style="float: left;"
      >
        <el-row style="padding-bottom: 10px; color: #008040;">控制组名称: {{ settingFlag === 'add' ? treePath.pathStr : tree_path }}</el-row>
        <el-form-item label="控制图类型:" style="margin-bottom: 10px;">
          <el-select v-model="controlChartType" placeholder="请选择" :disabled="settingFlag !== 'add'" @change="controlChartType_change">
            <el-option
              v-for="item in commonVariable.chartOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-reference v-model="inspection_items_select" type="inspection-items" @change="add_inspection_items">
          <ki-button v-permission="['control.save']" type="primary">添加</ki-button>
        </el-reference>
        <ki-message-box
          :next="del"
          @click="del_btn"
        >
          <ki-button
            v-permission="['control.delete']"
            type="danger"
            style="margin-left: 10px;"
          >删除</ki-button>
        </ki-message-box>
      </el-form>
    </div>
    <div>
      <dynamic-table
        ref="dy_table"
        v-model="select_row"
        :header-list="header_list"
        :request="request_data"
        :page-sizes="[1000]"
        fixed-height="26vh"
        :one-page-show-pagination="false"
        unique="rowNumber"
        @select="select_callback"
      />
    </div>
    <el-row>
      <el-col :span="6">
        <el-form :model="form" label-width="80px">
          <fieldset style="border: 1px solid #ccc; height: 354px;">
            <legend style="color:#606266">基本信息</legend>
            <el-form-item label="规格上限:" prop="usl">
              <el-input-number v-model="form.usl" :precision="!form.usl ? undefined :form.digit" style="width: 100%;" :controls="false" :disabled="count_graph.includes(controlChartType)" />
            </el-form-item>
            <el-form-item label="目标值:" prop="sl">
              <el-input-number v-model="form.sl" :precision="!form.sl ? undefined :form.digit" style="width: 100%;" :controls="false" type="number" :disabled="count_graph.includes(controlChartType)" />
            </el-form-item>
            <el-form-item label="规格下限:" prop="lsl">
              <el-input-number v-model="form.lsl" :precision="!form.lsl ? undefined :form.digit" style="width: 100%;" :controls="false" type="number" :disabled="count_graph.includes(controlChartType)" />
            </el-form-item>
            <el-form-item label="样本容量:" prop="sampleSize">
              <!-- :max="25"  -->
              <el-input-number v-model="form.sampleSize" :max="['Xbar-R', 'Xbar-s','X-MR'].includes(controlChartType) ? 25 : undefined" style="width: 100%;" :controls="false" type="number" :disabled="[...count_graph,'X-MR'].includes(controlChartType)" @change="form_change('sampleSize',...arguments)" />
            </el-form-item>
            <el-form-item label="小数位数:" prop="digit">
              <el-select v-model="form.digit" placeholder="请选择" style="width:100%;" :disabled="count_graph.includes(controlChartType)" @change="form_change('digit',...arguments)">
                <el-option
                  v-for="item in precisionOptiosn"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </fieldset>
        </el-form>
      </el-col>
      <el-col :span="18">
        <el-form :model="form" label-width="120px">
          <fieldset style="border: 1px solid #ccc;  height: 354px;">
            <legend style="color:#606266">控制图信息</legend>
            <el-form-item label="判异规则:" prop="discriminationRulesStr">
              <el-input v-model="form.discriminationRulesStr" type="text" style="width: 80%;" readonly />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_discrimination_rules_dialog">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="控制图层次信息:" prop="chartHierarchicalType">
              <el-input v-model="form.chartHierarchicalType" type="text" style="width: 80%;" readonly />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_select_keyword_dialog('level')">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="数据点层次信息:" prop="pointHierarchicalType">
              <el-input v-model="form.pointHierarchicalType" type="text" style="width: 80%;" readonly />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_select_keyword_dialog('data')">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="异常接收人:" prop="abnormalEmailRecipient">
              <div class="el-input--mini el-input__inner" style="width: 80%; line-height: 28px; height: 28px;">
                <el-scrollbar ref="scrollbar">
                  <div style="height: 24px;">
                    <span style="white-space:nowrap; display:inline-block;">
                      <el-tag
                        v-for="user in abnormalEmailRecipient_select"
                        :key="user.id"
                        type="info"
                        closable
                        style="margin-right: 5px;"
                        disable-transitions
                        @close="user_tag_close(user.id)"
                      >
                        {{ user.userName }}
                      </el-tag>
                    </span>
                  </div>
                </el-scrollbar>

              </div>
              <!-- <div class="el-input el-input--mini" style="width: 80%;">1111</div> -->
              <el-reference v-model="abnormalEmailRecipient_select" type="select-dialog-user" style="vertical-align: top;" @change="select_dialog_user_change">
                <ki-button type="warning" style="margin-left: 10px;">设置</ki-button>
              </el-reference>
            </el-form-item>
            <el-form-item label="异常接收组:" prop="userGroup_select">
              <div class="el-input--mini el-input__inner" style="width: 80%; line-height: 28px; height: 28px;">
                <el-scrollbar ref="scrollbar">
                  <div style="height: 24px;">
                    <span style="white-space:nowrap; display:inline-bloack;">

                      <el-tag
                        v-if="userGroup_select.id"
                        type="primary"
                        disable-transitions
                        style="margin-right: 5px;"
                        closable
                        @close="userGroup_tag_close"
                      >
                        {{ userGroup_select.groupName }}
                      </el-tag>
                      <!-- <el-tag
                        v-for="userGroup in userGroup_select"
                        :key="userGroup.id"
                        type="primary"
                        closable
                        style="margin-right: 5px;"
                        disable-transitions
                        @close="userGroup_tag_close(userGroup.id)"
                      >
                        {{ userGroup.groupName }}
                      </el-tag> -->
                    </span>
                  </div>
                </el-scrollbar>
              </div>
              <el-reference v-model="userGroup_select" type="select-dialog-user-group" style="vertical-align: top;" @change="userGroup_change">
                <ki-button type="warning" style="margin-left: 10px;">设置</ki-button>
              </el-reference>
            </el-form-item>
            <el-form :model="form" label-width="auto" :inline="true" style="margin-top: 30px;">
              <el-form-item>
                <div style="width: 120px; text-align: right;">上图:</div>
              </el-form-item>
              <el-form-item class="col-label" prop="g1ucl">
                <div class="top-label">上控制限</div>
                <el-input-number v-model="form.g1ucl" :controls="false" type="number" style="width: 120px;" :disabled="['p','u','y'].includes(controlChartType)" />
              </el-form-item>
              <el-form-item class="col-label" prop="g1cl">
                <div class="top-label">目标值</div>

                <el-input-number v-model="form.g1cl" :controls="false" type="number" style="width: 120px;" @change="g1ucl_change" />
              </el-form-item>
              <el-form-item class="col-label" prop="g1lcl">
                <div class="top-label">下控制限</div>
                <el-input-number v-model="form.g1lcl" :controls="false" type="number" style="width: 120px;" :disabled="['p','u','y'].includes(controlChartType)" />
              </el-form-item>
              <br>
              <el-form-item>
                <div style="width: 120px; text-align: right;">下图:</div>
              </el-form-item>
              <el-form-item prop="g2ucl">
                <el-input-number v-model="form.g2ucl" :controls="false" type="number" style="width: 120px;" :disabled="['XMR',...count_graph].includes(controlChartType)" />
              </el-form-item>
              <el-form-item prop="g2cl">
                <el-input-number v-model="form.g2cl" :controls="false" type="number" style="width: 120px;" :disabled="['XMR',...count_graph].includes(controlChartType)" />
              </el-form-item>
              <el-form-item prop="g2lcl">
                <el-input-number v-model="form.g2lcl" :controls="false" type="number" style="width: 120px;" :disabled="['XMR',...count_graph].includes(controlChartType)" />
              </el-form-item>
              <el-form-item>
                <ki-button v-permission="['control.limit.calculation']" type="warning" @click="calc_value">计算</ki-button>
              </el-form-item>
            </el-form>
          </fieldset>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-form :model="form" label-width="140px">
        <fieldset style="border: 1px solid #ccc;">
          <legend style="color:#606266">其他信息</legend>
          <el-form-item label="控制图描述:" prop="description">
            <el-input v-model="form.description" type="text" />
          </el-form-item>
          <el-form-item label="自定义控制图标题:" prop="customTitle">
            <el-input v-model="form.customTitle" type="text" />
          </el-form-item>
        </fieldset>
      </el-form>
    </el-row>
    <discrimination-rules-dialog
      :select-row="select_row"
      :form-data="form"
      :visible="discrimination_rules_dialog"
      :control-chart-type="controlChartType"
      @handleClose="rules_dialog_close"
      @confirm="rules_confirm"
    />
    <select-keyword-dialog
      :disabled-select-arr="disabledSelectArr"
      :visible="select_keyword_dialog"
      :keyword-flag="keyword_flag"
      :form-data="form"
      @handleClose="keyword_dialog_close"
      @confirm="keyword_dialog_confirm"
    />
  </ki-dialog>

</template>

<script>
import DiscriminationRulesDialog from './discrimination-rules-dialog'
import SelectKeywordDialog from './select-keyword-dialog'
import ControlChartSettingsData from './mixins/control-chart-settings-data'
import userGroup_reference from './mixins/userGroup-reference'
import { dateformat } from '@/utils/date-method'
import { debounce } from '@/utils/tools'
export default {
  name: 'ControlChartSettings',
  components: {
    DiscriminationRulesDialog,
    SelectKeywordDialog
  },
  mixins: [ControlChartSettingsData, userGroup_reference],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    },
    treePath: {
      type: [Object, String],
      default: ''
    },
    settingFlag: {
      type: String,
      default: ''
    },
    sendRow: {
      type: [Object, Array],
      default: () => ({})
    }
  },
  data() {
    return {
      abnormalEmailRecipient_select: [],
      has_del: false,
      disabledSelectArr: [],
      updateKeys: [],
      discrimination_rules_dialog: false,
      select_keyword_dialog: false,
      keyword_flag: '',
      inspection_items_select: {},
      select_row: {},
      send_row: {},
      controlChartId: '',
      tree_path: '',
      header_list: [
        { prop: 'controlChartCode', label: '编号', width: '180' },
        { prop: 'inspectionName', label: '检测项目', width: '180' },
        { prop: 'sampleSize', label: '样本容量' },
        { prop: 'digit', label: '小数位数' },
        { prop: 'discriminationRulesStr', label: '判异规则' },
        // { prop: 'updateUser', label: '更新用户' },
        { prop: 'userName', label: '更新用户' },
        { prop: 'updateDate', label: '更新时间', width: '140' }
        // { prop: 'abnormalEmailRecipientName', label: '异常接收人' }
        // { prop: 'abnormalEmailRecipient', label: '异常接收人' }
      ],
      t_data: []
    }
  },

  watch: {
    'abnormalEmailRecipient_select': {
      deep: true,
      handler() {
        this.update_scrollbar({ vm: this })
      }
    }
  },
  created() {
  },
  methods: {
    update_scrollbar: debounce(({ vm }) => {
      vm.$nextTick(() => {
        vm.$refs.scrollbar && vm.$refs.scrollbar.update()
      })
    }, 20),
    form_change(key, val) {
      this.select_row[key] = val
    },
    select_dialog_user_change(users) {
      this.form.abnormalEmailRecipients = users.map(user => user.id)
      this.form.abnormalEmailRecipientsStr = users.map(user => user.userName).toString()
    },
    g1ucl_change(val) {
      if (['p', 'u'].includes(this.controlChartType)) {
        if (val >= 1) {
          this.$message.warning('设置的目标值必须小于1')
          this.form['g1cl'] = 0.99
        }
      }
    },
    controlChartType_change() {
      this.clean('change')
    },
    badGroup_dialog_btn() {
      this.badGroup_dialog = true
    },
    async add_inspection_items(select_data) {
      const temp = {
        warningUserGroupId: '',
        inspectionName: select_data.inspectionName,
        inspectionItemsId: select_data.id,
        // ------------------------
        // 'chartHierarchicalType': 0, 不传
        // chartHierarchicalType: '产品型号=test',
        // chartHierarchicalTypeStr: '1=1=test',
        chartHierarchicalType: '',
        chartHierarchicalTypeStr: '',
        // 'controlChartCode': '', 生成添加
        // 'controlChartId': 0, 不传
        customTitle: '',
        description: '',
        digit: 3,
        'discriminationRules': 'R0,R1-1-3',
        'discriminationRulesStr': 'R0,R1-1-3',
        g1cl: undefined,
        g1lcl: undefined,
        g1ucl: undefined,
        g2cl: undefined,
        g2lcl: undefined,
        g2ucl: undefined,
        // id: 0, // 新增不传
        // 'inspectionItemsId': '',
        lsl: undefined,
        // 'pointHierarchicalType': 0, //不传
        // pointHierarchicalType: '产品名称=data',
        // pointHierarchicalTypeStr: '2=2=data', //	数据点层次信息(示例：层次类型序号=层次类型ID=值)
        pointHierarchicalType: '',
        pointHierarchicalTypeStr: '',
        sampleSize: undefined,
        sl: undefined,
        status: 1, // 	状态 1显示 0隐藏
        updateDate: dateformat(new Date()),
        // updateUser: 'admin',
        // userName: 'admin',
        // 'updateUserId': 1, // 暂时固定传1
        'updateUserId': this.userId, // 暂时固定传1
        usl: undefined,
        // abnormalEmailRecipient: '',
        // abnormalEmailRecipientName: ''
        abnormalEmailRecipients: [],
        abnormalEmailRecipientsStr: ''
      }
      if (['Xbar-R', 'Xbar-s'].includes(this.controlChartType)) {
        temp.sampleSize = 5
      }
      if (['X-MR'].includes(this.controlChartType)) {
        temp.sampleSize = 1
      }
      if (this.count_graph.includes(this.controlChartType)) {
        temp.sampleSize = undefined
        temp.discriminationRules = 'R1-1-3'
        temp.discriminationRulesStr = 'R1-1-3'
        if (['np', 'c'].includes(this.controlChartType)) {
          temp.sampleSize = 100
        }
      }
      const { code, data } = await this.$api.controlChartSon_generateCode()
      if (code === '200' && data) {
        temp.controlChartCode = data
      } else {
        this.$message.error('编号生成失败！')
        return
      }
      this.t_data.push(temp)
      this.t_data = this.t_data.map((item, index) => ({
        ...item,
        rowNumber: index + 1
      }))
      this.select_row = { rowNumber: this.t_data[this.t_data.length - 1].rowNumber }
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
      if (Object.hasOwnProperty.call(this.select_row, 'id')) {
        const { code, data } = await this.$api.controlChartSon_delete([this.select_row.id])
        if (code === '200' && data) {
          this.$message.success('删除成功！')
          this.has_del = true
          this.t_data.splice(this.select_row.rowNumber - 1, 1)
          this.form = JSON.parse(JSON.stringify(this.form_data))
          this.select_row = this.t_data.length > 0 ? this.t_data[0] : {}
          this.$refs.dy_table.refresh()
          if (this.t_data.length === 0) {
            this.$emit('handleClose', true) // 删除了所有的项目就关闭，需要重新生成这个控制图集合id
            return
          }
        } else {
          this.$message.warning('删除失败！')
        }
      } else {
        this.t_data.splice(this.select_row.rowNumber - 1, 1)
        this.form = JSON.parse(JSON.stringify(this.form_data))
        this.$refs.dy_table.refresh()
      }
    },
    open_select_keyword_dialog(flag) {
      this.keyword_flag = flag
      this.disabledSelectArr = []
      const { chartHierarchicalTypeStr, pointHierarchicalTypeStr } = this.form
      const str1 = this.keyword_flag === 'level' ? (pointHierarchicalTypeStr || '') : (chartHierarchicalTypeStr || '')
      const ruleArr = str1.split(',')
      ruleArr.forEach(item => {
        const arr = item.split('=')
        if (arr[0]) this.disabledSelectArr.push(arr[0])
      })
      // console.log('disabledSelectArr', this.disabledSelectArr)
      this.select_keyword_dialog = true
    },
    keyword_dialog_close() {
      this.select_keyword_dialog = false
      this.disabledSelectArr = []
    },
    keyword_dialog_confirm(info) {
      // console.log('info', info)
      this.select_keyword_dialog = false
      if (info) {
        for (const key in info) {
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key]
          }
        }
      }
    },
    open_discrimination_rules_dialog() {
      this.discrimination_rules_dialog = true
    },
    rules_dialog_close() {
      this.discrimination_rules_dialog = false
    },
    rules_confirm(discriminationRulesStr) {
      this.discrimination_rules_dialog = false
      this.form.discriminationRulesStr = discriminationRulesStr
      // this.form.discriminationRulesStr = discriminationRulesStr

      this.select_row['discriminationRulesStr'] = this.form.discriminationRulesStr
      // this.select_row['discriminationRulesStr'] = this.form.discriminationRulesStr
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose', this.has_del)
    },
    async confirm({ loading }) {
      loading(true)
      if (this.settingFlag === 'add') {
        const parmas = this.save_chart_data()
        parmas.controlChartId = 0
        const { code } = await this.$api.controlChartSon_save(parmas)
        if (code === '200') {
          this.$emit('confirm')
        } else {
          loading(false)
        }
      } else {
        const parmas = this.save_chart_data()
        const original = JSON.parse(JSON.stringify(parmas.controlChartSonEntityS))
        parmas.controlChartId = this.controlChartId
        parmas.controlChartSonEntityS = original.filter(item => !Object.hasOwnProperty.call(item, 'id'))
        const p = original.filter(item => {
          return Object.hasOwnProperty.call(item, 'id') && this.updateKeys.includes(item.id)
        })
        if (parmas.controlChartSonEntityS.length > 0) {
          const { code } = await this.$api.controlChartSon_save(parmas)
          if (code === '200') {
            this.controlChartSon_batchUpdate(loading, p)
          } else {
            loading(false)
          }
        } else {
          this.controlChartSon_batchUpdate(loading, p)
        }
      }
    },
    async controlChartSon_batchUpdate(loading, p) {
      if (p.length === 0) {
        this.$emit('confirm')
        return
      }
      const { code } = await this.$api.controlChartSon_batchUpdate(p)

      if (code === '200') {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    formatNullValue(obj) {
      const o = {}
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          o[key] = obj[key] === null ? undefined : obj[key]
        }
      }
      return o
    },
    async open() {
      if (this.settingFlag !== 'update') return
      if (Object.hasOwnProperty.call(this.sendRow, 'id')) {
        this.send_row = this.sendRow
      } else {
        this.send_row = this.selectRow[0]
      }
      const { id, controlChartId, controlChartType } = this.send_row
      this.controlChartId = controlChartId
      const { code, data } = await this.$api.controlChart_queryByControlChartId({
        controlChartId,
        type: controlChartType
      })
      if (code === '200' && data) {
        const t_data = data.map((item, index) => ({
          ...this.formatNullValue(item),
          discriminationRulesStr: item.discriminationRules,
          updateDate: dateformat(new Date()),
          userName: this.username,
          rowNumber: index + 1
        }))

        if (data.length === 0) return
        this.tree_path = t_data.length > 0 ? t_data[0].controlChartName : ''
        this.controlChartType = t_data.length > 0 ? t_data[0].controlChartType : ''
        this.t_data = t_data
        const f = t_data.find(item => item.id === id)
        this.select_row = f ? { rowNumber: f.rowNumber } : {}
        this.$refs.dy_table.refresh()
      }
    },
    opened() {
    },
    set_email_user_tags(data) {
      if (!data) return
      const usernames = data.abnormalEmailRecipientsStr.split(',')
      this.abnormalEmailRecipient_select = data.abnormalEmailRecipients.map((id, index) => {
        return {
          id,
          userName: usernames[index]
        }
      })
    },
    user_tag_close(id) {
      const idx = this.abnormalEmailRecipient_select.findIndex(item => item.id === id)
      if (idx > -1) {
        this.abnormalEmailRecipient_select.splice(idx, 1)
        this.select_dialog_user_change(this.abnormalEmailRecipient_select)
      }
    },
    async select_callback(select_data) {
      if (select_data.id && !this.updateKeys.includes(select_data.id)) {
        const { code, data } = await this.$api.controlChartSon_info({ id: select_data.id })
        if (code === '200' && data) {
          this.set_email_user_tags(data) // 设置邮件人tag
          this.set_email_userGroup_tags(data) // 设置邮件组tag
          this.updateKeys.push(select_data.id)

          const idx = this.t_data.findIndex(item => select_data.rowNumber === item.rowNumber)
          const d = {
            ...this.t_data[idx],
            ...this.formatNullValue(data)
          }
          this.$set(this.t_data, idx, d)
          this.form = this.t_data[idx]
        }
      } else {
        const idx = this.t_data.findIndex(item => select_data.rowNumber === item.rowNumber)
        this.set_email_user_tags(this.t_data[idx])
        this.set_email_userGroup_tags(this.t_data[idx])
        this.form = this.t_data[idx]
      }
    },
    async request_data({ page_no, page_size, table_data }) {
      return {
        data: this.t_data.map((item, index) => {
          return {
            ...item,
            rowNumber: index + 1
          }
        }),
        total: this.t_data.length
      }
    },
    closed() {
      this.send_row = {}
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>
.control-chart-settings {
  .el-form-item--mini.el-form-item{
    margin-bottom: 14px;
  }
  legend {
    font-weight: 700;
  }
  ::v-deep label.el-form-item__label {
    font-weight: normal;
  }
  .col-label {
    position: relative;
    top: 0;
    left: 0;
    z-index: 1;
    .top-label {
      position: absolute;
      top: -100%;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }
  }
}
</style>
