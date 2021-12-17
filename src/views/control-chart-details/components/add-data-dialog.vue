<template>
  <ki-dialog
    :visible="visible"
    title="检验数据"
    v-bind="$attrs"
    width="35%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form" label-width="auto" :rules="rules">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="抽检时间:" prop="inspectionData">
              <el-date-picker
                v-model="form.inspectionData"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 100%;"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入时间:" prop="createData">
              <el-date-picker
                v-model="form.createData"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>

          <template v-for="item in hierarchicalTypes">
            <el-col v-if="pointHierarchicalTypeIds.includes(item.id)" :key="item.id" :span="12">
              <el-form-item :label="`${item.hierarchicalName}:`">
                <allow-create-select
                  v-model="form[`hierarchicalTypeValue${parseNum[item.serialNumber]}`]"
                  style="width:100%;height: 28px;"
                  :props="keywordProps"
                  :options="options[`hierarchicalType${item.serialNumber}`]"
                  @focus="getHierarchicalType(item.id)"
                />
              </el-form-item>
            </el-col>
          </template>

          <el-col v-for="item in size" :key="item.val" :span="12">
            <el-form-item :label="`${item.label}:`" :prop="item.val">
              <el-input-number v-model="form[item.val]" :controls="false" style="width: 100%;" />
              <!-- <el-input v-model="form[item.val]" /> -->
            </el-form-item>
          </el-col>

          <el-col v-if="['p','np'].includes(controlChartType)" :span="12">
            <el-form-item label="抽检数" prop="value1">
              <el-input-number v-model="form.value1" :disabled="controlChartType === 'np'" :controls="false" style="width: 100%;" />
              <!-- <el-input v-model="form[item.val]" /> -->
            </el-form-item>
          </el-col>

          <el-col v-for="(item,index) in badNames_data" :key="item.id" :span="12">
            <el-form-item :label="`${item.badName}:`" :prop="`badValue${index + 1}`">
              <el-input-number v-model="form[`badValue${index + 1}`]" :controls="false" style="width: 100%;" />
              <!-- <el-input v-model="form[item.val]" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="录入用户:">
              admin
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { AllowCreateSelect } from '@/components/form-item'
export default {
  name: 'DiscriminationRulesDialog',
  components: {
    AllowCreateSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    controlChartSonId: {
      type: String,
      default: ''
    },
    pointHierarchicalTypeIds: {
      type: Array,
      default: () => ([])
    },
    sampleSize: {
      type: Number,
      default: 0
    },
    selectRow: {
      type: [Array, Object],
      default: () => ({})
    },
    inspectionRecordsData: {
      type: [Array, Object],
      default: () => ({})
    },
    badNames: {
      type: [Array, Object],
      default: () => ({})
    },
    controlChartType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      size: [],
      badTemp: {},
      badNames_data: [],
      // controlChartType: '',
      form: {},
      parseNum: {
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine'
      },
      parseChartType: {
        'Xbar-R': 1,
        'Xbar-s': 2,
        'X-MR': 3,
        'p': 4,
        'np': 5
      },
      rules_data: {
        inspectionData: { required: true, message: '请填写检验时间', trigger: 'change' },
        createData: { required: true, message: '请填写录入时间', trigger: 'change' }
      },
      rules: {},

      form_data: {
        remark: '',
        // inspectionSerial: '',
        createData: '',
        inspectionData: '',
        // numberOfGroups: '', // 序号
        hierarchicalTypeValueOne: '',
        hierarchicalTypeValueTwo: '',
        hierarchicalTypeValueThree: '',
        hierarchicalTypeValueFour: '',
        hierarchicalTypeValueFive: '',
        hierarchicalTypeValueSix: '',
        hierarchicalTypeValueSeven: '',
        hierarchicalTypeValueEight: '',
        hierarchicalTypeValueNine: ''
      },
      keywordProps: {
        value: 'keywordName',
        label: 'keywordName'
      },
      options: {
        hierarchicalType1: [],
        hierarchicalType2: [],
        hierarchicalType3: [],
        hierarchicalType4: [],
        hierarchicalType5: [],
        hierarchicalType6: [],
        hierarchicalType7: [],
        hierarchicalType8: [],
        hierarchicalType9: []
      }
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes']),
    getChartNum() {
      return this.parseChartType[this.controlChartType] || ''
    }
  },
  created() {
    Object.freeze(this.form_data)
    // Object.freeze(this.rules_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
    // this.rules = JSON.parse(JSON.stringify(this.rules_data))
  },
  methods: {
    clear() {
      this.form = JSON.parse(JSON.stringify(this.form_data))
      // this.rules = JSON.parse(JSON.stringify(this.rules_data))
      this.size = []
      this.badNames_data = []
    },
    async getHierarchicalType(id) {
      const { code, data } = await this.$api.keywordValue_list({
        page: '1',
        limit: '20',
        hierarchicalTypeId: id,
        order: 'asc'
      })
      if (code === '200' && data) {
        this.options[`hierarchicalType${id}`] = data.list
      }
    },
    getSaveParams() {
      const form = {}
      const h_type = {
        'hierarchicalTypeValueEight': '',
        'hierarchicalTypeValueFive': '',
        'hierarchicalTypeValueFour': '',
        'hierarchicalTypeValueNine': '',
        'hierarchicalTypeValueOne': '',
        'hierarchicalTypeValueSeven': '',
        'hierarchicalTypeValueSix': '',
        'hierarchicalTypeValueThree': '',
        'hierarchicalTypeValueTwo': ''
      }

      for (const key in this.form) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          form[key] = this.form[key] !== null ? this.form[key] : ''
        }
      }

      if (!['p', 'np'].includes(this.controlChartType)) {
        delete form.badDefinitionMap
      }

      if (['p', 'np'].includes(this.controlChartType)) {
        // form.badDefinitionMap = {}
        form.objectList = []
        console.log(this.badNames_data)
        this.badNames_data.forEach((item, index) => {
          form.objectList[index] = {
            id: item.id,
            value: form[`badValue${index + 1}`]
          }
        })
      } else {
        delete form.objectList
      }

      this.pointHierarchicalTypeIds.forEach(id => {
        const hierarchicalItem = this.hierarchicalTypes.find(item => item.id === id)
        if (hierarchicalItem) {
          const k = `hierarchicalTypeValue${this.parseNum[hierarchicalItem.serialNumber]}`
          h_type[k] = `${hierarchicalItem.id}=${form[k]}`
        }
        // console.log(hierarchicalItem)
      })

      form.createUser = 1
      // if (this.flag === 'add') {
      //   const { inspectionRecords } = this.inspectionRecords_data
      //   if (inspectionRecords[0].controlChartSonId === null) {
      //     form.numberOfGroups = 1
      //   }
      // }
      // else {
      //   orm.numberOfGroups = i
      // }
      const p = {
        controlChartSonId: this.controlChartSonId,
        controlChartType: this.getChartNum,
        'inspectionRecordList': [
          {
            // badDefinitionMap: {},
            // 'controlChartHierarchicalTypeId': 0,
            controlChartSonId: this.controlChartSonId,
            // createData: '',
            // inspectionData: this.form,
            'createUser': 1,
            'hierarchicalTypeValueEight': '',
            'hierarchicalTypeValueFive': '',
            'hierarchicalTypeValueFour': '',
            'hierarchicalTypeValueNine': '',
            'hierarchicalTypeValueOne': '',
            'hierarchicalTypeValueSeven': '',
            'hierarchicalTypeValueSix': '',
            'hierarchicalTypeValueThree': '',
            'hierarchicalTypeValueTwo': '',
            // 'id': 0,
            // 'inspectionSerial': this.inspectionRecordsData.inspectionRecords.length + 1,
            // 'inspectionStatus': 0,
            // 'numberOfGroups': 0,
            ...form,
            ...h_type
            // numberOfGroups:
            // 'remark': '',
            // 'value1': 0,
            // 'value10': 0,
            // 'value11': 0,
            // 'value12': 0,
            // 'value13': 0,
            // 'value14': 0,
            // 'value15': 0,
            // 'value16': 0,
            // 'value17': 0,
            // 'value18': 0,
            // 'value19': 0,
            // 'value2': 0,
            // 'value20': 0,
            // 'value21': 0,
            // 'value22': 0,
            // 'value23': 0,
            // 'value24': 0,
            // 'value25': 0,
            // 'value3': 0,
            // 'value4': 0,
            // 'value5': 0,
            // 'value6': 0,
            // 'value7': 0,
            // 'value8': 0,
            // 'value9': 0,
            // 'x': ''
          }
        ]
      }

      // console.log(p)
      return p
    },
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    validate_form() {
      // console.log(this.form)
      // for (const key in this.form) {
      //   if (Object.hasOwnProperty.call(this.form, key)) {
      //     if (!key.includes('hierarchicalTypeValue')) {
      //       if (this.form[key] === undefined || this.form[key] === null || this.form[key] === '') {
      //         return false
      //       }
      //     }
      //   }
      // }
      return true
    },
    async confirm({ loading }) {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        loading(true)
        if (this.flag === 'add') {
          this.add(loading)
        } else if (this.flag === 'edit') {
          this.update(loading)
        }
      })
      // if (!this.validate_form()) {
      //   this.$message.warning('请填写表单中的数据！！')
      //   return
      // }

      // this.$emit('confirm')
    },
    async add(loading) {
      const param = this.getSaveParams()
      // param.
      const { code, data } = await this.$api.inspectionRecord_save(param)
      if (code === '200' && data) {
        this.$emit('confirm', data)
      } else {
        loading(false)
      }
    },
    async update(loading) {
      // const param = {}
      // for (const key in this.form) {
      //   if (Object.hasOwnProperty.call(this.form, key)) {
      //     param[key] = this.form[key] !== null ? this.form[key] : ''
      //   }
      // }
      // console.log(param)
      const param = this.getSaveParams()
      // param.createUser = 1
      const { code, data } = await this.$api.inspectionRecord_update(param)
      if (code === '200' && data) {
        this.$emit('confirm', data)
      } else {
        loading(false)
      }
    },
    async open({ load }) {
      this.flag = this.$attrs.flag
      if (['p', 'np'].includes(this.controlChartType)) {
        if (this.controlChartType === 'np') {
          // this.rules[`value1`] = { required: true, message: `请填写抽检数`, trigger: 'change' }
          this.$set(this.form, 'value1', this.sampleSize)
        } else {
          // this.rules[`value1`] = { required: true, message: `请填写抽检数`, trigger: 'change' }
          this.$set(this.form, 'value1', undefined)
        }

        this.badNames.badDefinitionTitles.forEach((item, index) => {
          // this.rules[`badValue${index + 1}`] = { required: true, message: `请填写${item}`, trigger: 'change' }
          this.$set(this.form, `badValue${index + 1}`, undefined)
          const o = {}
          o.id = this.badNames.badDefinitionIds[index]
          o.badName = item
          this.badNames_data.push(o)
        })
      } else {
        this.size = []
        for (let i = 1; i <= this.sampleSize; i++) {
          this.$set(this.form, `value${i}`, undefined)
          const o = {
            val: `value${i}`,
            label: `样本${i}`
          }
          this.size.push(o)
          // this.rules[o.val] = { required: true, message: `请填写${o.label}`, trigger: 'change' }
        }
        if (this.flag === 'add') return
      }
      if (this.flag === 'add') return
      this.form = {
        ...this.selectRow
      }
    },
    closed() {
      this.clear()
      this.flag = ''
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
