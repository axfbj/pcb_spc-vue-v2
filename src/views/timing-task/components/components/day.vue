<template>
  <div>
    <el-form>

      <el-form-item>
        <el-radio-group v-model="form.radio">
          <el-radio :label="1">每日 允许的通配符[, - * /]</el-radio>
          <el-radio :label="2">不指定</el-radio>
          <el-radio :label="3">
            <span class="custum-label">周期从</span>
            <el-input v-model="form.input1" placeholder="" style="width: 300px;" />
            <template slot="append">-</template>
            <el-input v-model="form.input2" placeholder="" style="width: 300px; border-left-width: 0;">
              <template slot="append">日</template>
            </el-input>
          </el-radio>
          <el-radio :label="4">
            <el-input v-model="form.input3" placeholder="" style="width: 300px;">
              <template slot="prepend">从</template>
              <template slot="append">日开始，每</template>
            </el-input>
            <el-input v-model="form.input4" placeholder="" style="width: 300px;">
              <template slot="append">日执行一次</template>
            </el-input>
          </el-radio>
          <el-radio :label="5">
            <el-input v-model="form.input5" placeholder="" style="width: 600px;">
              <template slot="prepend">每月</template>
              <template slot="append">号最近的那个工作日</template>
            </el-input>
          </el-radio>
          <el-radio :label="6">指定
            <br>
            <el-checkbox-group v-model="form.checkList" style="margin-left: 20px;">
              <el-checkbox v-for="index of 31" :key="index" :label="index">
                <template v-if="index < 10">
                  {{ index }}<span style="visibility:hidden;">0</span>
                </template>
                <template v-else>{{ index }}</template>

              </el-checkbox>

            </el-checkbox-group>
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
        input5: '',
        checkList: []
      },
      form: {}
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
