<template>
  <ki-dialog
    :visible="visible"
    :title="title"
    width="40%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px; text-align: center;">
      <el-form ref="form" :model="form" label-width="auto" style="width: 60%; margin: 0 auto;">
        <div v-for="item in hierarchicalTypes" :key="item.id" class="keyword-type">
          <el-checkbox v-model="form[`hierarchicalTypeCheckbox${item.serialNumber}`]" :disabled="disabled_select_arr.includes(String(item.serialNumber))" class="keyword-checkbox" />
          <el-form-item :label="item.hierarchicalName">
            <allow-create-select
              v-model="form[`hierarchicalTypeValue${item.serialNumber}`]"
              :disabled="disabled_select_arr.includes(String(item.serialNumber))"
              style="width:100%"
              :props="keywordProps"
              :options="options[`hierarchicalType${item.serialNumber}`]"
              @focus="getHierarchicalType(item.id)"
            />

          </el-form-item>
        </div>
        <!-- hierarchicalTypes -->
        <!-- <el-form-item label="产品型号:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueOne"
            style="width:100%"
            @focus="getHierarchicalType(1)"
          />
        </el-form-item>
        <el-form-item label="产品名称:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueTwo"
            style="width:100%"
            @focus="getHierarchicalType(2)"
          />
        </el-form-item>
        <el-form-item label="产线:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueThree"
            style="width:100%"
            @focus="getHierarchicalType(3)"
          />
        </el-form-item>
        <el-form-item label="班次:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueFour"
            style="width:100%"
            @focus="getHierarchicalType(4)"
          />
        </el-form-item>
        <el-form-item label="设备:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueFive"
            style="width:100%"
            @focus="getHierarchicalType(5)"
          />
        </el-form-item>
        <el-form-item label="供应商:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueSix"
            style="width:100%"
            @focus="getHierarchicalType(6)"
          />
        </el-form-item>
        <el-form-item label="客户:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueSeven"
            style="width:100%"
            @focus="getHierarchicalType(7)"
          />
        </el-form-item>
        <el-form-item label="批次:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueEight"
            style="width:100%"

            @focus="getHierarchicalType(8)"
          />
        </el-form-item>
        <el-form-item label="工商编号:">
          <allow-create-select
            v-model="form.hierarchicalTypeValueNine"
            style="width:100%"

            @focus="getHierarchicalType(9)"
          />
        </el-form-item> -->

      </el-form>
    </div>
  </ki-dialog>
</template>

<script>
import { AllowCreateSelect } from '@/components/form-item'
import { mapGetters } from 'vuex'
export default {
  name: 'SelectKeywordDialog',
  components: {
    AllowCreateSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    keywordFlag: {
      type: String,
      default: ''
    },
    formData: {
      type: [Array, Object],
      default: () => ({})
    },
    disabledSelectArr: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      disabled_select_arr: [],
      form: {},
      form_data: {
        hierarchicalTypeValue1: '',
        hierarchicalTypeValue2: '',
        hierarchicalTypeValue3: '',
        hierarchicalTypeValue4: '',
        hierarchicalTypeValue5: '',
        hierarchicalTypeValue6: '',
        hierarchicalTypeValue7: '',
        hierarchicalTypeValue8: '',
        hierarchicalTypeValue9: '',

        hierarchicalTypeCheckbox1: false,
        hierarchicalTypeCheckbox2: false,
        hierarchicalTypeCheckbox3: false,
        hierarchicalTypeCheckbox4: false,
        hierarchicalTypeCheckbox5: false,
        hierarchicalTypeCheckbox6: false,
        hierarchicalTypeCheckbox7: false,
        hierarchicalTypeCheckbox8: false,
        hierarchicalTypeCheckbox9: false
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
      },
      keywordProps: {
        value: 'keywordName',
        label: 'keywordName'
      }
    }
  },
  computed: {
    title() {
      const title = {
        'level': '控制图层次信息',
        'data': '数据点层次信息'
      }
      return title[this.keywordFlag] || ''
    },
    ...mapGetters(['hierarchicalTypes'])

  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    clear() {
      this.disabled_select_arr = []
      this.form = JSON.parse(JSON.stringify(this.form_data))
    },
    set_checkboxData() {
      const { chartHierarchicalTypeStr, pointHierarchicalTypeStr } = this.formData
      const str1 = this.keywordFlag === 'level' ? (chartHierarchicalTypeStr || '') : (pointHierarchicalTypeStr || '')
      const ruleArr = str1.split(',')
      ruleArr.forEach(item => {
        const arr = item.split('=')
        this.form[`hierarchicalTypeCheckbox${arr[0]}`] = true
        this.form[`hierarchicalTypeValue${arr[0]}`] = arr[2]
      })
      this.disabled_select_arr = this.disabledSelectArr
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
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$emit('confirm', this.get_final_info())
      // this.get_final_info()
      // console.log(this.level())
      // this.$refs.form.validate(valid => {
      //   if (!valid) return
      //   if (this.flag === 'level') {
      //     this.level()
      //   } else {
      //     this.data_point()
      //   }
      // })
    },
    get_final_info() {
      let res1 = ''
      let res2 = ''
      for (let i = 1; i <= 9; i++) {
        if (this.form[`hierarchicalTypeCheckbox${i}`]) {
          if (res1 || res2) {
            res1 += ','
            res2 += ','
          }
          const hierarchicalItem = this.hierarchicalTypes.find(item => {
            return item.serialNumber === i
          })
          // chartHierarchicalType
          const { serialNumber, id, hierarchicalName } = hierarchicalItem
          // console.log(i)
          res1 += `${hierarchicalName}=${this.form[`hierarchicalTypeValue${i}`]}` || ''
          res2 += `${serialNumber}=${id}=${this.form[`hierarchicalTypeValue${i}`]}` || ''
        }
      }
      if (this.keywordFlag === 'level') {
        return {
          chartHierarchicalType: res1,
          chartHierarchicalTypeStr: res2
        }
      } else {
        return {
          pointHierarchicalType: res1,
          pointHierarchicalTypeStr: res2
        }
      }
    },
    async data_point() {

    },
    async open({ load }) {
      console.log('formData', this.formData)
      this.set_checkboxData()
      // this.set_checkboxData()
    },
    closed() {
      // this.controlChartType = 'XBar-R'
      this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
.keyword-type {
  position: relative;
  top: 0;
  left: 0;
  .keyword-checkbox {
    position: absolute;
    top: 50%;
    left: -20px;
    transform: translateY(-50%);
  }
}
.fixed-select {
  ::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #1890ff;
  }
}
.rule-input {
  width: 60px;
}
</style>
