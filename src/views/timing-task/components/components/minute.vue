<template>
  <div>
    <el-form>

      <el-form-item>
        <el-radio-group v-model="form.radio" @change="radio_change">
          <el-radio :label="1">每分 允许的通配符[, - * /]</el-radio>
          <el-radio :label="2">
            <span class="custum-label">周期从</span>
            <el-input-number v-model="form.input1" style="width: 200px;" :controls="false" :min="0" :max="58" @change="input_change" />
            <span class="custum-label" style="width: 80px; text-align: center;">-</span>
            <el-input-number v-model="form.input2" style="width: 200px;" :controls="false" :min="1" :max="59" @change="input_change" />
            分
          </el-radio>
          <el-radio :label="3">
            <span class="custum-label">从</span>
            <el-input-number v-model="form.input3" style="width: 200px;" :controls="false" :min="0" :max="59" @change="input_change" />
            <span class="custum-label" style="width: 80px;">&nbsp;分开始，每</span>
            <el-input-number v-model="form.input4" style="width: 200px;" :controls="false" :min="1" :max="59" @change="input_change" />
            分执行一次
          </el-radio>
          <el-radio :label="4">指定
            <br>
            <el-checkbox-group v-model="form.checkList" style="margin-left: 20px;">
              <el-checkbox v-for="index of 60" :key="index-1" :label="index-1" @change="input_change">
                <template v-if="index-1 < 10">
                  {{ index-1 }}<span style="visibility:hidden;">0</span>
                </template>
                <template v-else>{{ index-1 }}</template>

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
        radio: 1,
        input1: undefined,
        input2: undefined,
        input3: undefined,
        input4: undefined,
        checkList: []
      },
      form: {}
    }
  },
  computed: {
    result() {
      const { radio, input1, input2, input3, input4, checkList } = this.form
      let result = ''
      if (radio === 1) {
        result = '*'
      } else if (radio === 2) {
        if (typeof input1 === 'number' && typeof input2 === 'number') result = `${input1}-${input2}`
      } else if (radio === 3) {
        if (typeof input3 === 'number' && typeof input4 === 'number') result = `${input3}/${input4}`
      } else if (radio === 4) {
        if (checkList.length > 0) result = checkList.toString()
      }
      return result
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clean() {
      this.form = JSON.parse(JSON.stringify(this.form_data))
    },
    input_change() {
      console.log('this.result', this.result)
      if (this.result) this.$emit('get-result', { type: 'minute', result: this.result })
    },
    radio_change() {
      if (this.result) this.$emit('get-result', { type: 'minute', result: this.result })
    }
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
