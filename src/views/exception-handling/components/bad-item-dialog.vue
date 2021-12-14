<template>
  <ki-dialog
    :visible="visible"
    title="异常处理"
    width="40%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
    @close="close"
    @keypress.native.enter="confirm"
  >
    <div style="padding: 10px 60px;">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="auto"
      >
        <el-row class="desc-list mini-space">
          <el-col :span="12">
            <el-form-item label="检测项目:">
              {{ form.inspectionName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格下限:">
              {{ form.g1lcl }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格上限:">
              {{ form.g1ucl }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制上限:">
              {{ form.g2ucl }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制下限:">
              {{ form.g2lcl }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发生时间:">
              {{ form.happenDate }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前值:">
              {{ form.currentValue }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息:">
              {{ form.abnormalInformation }}
            </el-form-item>
          </el-col>

        </el-row>
        <el-row class="desc-list">
          <el-col :span="24">
            <el-form-item label="失控原因:">
              <el-input ref="ipt" v-model="form.abnormalReason" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理措施:">
              <el-input v-model="form.handleProgramme" type="textarea" :rows="4" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="desc-list">
          <el-col :span="12">
            <el-form-item label="处理人:">
              admin
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理时间:">
              {{ form.happenDate }}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
export default {
  name: 'BadItemDialog',
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
      form: {},
      form_data: {
        inspectionName: '',
        'abnormalInformation': '',
        'abnormalReason': '',
        'abnormalStatus': 0,
        'controlChartSonId': 0,
        'currentValue': 0,
        'exceptionLevel': '',
        'g1cl': 0,
        'g1lcl': 0,
        'g1ucl': 0,
        'g2cl': 0,
        'g2lcl': 0,
        'g2ucl': 0,
        'handleProgramme': '',
        'handleResult': '',
        'handlerId': 0,
        'happenDate': '',
        'id': 0,
        'lsl': 0,
        'processingDate': '',
        'seqNo': 0,
        'sl': 0,
        'usl': 0
      },
      rules: {
        // badCode: [{ required: true, message: '不良代码不能为空', trigger: 'change' }],
        // badName: [{ required: true, message: '不良名称不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.form = JSON.parse(JSON.stringify(this.form_data))
    },
    handleClose() {
      this.$emit('handleClose')
      this.$refs.form.resetFields()
    },
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        this.update(loading)
      })
    },
    // async add() {
    //   const res = await this.$api.badDefinition_save({
    //     badCode: this.form.badCode,
    //     badName: this.form.badName,
    //     badDescription: this.form.badDescription
    //   })
    //   if (res.code === '200') {
    //     this.$emit('confirm')
    //   }
    //   this.handleClose()
    // },
    async update(loading) {
      const res = await this.$api.controlChartAbnorma_update({
        ...this.form,
        abnormalStatus: '1'
      })
      if (res.code === '200') {
        this.$emit('confirm')
      } else {
        loading(false)
      }
      this.handleClose()
    },
    async open({ loading }) {
      // this.flag = this.$attrs.flag

      loading(true)
      const { code, data } = await this.$api.controlChartAbnorma_info({ id: this.selectRow.id })
      if (code === '200' && data) {
        // console.log(data)
        for (const key in data) {
          if (Object.hasOwnProperty.call(data, key)) {
            this.form[key] = data[key] || ''
          }
        }
        this.form.inspectionName = this.selectRow.inspectionName
        // this.form = {
        //   'abnormalCode': '',
        //   'abnormalInformation': '',
        //   'abnormalReason': '',
        //   'abnormalStatus': 0,
        //   'controlChartSonId': 0,
        //   'currentValue': 0,
        //   'exceptionLevel': '',
        //   'g1cl': 0,
        //   'g1lcl': 0,
        //   'g1ucl': 0,
        //   'g2cl': 0,
        //   'g2lcl': 0,
        //   'g2ucl': 0,
        //   'handleProgramme': '',
        //   'handleResult': '',
        //   'handlerId': 0,
        //   'happenDate': '',
        //   'id': 0,
        //   'lsl': 0,
        //   'processingDate': '',
        //   'seqNo': 0,
        //   'sl': 0,
        //   'usl': 0
        // }
      }
      loading(false)

      this.$refs['ipt'].focus()
    },
    async opened({ loading }) {

    },
    close() {
      this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.desc-list {
  ::v-deep label {
    font-weight: normal;
  }
}
.mini-space {
  ::v-deep .el-form-item--mini.el-form-item {
    margin-bottom: 8px;
  }
}
</style>
