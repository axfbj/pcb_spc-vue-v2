<template>
  <div>
    <el-form>
      <el-form-item>
        <el-radio-group v-model="form.radio">
          <el-radio :label="3">不指定 允许的通配符[, - * /] 非必填</el-radio>
          <el-radio :label="4">每年</el-radio>
          <el-radio :label="6">
            <span class="custum-label">周期从</span>
            <el-input v-model="form.input1" placeholder="" style="width: 200px;" />
            -
            <el-input v-model="form.input2" placeholder="" style="width: 200px;" />
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form_data: {
        radio: 3,
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        checkList: []
      },
      form: {},
      weekOptions: [
        {
          value: 1,
          label: '日'
        },
        {
          value: 2,
          label: '一'
        },
        {
          value: 3,
          label: '二'
        }
      ]
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-radio{
        display: block;
        line-height: 23px;
        white-space: normal;
        margin-right: 0;
        margin: 10px 0;
    }
    .custum-label {
      display: inline-block;
      width: 50px;
    }
</style>
