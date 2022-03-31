<template>
  <ki-dialog
    :visible="visible"
    title="批量修改控制图"
    width="60%"
    v-bind="$attrs"
    class="control-chart-settings"
    :permission="['control.update']"
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
        <!-- <el-row style="padding-bottom: 10px; color: #008040;">控制组名称: {{ settingFlag === 'add' ? treePath.pathStr : tree_path }}</el-row> -->
        <!-- <el-form-item label="控制图类型:" style="margin-bottom: 10px;">
          <el-select v-model="controlChartType" placeholder="请选择" :disabled="settingFlag !== 'add'" @change="controlChartType_change">
            <el-option
              v-for="item in commonVariable.chartOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
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
        unique="id"
      />
    </div>
    <el-row>
      <el-row style="padding: 5px 10px;">
        <!-- <span style="color: #F56C6C;">说明: 高亮的输入框中的值说明存在多个不同的值</span> -->
        <span style="color: #64c95b;">说明: 高亮的输入框表示存在多个不同的值，如果不需要统一该字段的值，不要输入值保持输入框高亮</span>
      </el-row>
      <el-col :span="6">
        <el-form :model="form" label-width="80px">
          <fieldset style="border: 1px solid #ccc; height: 354px;">
            <legend style="color:#606266">基本信息</legend>
            <el-form-item label="规格上限:" prop="usl">
              <el-input-number v-model="form.usl" :precision="!form.usl ? undefined :form.digit" style="width: 100%;" :controls="false" :disabled="count_graph.includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('usl')}" @change="form_change('usl',...arguments)" />
            </el-form-item>
            <el-form-item label="目标值:" prop="sl">
              <el-input-number v-model="form.sl" :precision="!form.sl ? undefined :form.digit" style="width: 100%;" :controls="false" type="number" :disabled="count_graph.includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('sl')}" @change="form_change('sl',...arguments)" />
            </el-form-item>
            <el-form-item label="规格下限:" prop="lsl">
              <el-input-number v-model="form.lsl" :precision="!form.lsl ? undefined :form.digit" style="width: 100%;" :controls="false" type="number" :disabled="count_graph.includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('lsl')}" @change="form_change('lsl',...arguments)" />
            </el-form-item>
            <el-form-item label="样本容量:" prop="sampleSize">
              <!-- :max="25"  -->
              <el-input-number v-model="form.sampleSize" :max="['Xbar-R', 'Xbar-s','X-MR'].includes(controlChartType) ? 25 : undefined" style="width: 100%;" :controls="false" type="number" :disabled="[...count_graph,'X-MR'].includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('sampleSize')}" @change="form_change('sampleSize',...arguments)" />
            </el-form-item>
            <el-form-item label="小数位数:" prop="digit">
              <el-select v-model="form.digit" placeholder="请选择" style="width:100%;" :disabled="count_graph.includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('digit')}" @change="form_change('digit',...arguments)">
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
              <el-input v-model="form.discriminationRulesStr" type="text" style="width: 80%;" readonly :class="{'highlight-border-color': change_borderColor('discriminationRulesStr')}" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_discrimination_rules_dialog">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="控制图层次信息:" prop="chartHierarchicalType">
              <el-input v-model="form.chartHierarchicalType" type="text" style="width: 80%;" readonly :class="{'highlight-border-color': change_borderColor('chartHierarchicalType')}" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_select_keyword_dialog('level')">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="数据点层次信息:" prop="pointHierarchicalType">
              <el-input v-model="form.pointHierarchicalType" type="text" style="width: 80%;" readonly :class="{'highlight-border-color': change_borderColor('pointHierarchicalType')}" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_select_keyword_dialog('data')">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="异常接收人:" prop="abnormalEmailRecipients" :class="{'highlight-border-color': change_borderColor('abnormalEmailRecipients')}">
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
            <el-form-item label="异常接收组:" prop="warningUserGroupId" :class="{'highlight-border-color': change_borderColor('warningUserGroupId')}">
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
                <el-input-number v-model="form.g1ucl" :controls="false" style="width: 120px;" :disabled="['p','u','y'].includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('g1ucl')}" @change="form_change('g1ucl',...arguments)" />
              </el-form-item>
              <el-form-item class="col-label" prop="g1cl">
                <div class="top-label">目标值</div>
                <el-input-number v-model="form.g1cl" :controls="false" style="width: 120px;" :class="{'highlight-border-color': change_borderColor('g1cl')}" @change="g1cl_change" />
              </el-form-item>
              <el-form-item class="col-label" prop="g1lcl">
                <div class="top-label">下控制限</div>
                <el-input-number v-model="form.g1lcl" :controls="false" style="width: 120px;" :disabled="['p','u','y'].includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('g1lcl')}" @change="form_change('g1lcl',...arguments)" />
              </el-form-item>
              <br>
              <el-form-item>
                <div style="width: 120px; text-align: right;">下图:</div>
              </el-form-item>
              <el-form-item prop="g2ucl">
                <el-input-number v-model="form.g2ucl" :controls="false" style="width: 120px;" :disabled="['XMR',...count_graph].includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('g2ucl')}" @change="form_change('g2ucl',...arguments)" />
              </el-form-item>
              <el-form-item prop="g2cl">
                <el-input-number v-model="form.g2cl" :controls="false" style="width: 120px;" :disabled="['XMR',...count_graph].includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('g2cl')}" @change="form_change('g2cl',...arguments)" />
              </el-form-item>
              <el-form-item prop="g2lcl">
                <el-input-number v-model="form.g2lcl" :controls="false" style="width: 120px;" :disabled="['XMR',...count_graph].includes(controlChartType)" :class="{'highlight-border-color': change_borderColor('g2lcl')}" @change="form_change('g2lcl',...arguments)" />
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
            <el-input v-model="form.description" type="text" :class="{'highlight-border-color': change_borderColor('description')}" @change="form_change('description',...arguments)" />
          </el-form-item>
          <!-- <el-form-item label="自定义控制图标题:" prop="customTitle">
            <el-input v-model="form.customTitle" type="text" />
          </el-form-item> -->
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
import batch_control_chart_settings_data from './mixins/batch-control-chart-settings-data'
import { dateformat } from '@/utils/date-method'
import { debounce } from '@/utils/tools'
import _ from 'loadsh'
export default {
  name: 'BatchControlChartSettings',
  components: {
    DiscriminationRulesDialog,
    SelectKeywordDialog
  },
  mixins: [ControlChartSettingsData, userGroup_reference, batch_control_chart_settings_data],
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
      controlChartId: '',
      tree_path: '',
      header_list: [
        { prop: 'controlChartCode', label: '编号', width: '180' },
        { prop: 'inspectionName', label: '检测项目', width: '180' },
        { prop: 'controlChartType', label: '图类', width: '100' },
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

    select_dialog_user_change(users) {
      this.form.abnormalEmailRecipients = users.map(user => user.id)
      this.form.abnormalEmailRecipientsStr = users.map(user => user.userName).toString()
      this.form_change('abnormalEmailRecipients', this.form.abnormalEmailRecipient)
      this.form_change('abnormalEmailRecipientsStr', this.form.abnormalEmailRecipientsStr)
    },
    g1cl_change(val) {
      if (['p', 'u'].includes(this.controlChartType)) {
        if (val >= 1) {
          this.$message.warning('设置的中心值必须小于1')
          this.form['g1cl'] = 0.99
          this.form_change('g1cl', 0.99)
          return
        }
      }
      this.form_change('g1cl', val)
    },
    controlChartType_change() {
      this.clean('change')
    },
    badGroup_dialog_btn() {
      this.badGroup_dialog = true
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
      this.select_keyword_dialog = false
      if (info) {
        for (const key in info) {
          if (Object.hasOwnProperty.call(info, key)) {
            this.form[key] = info[key]
            this.form_change(key, this.form[key])
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
      this.form_change('discriminationRulesStr', discriminationRulesStr)
      this.discrimination_rules_dialog = false
      this.form.discriminationRulesStr = discriminationRulesStr
      // this.select_row['discriminationRules'] = this.form.discriminationRules
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose', this.has_del)
    },
    async confirm({ loading }) {
      loading(true)
      const params = this.save_chart_data().controlChartSonEntityS
      params.forEach(item => {
        this.sameResultKeys.forEach(key => {
          item[key] = this.form[key]
          // if (key === 'discriminationRulesStr') {
          // item['discriminationRulesStr'] = this. item['discriminationRulesStr']
          // }
          if (key === 'pointHierarchicalTypeStr' && !this.sameResultKeys.includes('chartHierarchicalTypeStr')) {
            item['chartHierarchicalTypeStr'] = this.point_filter(item, 'chartHierarchicalTypeStr', 'pointHierarchicalTypeStr')
          }
          if (key === 'chartHierarchicalTypeStr' && !this.sameResultKeys.includes('pointHierarchicalTypeStr')) {
            item['pointHierarchicalTypeStr'] = this.point_filter(item, 'pointHierarchicalTypeStr', 'chartHierarchicalTypeStr')
          }
          delete item.chartHierarchicalType
          delete item.pointHierarchicalType
          delete item.discriminationRules
          delete item.pointHierarchicalTypeIds
        })
      })

      this.controlChartSon_batchUpdate(loading, params)
    },
    async controlChartSon_batchUpdate(loading, p) {
      if (p.length === 0) {
        this.$emit('confirm')
        return
      }
      debugger
      console.log(p)
      const { code } = await this.$api.controlChartSon_batchUpdate(p)

      if (code === '200') {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    allTheSame(data, key) {
      return data.length && data.every((item) => {
        return _.isEqual(item[key], data[0][key])
      })
    },
    async open() {
      this.t_data = this.selectRow.map(item => ({ id: item.id }))
      this.controlChartType = this.selectRow[0]['controlChartType']
      this.getAllRowDetils(this.t_data)
    },
    getAllRowDetils(rows) {
      const arr = []
      for (let index = 0; index < rows.length; index++) {
        const res = this.$api.controlChartSon_info({ id: rows[index].id })
        arr.push(res)
      }
      Promise.all(arr).then(res => {
        // success
        const success = res.every(r => r.code === '200')
        if (success) {
          const allData = res.map(item => item.data)

          allData.forEach(d => {
            const idx = this.selectRow.findIndex(item => item.id === d.id)
            const { inspectionName, controlChartType } = this.selectRow[idx]
            const row_data = {
              ...d,
              // discriminationRules: d['discriminationRulesStr'],
              inspectionName,
              controlChartType,
              userName: this.username,
              updateDate: dateformat(new Date())
            }
            this.t_data[idx] = row_data
          })
          this.$refs.dy_table.refresh()
          const modifyKeys = ['usl', 'sl', 'lsl',
            'sampleSize', 'digit', 'description',
            'discriminationRulesStr',
            'pointHierarchicalType', 'pointHierarchicalTypeStr',
            'chartHierarchicalType', 'chartHierarchicalTypeStr',
            'abnormalEmailRecipients',
            'warningUserGroupId',
            'g1ucl', 'g1cl', 'g1lcl',
            'g2ucl', 'g2cl', 'g2lcl'
          ]
          // const pointHierarchicalTypeStrArr = []
          modifyKeys.forEach(key => {
            const isAllSameValue = this.allTheSame(allData, key)
            if (isAllSameValue) {
              // if (key === 'discriminationRulesStr') { // 这个要区别开 麻烦
              //   this.form['discriminationRules'] = allData[0]['discriminationRulesStr']
              // }
              this.form[key] = allData[0][key] === null ? undefined : allData[0][key]

              if (key === 'abnormalEmailRecipients') {
                this.set_email_user_tags(allData[0])
              }
              if (key === 'warningUserGroupId') {
                this.set_email_userGroup_tags(allData[0])
              }
              this.sameResultKeys.push(key)
            }
          })
        }
      })
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
      this.sameResultKeys = []
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

<style lang="scss" scoped>
::v-deep .highlight-border-color{
  .el-input__inner {
    border-color: #64c95b;
  }

}
</style>
