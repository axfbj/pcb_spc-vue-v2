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
        <el-form-item>
          <el-checkbox v-model="form.rule0" disabled class="fixed-select">规则0：落在规格线外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule1" class="fixed-select">规则1：有{{ form.rule1_data1 }}点落在{{ form.rule1_data2 }}倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule2">规则2：连续<el-input v-model="form.rule2_data1" class="rule-input" />点落在管制中心线一侧</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule3">规则3：连续<el-input v-model="form.rule3_data1" class="rule-input" />点上升或下降</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule4">规则4：连续<el-input v-model="form.rule4_data1" class="rule-input" />交替上下跳动</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule5">规则5：连续<el-input v-model="form.rule5_data1" class="rule-input" />点中有<el-input v-model="form.rule5_data2" class="rule-input" />点落在中心线同侧{{ form.rule5_data3 }}倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule6">规则6：连续<el-input v-model="form.rule6_data1" class="rule-input" />点中有<el-input v-model="form.rule6_data2" class="rule-input" />点落在中心线同侧{{ form.rule6_data3 }}倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule7">规则7：连续<el-input v-model="form.rule7_data1" class="rule-input" />点落在中心线两侧但未在{{ form.rule7_data2 }}倍标准差以内</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule8">规则8：连续<el-input v-model="form.rule8_data1" class="rule-input" />落在规格线以外</el-checkbox>
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
    }
  },
  data() {
    return {
      form: {
        rule0: true,
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
        rule8_data1: 8
      }
    }
  },
  computed: {
    nodeKey() {
      return this.nodeData.id
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    // set_checkboxData() {
    //   const { discriminationRulesStr } = this.selectRow
    //   const ruleArr = discriminationRulesStr.split(',')
    //   ruleArr.forEach(item => {
    //     const ruleNum = item.split('-')[0].substring(1)
    //     this.form[`rule${ruleNum}`] = true
    //   })
    // },
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
      // console.log(res)
      this.$emit('confirm', discriminationRulesStr)
      // this.$refs.form.validate(valid => {
      //   if (!valid) return
      //   loading(true)
      //   if (this.flag === 'add') {
      //     this.add()
      //   } else {
      //     this.update()
      //   }
      // })
    },
    async add() {
      // console.log('node', this.nodeData)
      // const { code, data } = await this.$api.controlGroup_save({
      //   parentId: this.level === '0' ? this.nodeData.id : this.nodeData.parentId,
      //   ...this.form
      // })
      // if (code === '200' && data) {
      //   this.$emit('confirm')
      // }
      // this.handleClose()
    },
    async update() {
      // const json = {
      //   rulesOne: 'rules1',
      //   rulesTwo: 'rules2',
      //   rulesThree: 'rules3',
      //   rulesFour: 'rules4',
      //   rulesFive: 'rules5',
      //   rulesSix: 'rules6',
      //   rulesSeven: 'rules7',
      //   rulesEight: 'rules8',
      //   rulesNine: 'rules0'
      // }
      // const { code, data } = await this.$api.controlGroup_update({
      //   id: this.nodeKey,
      //   ...this.form
      // })
      // if (code === '200' && data) {
      //   this.$emit('confirm')
      // }
      // this.handleClose()
    },
    async open({ load }) {
      // this.flag = this.$attrs.flag
      const json = {
        'rule1': 'rulesOne',
        'rule2': 'rulesTwo',
        'rule3': 'rulesThree',
        'rule4': 'rulesFour',
        'rule5': 'rulesFive',
        'rule6': 'rulesSix',
        'rule7': 'rulesSeven',
        'rule8': 'rulesEight',
        'rule0': 'rulesNine'
      }
      if (Object.hasOwnProperty.call(this.selectRow, 'discriminationRulesId')) {
        const { discriminationRulesId } = this.selectRow

        const { code, data } = await load(() => this.$api.discriminationRules_info({ discriminationRulesId }))
        if (code === '200' && data) {
          console.log('data', data)

          for (const key in json) {
            if (Object.hasOwnProperty.call(json, key)) {
              this.form[key] = Boolean(data[json[key]])
            }
          }
          // const { groupName, erpCode, groupDescription } = data
          // this.form = {
          //   groupName,
          //   erpCode,
          //   groupDescription
          // }
        }
      }

      // this.$refs.ipt.focus()
    },
    closed() {
      // this.level = '0'
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
