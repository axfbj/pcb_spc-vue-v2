<template>
  <ki-dialog
    :visible="visible"
    title="异常处理"
    width="40%"
    :button-text="['处 理','取 消']"
    :default-footer="flag !== 'details'"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @opened="opened"
    @close="close"
  >
    <div style="padding: 10px 60px;">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row v-show="show_details" class="desc-list mini-space">
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
            <!-- <el-form-item label="当前值:">
              {{ form.currentValue }}
            </el-form-item> -->
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="异常信息:">
              {{ form.abnormalInformation }}
            </el-form-item>
          </el-col> -->

        </el-row>
        <el-row class="desc-list">
          <el-col :span="24">
            <el-form-item label="失控原因:" prop="abnormalReason">
              <el-input ref="ipt" v-model.trim="form.abnormalReason" type="textarea" :rows="4" :readonly="flag === 'details'" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="处理措施:" prop="handleProgramme">
              <el-input v-model.trim="form.handleProgramme" type="textarea" :rows="4" :readonly="flag === 'details'" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="show_details" class="desc-list">
          <el-col :span="12">
            <el-form-item label="处理人:">
              {{ form.handler }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="处理时间:">
              {{ form.processingDate }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-show="show_details" class="desc-list">
          <el-col :span="12">
            <el-form-item label="审核人:">
              {{ form.auditor }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核时间:">
              {{ form.auditDate }}
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  name: 'ExceptionHandlingDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    },
    sendRow: {
      type: [Object, Array],
      default: () => ({})
    }
  },

  data() {
    return {
      flag: '',
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
        'usl': 0,
        'auditor': ''
      },
      rules: {
        'abnormalReason': [
          { required: true, message: '请输入失控原因', trigger: 'change' }
        ],
        'handleProgramme': [
          { required: true, message: '请输入处理措施', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    show_details() {
      return this.selectRow.length === 1 || this.flag === 'details'
    }
    // ...mapGetters(['name'])
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.flag = ''
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.$refs.form.resetFields()
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        this.update(loading)
      })
    },
    async update(loading) {
      const p = {
        ids: [],
        abnormalReason: this.form.abnormalReason,
        handleProgramme: this.form.handleProgramme
      }
      this.selectRow.forEach(row => {
        p.ids.push(...row.abnormalIdList)
      })
      const res = await this.$api.abnormalHandleByInspectionRecordId(p)
      if (res.code === '200') {
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async getDetils() {
      const row = this.flag === 'details' ? this.sendRow : this.selectRow[0]
      const { code, data } = await this.$api.abnormalByInspectionRecordId({ inspectionRecordId: row.inspectionRecordId })
      if (code === '200' && data) {
        for (const key in data[0]) {
          if (Object.hasOwnProperty.call(data[0], key)) {
            this.form[key] = data[0][key] || ''
          }
        }
        this.form.inspectionName = row.inspectionName
      }
    },
    async open({ loading }) {
      this.flag = this.$attrs.flag
      if (this.selectRow.length === 1 || this.flag === 'details') {
        loading(true)
        await this.getDetils()
        loading(false)
      }
      if (this.flag !== 'details') {
        this.$refs['ipt'].focus()
      }
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
