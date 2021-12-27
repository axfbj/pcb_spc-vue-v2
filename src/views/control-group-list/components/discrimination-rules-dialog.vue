<template>
  <ki-dialog
    :visible="visible"
    title="判异规则"
    v-bind="$attrs"
    width="40%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form">
        <el-form-item v-if="!['p','np'].includes(controlChartType)">
          <el-checkbox v-model="form.rule0" class="fixed-select">R0：落在规格线外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule1" class="fixed-select">R1：有{{ form.rule1_data1 }}点落在{{ form.rule1_data2 }}倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule2">R2：连续<el-input v-model="form.rule2_data1" class="rule-input" />点落在管制中心线一侧</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule3">R3：连续<el-input v-model="form.rule3_data1" class="rule-input" />点上升或下降</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule4">R4：连续<el-input v-model="form.rule4_data1" class="rule-input" />交替上下跳动</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-if="!['p','np'].includes(controlChartType)" v-model="form.rule5">R5：连续<el-input v-model="form.rule5_data1" class="rule-input" />点中有<el-input v-model="form.rule5_data2" class="rule-input" />点落在中心线同侧{{ form.rule5_data3 }}倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-if="!['p','np'].includes(controlChartType)" v-model="form.rule6">R6：连续<el-input v-model="form.rule6_data1" class="rule-input" />点中有<el-input v-model="form.rule6_data2" class="rule-input" />点落在中心线同侧{{ form.rule6_data3 }}倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-if="!['p','np'].includes(controlChartType)" v-model="form.rule7">R7：连续<el-input v-model="form.rule7_data1" class="rule-input" />点落在中心线两侧的{{ form.rule7_data2 }}倍标准差以内</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-if="!['p','np'].includes(controlChartType)" v-model="form.rule8">R8：连续<el-input v-model="form.rule8_data1" class="rule-input" />点落在中心线两侧但未在{{ form.rule8_data2 }}倍标准差以内</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'DiscriminationRulesDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    },
    controlChartType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        rule0: false,
        rule1: false,
        rule2: false,
        rule3: false,
        rule4: false,
        rule5: false,
        rule6: false,
        rule7: false,
        rule8: false,
        // rulesEight: 0,
        // rulesFive: 0,
        // rulesFour: 1,
        // rulesNine: 0,
        // rulesOne: 1,
        // rulesSeven: 0,
        // rulesSix: 0,
        // rulesThree: 0,
        // rulesTwo: 0,
        rule1_data1: 1, //
        rule1_data2: 3, //
        rule2_data1: 9,
        rule3_data1: 6,
        rule4_data1: 14,
        rule5_data1: 3,
        rule5_data2: 2,
        rule5_data3: 2, //
        rule6_data1: 5,
        rule6_data2: 4,
        rule6_data3: 1, //
        rule7_data1: 15,
        rule7_data2: 1,
        rule8_data1: 8,
        rule8_data2: 1
      }
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    set_checkboxData() {
      const { discriminationRulesStr } = this.selectRow
      const str = discriminationRulesStr || ''
      const ruleArr = str.split(',')
      for (let index = 0; index < 9; index++) {
        this.form[`rule${index}`] = false
      }
      ruleArr.forEach(item => {
        const ruleNum = item.split('-')[0].substring(1)
        this.form[`rule${ruleNum}`] = true
      })
    },
    async confirm({ loading }) {
      let discriminationRulesStr = ''
      for (let i = 0; i < 9; i++) {
        if (this.form[`rule${i}`]) {
          if (!discriminationRulesStr) {
            discriminationRulesStr += `R${i}`
          } else {
            discriminationRulesStr += `,R${i}`
          }
          for (let j = 1; j < 4; j++) {
            if (Object.hasOwnProperty.call(this.form, `rule${i}_data${j}`)) {
              discriminationRulesStr += `-${this.form[`rule${i}_data${j}`]}`
            }
          }
        }
      }
      this.$emit('confirm', discriminationRulesStr)
    },
    async open({ load }) {
      this.set_checkboxData()
    },
    closed() {
    }
  }
}
</script>

<style lang="scss" scoped>
.fixed-select {
  ::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #1890ff;
  }
}
.rule-input {
  width: 60px;
}
</style>
