<template>
  <ki-dialog
    :visible="visible"
    title="选项设置"
    v-bind="$attrs"
    width="25%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form">
        <el-form-item label="横轴显示：" label-width="120px">
          <el-select v-model="form.axisX_value" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="[1,2].includes(form.axisX_value)" label="日期格式：" label-width="120px">
          <el-select v-model="form.dateFormatValue" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dateFormatOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="录入时数据点：" label-width="120px">
          <el-select v-model="form.dataPointFlag" placeholder="请选择" style="width: 100%;">
            <el-option
              v-for="item in dataPointFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ChartSettingDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    axisXFlag: {
      type: Number,
      default: 0
    },
    dateFormatFlag: {
      type: String,
      default: 'YYYY/MM/DD HH:mm:ss'
    },
    dataPointFlag: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      form: {
        axisX_value: 0,
        dateFormatValue: 'YYYY/MM/DD HH:mm:ss',
        dataPointFlag: '0'
      },
      options: [
        {
          value: 0,
          label: '数据点序号'
        }, {
          value: 1,
          label: '录入时间'
        }, {
          value: 2,
          label: '抽检时间'
        }
      ],
      dateFormatOptions: [
        {
          value: 'YYYY/MM/DD HH:mm:ss',
          label: 'YYYY/MM/DD HH:mm:ss'
        }, {
          value: 'MM/DD',
          label: 'MM/DD'
        }
      ],
      dataPointFlagOptions: [
        {
          value: '1',
          label: '默认值'
        },
        {
          value: '2',
          label: '与上行相同'
        },
        {
          value: '0',
          label: '空白'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'hierarchicalTypes',
      'userId',
      'username'
    ])
  },
  created() {

  },
  methods: {
    clean() {
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$emit('confirm', this.form)
    },
    async add(loading) {

    },
    async update(loading) {

    },
    async open({ load }) {
      this.form.axisX_value = this.axisXFlag
      this.form.dateFormatValue = this.dateFormatFlag
      this.form.dataPointFlag = this.dataPointFlag
    },
    closed() {
      this.clean()
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
