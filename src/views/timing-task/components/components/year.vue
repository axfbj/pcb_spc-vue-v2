<template>
  <div>
    <el-form>
      <el-form-item>
        <el-radio-group v-model="form.radio" @change="radio_change">
          <el-radio :label="1">不指定 允许的通配符[, - * /] 非必填</el-radio>
          <el-radio :label="2">每年</el-radio>
          <el-radio :label="3">
            <span class="custum-label">周期从</span>
            <el-input-number v-model="form.input1" style="width: 200px;" :controls="false" :min="2000" :max="2999" @change="input_change" />
            -
            <el-input-number v-model="form.input2" style="width: 200px;" :controls="false" :min="2001" :max="3000" @change="input_change" />
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
        input2: undefined
      },
      form: {}
    }
  },
  computed: {
    result() {
      const { radio, input1, input2 } = this.form
      let result = ''
      if (radio === 1) {
        result = ''
      } else if (radio === 2) {
        result = '*'
      } else if (radio === 3) {
        if (typeof input1 === 'number' && typeof input2 === 'number') result = `${input1}-${input2}`
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
      this.$emit('get-result', { type: 'year', result: this.result })
    },
    radio_change() {
      this.$emit('get-result', { type: 'year', result: this.result })
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
