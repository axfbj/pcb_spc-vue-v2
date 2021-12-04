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
          <el-checkbox v-model="form.rule1" disabled class="fixed-select">规则一：有1点落在三倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule2">规则二：连续<el-input v-model="form.rule2_data1" class="rule-input" />点落在管制中心线一侧</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule3">规则三：连续<el-input v-model="form.rule3_data1" class="rule-input" />点上升或下降</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule4">规则四：连续<el-input v-model="form.rule4_data1" class="rule-input" />交替上下跳动</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule5">规则五：连续<el-input v-model="form.rule5_data1" class="rule-input" />点中有<el-input v-model="form.rule5_data2" class="rule-input" />点落在中心线同侧两倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule6">规则六：连续<el-input v-model="form.rule6_data1" class="rule-input" />点中有<el-input v-model="form.rule6_data2" class="rule-input" />点落在中心线同侧一倍标准差以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule7">规则七：连续<el-input v-model="form.rule7_data1" class="rule-input" />点落在中心线两侧但未在一倍标准差以内</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule8">规则八：连续<el-input v-model="form.rule8_data1" class="rule-input" />落在规格线以外</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.rule9" disabled class="fixed-select">规则九：落在规格线外</el-checkbox>
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
    }
  },
  data() {
    return {
      form: {
        rule1: true,
        rule2: false,
        rule3: false,
        rule4: false,
        rule5: false,
        rule6: false,
        rule7: false,
        rule8: false,
        rule9: true,
        rule1_data1: '',
        rule2_data1: 9,
        rule3_data1: 6,
        rule4_data1: 14,
        rule5_data1: 3,
        rule5_data2: 2,
        rule6_data1: 5,
        rule6_data2: 4,
        rule7_data1: 15,
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
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        if (this.flag === 'add') {
          this.add()
        } else {
          this.update()
        }
      })
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
      // if (this.flag !== 'add') {
      //   const { code, data } = await load(() => this.$api.controlGroup_info({ id: this.nodeKey }))
      //   if (code === '200' && data) {
      //     const { groupName, erpCode, groupDescription } = data
      //     this.form = {
      //       groupName,
      //       erpCode,
      //       groupDescription
      //     }
      //   }
      // }
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
