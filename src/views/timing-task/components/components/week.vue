<template>
  <div>
    <el-form>

      <el-form-item>
        <el-radio-group v-model="form.radio">
          <el-radio :label="3">周 允许的通配符[, - * /]</el-radio>
          <el-radio :label="4">不指定</el-radio>
          <el-radio :label="6">
            <el-input v-model="form.input1" placeholder="" style="width: 300px;">
              <template slot="prepend">周期从</template>
              <template slot="append">-</template>
            </el-input>
            <el-input v-model="form.input2" placeholder="" style="width: 300px; border-left-width: 0;" />
          </el-radio>
          <el-radio :label="9">
            <el-input v-model="form.input3" placeholder="" style="width: 300px;">
              <template slot="prepend">第</template>
              <template slot="append">星期的星期</template>
            </el-input>
            <el-select v-model="form.input4" placeholder="" style="width: 300px;">
              <el-option
                v-for="item in weekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-radio>
          <el-radio :label="11">
            本月最后一个星期
            <el-select v-model="form.input4" placeholder="" style="width: 300px;">
              <el-option
                v-for="item in weekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-radio>
          <el-radio :label="10">指定
            <br>
            <el-checkbox-group v-model="form.checkList" style="margin-left: 20px;">
              <el-checkbox v-for="index of 12" :key="index" :label="index">
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
    .ipt-item {
      width: 300px;
    }
</style>
