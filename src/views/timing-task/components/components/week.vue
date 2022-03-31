<template>
  <div>
    <el-form>

      <el-form-item>
        <el-radio-group v-model="form.radio" @change="radio_change">
          <el-radio :label="1">周 允许的通配符[, - * /]</el-radio>
          <el-radio :label="2">不指定</el-radio>
          <el-radio :label="3">
            <span class="custum-label">周期从</span>
            <el-input-number v-model="form.input1" style="width: 200px;" :controls="false" :min="1" :max="6" @change="input_change" />
            <span class="custum-label" style="width: 80px; text-align: center;">-</span>
            <el-input-number v-model="form.input2" style="width: 200px;" :controls="false" :min="2" :max="7" @change="input_change" />
          </el-radio>
          <el-radio :label="4">
            <span class="custum-label">第</span>
            <el-input-number v-model="form.input3" style="width: 200px;" :controls="false" :min="1" :max="6" @change="input_change" />
            <span class="custum-label" style="width: 80px;">&nbsp;星期的星期</span>
            <el-select v-model="form.input4" style="width: 200px;" placeholder="" @change="input_change">
              <el-option
                v-for="item in weekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-radio>
          <el-radio :label="5">
            本月最后一个星期
            <el-select v-model="form.input5" style="width: 200px;" placeholder="" @change="input_change">
              <el-option
                v-for="item in weekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-radio>
          <el-radio :label="6">指定
            <br>
            <el-checkbox-group v-model="form.checkList" style="margin-left: 20px;" @change="input_change">
              <el-checkbox v-for="item in weekOptions" :key="item.value" :label="item.value">
                {{ `${item.value} (周${item.label})` }}
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
        input5: undefined,
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
        },
        {
          value: 4,
          label: '三'
        },
        {
          value: 5,
          label: '四'
        },
        {
          value: 6,
          label: '五'
        },
        {
          value: 7,
          label: '六'
        }
      ]
    }
  },
  computed: {
    result() {
      const { radio, input1, input2, input3, input4, input5, checkList } = this.form
      let result = ''
      if (radio === 1) {
        result = '*'
      } else if (radio === 2) {
        result = '?'
      } else if (radio === 3) {
        if (typeof input1 === 'number' && typeof input2 === 'number') result = `${input1}-${input2}`
      } else if (radio === 4) {
        if (typeof input3 === 'number' && typeof input4 === 'number') result = `${input3}/${input4}`
      } else if (radio === 5) {
        if (typeof input5 === 'number') result = `${input5}L`
      } else if (radio === 6) {
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
      if (this.result) this.$emit('get-result', { type: 'week', result: this.result })
    },
    radio_change() {
      if (this.result) this.$emit('get-result', { type: 'week', result: this.result })
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
