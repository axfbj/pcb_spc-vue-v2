<template>
  <ki-dialog
    :visible="visible"
    title="控制图设置"
    width="60%"
    v-bind="$attrs"
    class="control-chart-settings"
    @handleClose="handleClose"
    @confirm="confirm"
    @opened="opened"
  >
    <div style="padding: 0px 20px; overflow:hidden;">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        style="float: left;"
      >
        <el-row style="padding-bottom: 10px; color: #008040;">控制组名称: {{ treePath }}</el-row>
        <el-form-item label="控制图类型:" style="margin-bottom: 10px;">
          <el-select v-model="controlChartType" placeholder="请选择">
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
        <ki-button type="warning" style="margin-left: 10px;">克隆</ki-button>
        <ki-button
          type="danger"
        >删除</ki-button>

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
        @select="select_callback"
      />
    </div>
    <el-row>
      <el-col :span="6">
        <el-form :model="form" label-width="auto">
          <fieldset style="border: 1px solid #ccc; height: 264px;">
            <legend style="color:#606266">基本信息</legend>
            <el-form-item label="规格上限:" prop="usl">
              <el-input v-model="form.usl" type="text" :disabled="['P','nP'].includes(form.controlChartType)" />
            </el-form-item>
            <el-form-item label="目标值:" prop="sl">
              <el-input v-model="form.sl" type="text" :disabled="['P','nP'].includes(form.controlChartType)" />
            </el-form-item>
            <el-form-item label="规格下限:" prop="lsl">
              <el-input v-model="form.lsl" type="text" :disabled="['P','nP'].includes(form.controlChartType)" />
            </el-form-item>
            <el-form-item label="样本容量:" prop="sampleSize">
              <el-input v-model="form.sampleSize" type="text" :disabled="['P','X-MR'].includes(form.controlChartType)" />
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
            <el-form-item label="判异规则:">
              <el-input type="text" style="width: 80%;" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_discrimination_rules_dialog">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="控制图层次信息:" prop="chartHierarchicalTypeStr">
              <el-input v-model="form.chartHierarchicalTypeStr" type="text" style="width: 80%;" />
              <ki-button type="warning" style="margin-left: 10px;" @click="open_select_keyword_dialog('level')">
                设置
              </ki-button>
            </el-form-item>
            <el-form-item label="数据点层次信息:">
              <el-input type="text" style="width: 80%;" />
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
            <el-input v-model="from.customTitle" type="text" />
          </el-form-item>
        </fieldset>
      </el-form>
    </el-row>
    <discrimination-rules-dialog
      :visible="discrimination_rules_dialog"
      @handleClose="rules_dialog_close"
      @confirm="rules_confirm"
    />
    <select-keyword-dialog
      :visible="select_keyword_dialog"
      :keyword-flag="keyword_flag"
      @handleClose="keyword_dialog_close"
      @confirm="keyword_dialog_confirm"
    />
  </ki-dialog>

</template>

<script>
import DiscriminationRulesDialog from './discrimination-rules-dialog'
import SelectKeywordDialog from './select-keyword-dialog'
import ControlChartSettingsData from './mixins/control-chart-settings-data'
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
    }
  },
  data() {
    return {
      discrimination_rules_dialog: false,
      select_keyword_dialog: false,
      keyword_flag: '',
      inspection_items_select: { },
      select_row: {},
      header_list: [
        { prop: 'controlChartCode', label: '编号', width: '180' },
        { prop: 'inspectionName', label: '检测项目', width: '180' },
        { prop: 'address', label: '样本容量' },
        { prop: 'address1', label: '小数位数' },
        { prop: 'address2', label: '判异规则' },
        { prop: 'address3', label: '更新用户' },
        { prop: 'address4', label: '更新时间' }
      ],
      t_data: []
    }
  },
  methods: {
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
        chartHierarchicalTypeStr: '1-1-test',
        // 'controlChartCode': '', 生成添加
        // 'controlChartId': 0, 不传
        customTitle: '',
        description: '',
        digit: 0,
        'discriminationRulesStr': 'R0,R3-6',
        g1cl: 0,
        g1lcl: 0,
        g1ucl: 0,
        g2cl: 0,
        g2lcl: 0,
        g2ucl: 0,
        id: 0,
        // 'inspectionItemsId': '',
        lsl: 0,
        'pointHierarchicalType': 0,
        'pointHierarchicalTypeStr': '',
        sampleSize: 0,
        sl: 0,
        status: 1,
        updateDate: new Date(),
        'updateUserId': 0,
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
        id: index + 1
      }))
      this.form = temp
      this.select_show = { id: this.t_data[this.t_data.length - 1].id }
      this.$refs.dy_table.refresh()
    },
    open_select_keyword_dialog(flag) {
      this.keyword_flag = flag
      this.select_keyword_dialog = true
    },
    keyword_dialog_close() {
      this.select_keyword_dialog = false
    },
    keyword_dialog_confirm() {
      this.select_keyword_dialog = false
    },
    open_discrimination_rules_dialog() {
      this.discrimination_rules_dialog = true
    },
    rules_dialog_close() {
      this.discrimination_rules_dialog = false
    },
    rules_confirm() {
      this.discrimination_rules_dialog = false
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    confirm() {
      // alert(1)
      this.$emit('confirm')
    },
    opened() {
      this.form.hierarchicalName = this.selectRow.hierarchicalName
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    },
    request_data({ page_no, page_size, table_data }) {
      return new Promise(resolve => {
        console.log(this.t_data)
        return resolve(

          {
            data: this.t_data,
            total: this.t_data.length
          }
        )
      })
      // this.data = []
      // console.log('------------------', page_no, page_size)
      // page_no = Number(page_no)
      // page_size = Number(page_size)
      // const total = 6
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
