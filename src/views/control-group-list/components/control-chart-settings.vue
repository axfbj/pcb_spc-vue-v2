<template>
  <ki-dialog
    :visible="visible"
    title="控制图设置"
    width="60%"
    v-bind="$attrs"
    class="control-chart-settings"
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
        <el-row style="padding-bottom: 10px; color: #008040;">控制组名称: {{ settingFlag === 'add' ? treePath : tree_path }}</el-row>
        <el-form-item label="控制图类型:" style="margin-bottom: 10px;">
          <el-select v-model="controlChartType" placeholder="请选择" @change="controlChartType_change">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-reference v-model="inspection_items_select" type="inspection-items" @change="add_inspection_items">
          <ki-button type="primary">添加</ki-button>
        </el-reference>
        <!-- <ki-button type="warning" style="margin-left: 10px;">克隆</ki-button> -->
        <ki-message-box
          :next="del"
          @click="del_btn"
        >
          <ki-button
            type="danger"
            style="margin-left: 10px;"
          >删除</ki-button>
        </ki-message-box>

      </el-form>
      <!-- <div style="overflow:hidden; text-align: right;">
        <ki-button type="primary">添加</ki-button>
        <ki-button type="danger">删除</ki-button>
      </div> -->
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
        <el-form :model="form" label-width="auto">
          <fieldset style="border: 1px solid #ccc; height: 264px;">
            <legend style="color:#606266">基本信息</legend>
            <el-form-item label="规格上限:" prop="usl">
              <el-input v-model.number="form.usl" type="text" :disabled="['P','nP'].includes(controlChartType)" />
            </el-form-item>
            <el-form-item label="目标值:" prop="sl">
              <el-input v-model.number="form.sl" type="text" :disabled="['P','nP'].includes(controlChartType)" />
            </el-form-item>
            <el-form-item label="规格下限:" prop="lsl">
              <el-input v-model.number="form.lsl" type="text" :disabled="['P','nP'].includes(controlChartType)" />
            </el-form-item>
            <el-form-item label="样本容量:" prop="sampleSize">
              <el-input v-model.number="form.sampleSize" type="text" :disabled="['P','X-MR'].includes(controlChartType)" />
            </el-form-item>
            <el-form-item label="小数位数:" prop="digit">
              <el-select v-model="form.digit" placeholder="请选择" style="width:100%;">
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
        <el-form :model="form" label-width="auto">
          <fieldset style="border: 1px solid #ccc;  height: 264px;">
            <legend style="color:#606266">控制图信息</legend>
            <el-form-item label="判异规则:" prop="discriminationRulesStr">
              <el-input v-model="form.discriminationRulesStr" type="text" style="width: 80%;" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_discrimination_rules_dialog">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="控制图层次信息:" prop="chartHierarchicalType">
              <el-input v-model="form.chartHierarchicalType" type="text" style="width: 80%;" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_select_keyword_dialog('level')">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="数据点层次信息:" prop="pointHierarchicalType">
              <el-input v-model="form.pointHierarchicalType" type="text" style="width: 80%;" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_select_keyword_dialog('data')">
                设置
              </ki-button>
            </el-form-item>
            <el-form :model="form" label-width="auto" :inline="true" style="margin-top: 30px;">
              <el-form-item>
                <div style="width: 120px; text-align: right;">上图:</div>
              </el-form-item>
              <el-form-item class="col-label" prop="g1ucl">
                <div class="top-label">上控制限</div>
                <el-input v-model="form.g1ucl" type="text" style="width: 120px;" />
              </el-form-item>
              <el-form-item class="col-label" prop="g1cl">
                <div class="top-label">目标值</div>
                <el-input v-model="form.g1cl" type="text" style="width: 120px;" />
              </el-form-item>
              <el-form-item class="col-label" prop="g1lcl">
                <div class="top-label">下控制限</div>
                <el-input v-model="form.g1lcl" type="text" style="width: 120px;" />
              </el-form-item>
              <br>
              <el-form-item>
                <div style="width: 120px; text-align: right;">下图:</div>
              </el-form-item>
              <el-form-item prop="g2ucl">
                <el-input v-model="form.g2ucl" type="text" style="width: 120px;" />
              </el-form-item>
              <el-form-item prop="g2cl">
                <el-input v-model="form.g2cl" type="text" style="width: 120px;" />
              </el-form-item>
              <el-form-item prop="g2lcl">
                <el-input v-model="form.g2lcl" type="text" style="width: 120px;" />
              </el-form-item>
            </el-form>
          </fieldset>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-form :model="form" label-width="auto">
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
      :visible="discrimination_rules_dialog"
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
import { dateformat } from '@/utils/date-method'
export default {
  name: 'ControlChartSettings',
  components: {
    DiscriminationRulesDialog,
    SelectKeywordDialog
  },
  mixins: [ControlChartSettingsData],
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
      type: String,
      default: ''
    },
    settingFlag: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

      disabledSelectArr: [],

      discrimination_rules_dialog: false,
      select_keyword_dialog: false,
      keyword_flag: '',
      inspection_items_select: { },
      select_row: {},
      controlChartId: '',
      tree_path: '',
      header_list: [
        { prop: 'controlChartCode', label: '编号', width: '180' },
        { prop: 'inspectionName', label: '检测项目', width: '180' },
        { prop: 'sampleSize', label: '样本容量' },
        { prop: 'digit', label: '小数位数' },
        { prop: 'discriminationRulesStr', label: '判异规则' },
        { prop: 'updateUser', label: '更新用户' },
        { prop: 'updateDate', label: '更新时间' }
      ],
      t_data: []
    }
  },
  created() {
    console.log('Datejs', dateformat(new Date()))
  },
  methods: {
    controlChartType_change() {
      this.clear()
    },
    async add_inspection_items(select_data) {
      // const temp = {
      //   inspectionItemsId: select_data.id,
      //   inspectionName: select_data.inspectionName
      // }
      // 'controlChartName': this.treePath,
      // 'controlChartType': ,
      // 'controlGroupId': 0,
      const temp = {
        inspectionName: select_data.inspectionName,
        inspectionItemsId: select_data.id,
        // ------------------------
        // 'chartHierarchicalType': 0, 不传
        chartHierarchicalType: '产品型号=test',
        chartHierarchicalTypeStr: '1=1=test',
        // 'controlChartCode': '', 生成添加
        // 'controlChartId': 0, 不传
        customTitle: '',
        description: '',
        digit: 0,
        'discriminationRules': 'R0',
        'discriminationRulesStr': 'R0',
        g1cl: 0,
        g1lcl: 0,
        g1ucl: 0,
        g2cl: 0,
        g2lcl: 0,
        g2ucl: 0,
        id: 0,
        // 'inspectionItemsId': '',
        lsl: 0,
        // 'pointHierarchicalType': 0, //不传
        pointHierarchicalType: '产品名称=data',
        pointHierarchicalTypeStr: '2=2=data', //	数据点层次信息(示例：层次类型序号=层次类型ID=值)
        sampleSize: 0,
        sl: 0,
        status: 1,
        updateDate: dateformat(new Date()),
        updateUser: 'admin',
        'updateUserId': 1, // 暂时固定传1
        usl: 0
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
      // this.form = temp
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
      if (this.select_row.id) {
        const { code, data } = await this.$api.controlChartSon_delete([this.select_row.id])
        if (code === '200' && data) {
          this.select_row = {}
          this.$message.success('删除成功！')
          this.form = JSON.parse(JSON.stringify(this.form_data))
          this.$refs.dy_table.refresh()
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
      const str1 = this.keyword_flag === 'level' ? pointHierarchicalTypeStr : chartHierarchicalTypeStr
      const ruleArr = str1.split(',')
      ruleArr.forEach(item => {
        const arr = item.split('=')
        if (arr[0]) this.disabledSelectArr.push(arr[0])
      })
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
      this.form.discriminationRules = discriminationRulesStr
      this.form.discriminationRulesStr = discriminationRulesStr
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      loading(true)
      const parmas = this.save_chart_data()
      if (this.settingFlag !== 'update') {
        parmas.controlChartId = 0
      } else {
        parmas.controlChartId = this.controlChartId
        parmas.controlChartSonEntityS = parmas.controlChartSonEntityS.filter(item => !Object.hasOwnProperty.call(item, 'controlChartId'))
      }
      // const p = this.t_data.filter(item => Object.hasOwnProperty.call(item, 'controlChartId'))
      if (parmas.controlChartSonEntityS.length) {
        const { code, data } = await this.$api.controlChartSon_save(parmas)
        if (code === '200' && data) {
          const atchUpdate = await this.controlChartSon_batchUpdate()
          if (atchUpdate === '0') {
            this.$emit('confirm')
          }
        } else {
          loading(false)
        }
      } else {
        this.controlChartSon_batchUpdate()
      }
    },
    async controlChartSon_batchUpdate() {
      const p = this.t_data.filter(item => {
        return Object.hasOwnProperty.call(item, 'controlChartId') && Object.hasOwnProperty.call(item, 'pointHierarchicalType')
      })
      if (!p.length) return '0'
      const { code, data } = await this.$api.controlChartSon_batchUpdate(p)
      if (code === '200' && data) {
        this.$emit('confirm')
      }
    },
    formatNullValue(obj) {
      const o = {}
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          o[key] = obj[key] === null ? '' : obj[key]
        }
      }
      return o
    },
    async open() {
      // alert(this.settingFlag)
      if (this.settingFlag !== 'update') return
      const { id, controlChartId } = this.selectRow[0]
      this.controlChartId = controlChartId
      const { code, data } = await this.$api.controlChart_queryByControlChartId({ controlChartId })
      if (code === '200' && data) {
        const t_data = data.map((item, index) => ({
          ...this.formatNullValue(item),
          discriminationRulesStr: item.discriminationRules,
          rowNumber: index + 1
        }))
        this.tree_path = t_data.length > 0 ? t_data[0].controlChartName : ''
        this.controlChartType = t_data.length > 0 ? t_data[0].controlChartType : ''
        this.t_data = t_data
        this.select_row = {
          rowNumber: t_data.find(item => item.id === id).rowNumber
        }
        this.$refs.dy_table.refresh()
      }
    },
    opened() {
      // this.form.hierarchicalName = this.selectRow.hierarchicalName
    },
    async select_callback(select_data) {
      if (select_data.id) {
        const { code, data } = await this.$api.controlChartSon_info({ id: select_data.id })
        if (code === '200' && data) {
          const idx = this.t_data.findIndex(item => select_data.rowNumber === item.rowNumber)
          const d = {
            ...this.t_data[idx],
            ...data
          }
          this.$set(this.t_data, idx, d)
          this.form = this.t_data[idx]
        }
      } else {
        console.log('select_data', select_data)
        this.form = select_data
      }
    },
    closed() {
      this.clear()
    },
    request_data({ page_no, page_size, table_data }) {
      return new Promise(resolve => {
        return resolve(
          {
            data: this.t_data,
            total: this.t_data.length
          }
        )
      })
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
