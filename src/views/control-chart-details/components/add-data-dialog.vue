<template>
  <ki-dialog
    :visible="visible"
    title="数据"
    v-bind="$attrs"
    width="40%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-form ref="form" :model="form" label-width="auto">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="抽检时间:">
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
            <el-form-item label="录入时间:">
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
                  style="width:100%"
                  :props="keywordProps"
                  :options="options[`hierarchicalType${item.serialNumber}`]"
                  @focus="getHierarchicalType(item.id)"
                />
              </el-form-item>
            </el-col>
          </template>

          <el-col v-for="item in size" :key="item.val" :span="12">
            <el-form-item :label="`${item.label}:`">
              <el-input-number v-model="form[item.val]" :controls="false" @change="handleChange" />
              <!-- <el-input v-model="form[item.val]" /> -->
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
    controlChartType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      size: [],
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
        'XBar-R': 1,
        'Xbar-s': 2,
        'X-MR': 3,
        'p': 4,
        'np': 5
      },

      form_data: {
        // inspectionSerial: '',
        createData: '',
        inspectionData: '',
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
    ...mapGetters(['hierarchicalTypes'])
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.size = []
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
      // alert(this.parseChartType[this.controlChartType])
      const form = {}
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          form[key] = this.form[key] !== null ? this.form[key] : ''
        }
      }
      form.createUser = 1
      const p = {
        controlChartSonId: this.controlChartSonId,
        controlChartType: this.parseChartType[this.controlChartType],
        'inspectionRecordList': [
          {
            badDefinitionMap: {},
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
            ...form
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

    async confirm({ loading }) {
      loading(true)
      if (this.flag === 'add') {
        this.add(loading)
      } else if (this.flag === 'edit') {
        this.update(loading)
      }
      // this.$emit('confirm')
    },
    async add(loading) {
      const param = this.getSaveParams()
      const { code, data } = await this.$api.inspectionRecord_save(param)
      if (code === '200' && data) {
        this.$emit('confirm')
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
        this.$emit('confirm')
      } else {
        loading(false)
      }
    },
    async open({ load }) {
      this.flag = this.$attrs.flag
      this.size = []
      for (let i = 1; i <= this.sampleSize; i++) {
        this.$set(this.form, `value${i}`, undefined)
        const o = {
          val: `value${i}`,
          label: `样本${i}`
        }
        this.size.push(o)
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
