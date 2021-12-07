<template>
  <ki-dialog
    :visible="visible"
    title="添加数据"
    v-bind="$attrs"
    width="40%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="抽检时间:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入时间:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平均值:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抽检时间:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抽检时间:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="极差值:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标准差:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大值:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最小值:">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="录入用户:">
              <!-- <el-input /> -->
              admin
            </el-form-item>
          </el-col>
        </el-row>

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
      this.$emit('confirm')
    },
    async add() {

    },
    async update() {

    },
    async open({ load }) {

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
