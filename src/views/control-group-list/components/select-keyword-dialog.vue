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
          <el-checkbox v-model="form[`hierarchicalTypeCheckbox${item.serialNumber}`]" class="keyword-checkbox" />
          <el-form-item :label="item.hierarchicalName">
            <allow-create-select
              v-model="form[`hierarchicalTypeValue${item.serialNumber}`]"
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
    }
  },
  data() {
    return {
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
        value: 'id',
        label: 'keywordName'
      }
      // form: {
      //   hierarchicalTypeValueOne: '',
      //   hierarchicalTypeValueTwo: '',
      //   hierarchicalTypeValueThree: '',
      //   hierarchicalTypeValueFour: '',
      //   hierarchicalTypeValueFive: '',
      //   hierarchicalTypeValueSix: '',
      //   hierarchicalTypeValueSeven: '',
      //   hierarchicalTypeValueEight: '',
      //   hierarchicalTypeValueNine: ''
      // }
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
      this.form = JSON.parse(JSON.stringify(this.form_data))
    },
    set_checkboxData() {
      const { chartHierarchicalTypeStr, pointHierarchicalTypeStr } = this.selectRow
      const str1 = this.keywordFlag === 'level' ? chartHierarchicalTypeStr : pointHierarchicalTypeStr
      const ruleArr1 = str1.split(',')
      ruleArr1.forEach(item => {
        const ruleNum = item.split('=')[0]
        this.form[`hierarchicalTypeCheckbox${ruleNum}`] = true
      })
      const str2 = this.keywordFlag === 'level' ? pointHierarchicalTypeStr : chartHierarchicalTypeStr
      const ruleArr2 = str2.split(',')
      ruleArr2.forEach(item => {
        const ruleNum = item.split('=')[0]
        this.form[`hierarchicalTypeCheckbox${ruleNum}`] = false
      })
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
      this.$refs.form.validate(valid => {
        if (!valid) return
        loading(true)
        if (this.flag === 'add') {
          this.add()
        } else {
          this.update()
        }
      })
    },
    async add() {
      // console.log('node', this.nodeData)
      // const { code, data } = await this.$api.controlGroup_save({
      //   parentId: this.level === '0' ? this.nodeData.id : this.nodeData.parentId,
      //   ...this.form
      // })
      // if (code === '200' && data) {
      //   this.$emit('confirm')
      // }
      // this.handleClose()
    },
    async update() {
      // const { code, data } = await this.$api.controlGroup_update({
      //   id: this.nodeKey,
      //   ...this.form
      // })
      // if (code === '200' && data) {
      //   this.$emit('confirm')
      // }
      // this.handleClose()
    },
    async open({ load }) {
      this.set_checkboxData()

      // this.flag = this.$attrs.flag
      // if (this.flag !== 'add') {
      //   const { code, data } = await load(() => this.$api.controlGroup_info({ id: this.nodeKey }))
      //   if (code === '200' && data) {
      //     const { groupName, erpCode, groupDescription } = data
      //     this.form = {
      //       groupName,
      //       erpCode,
      //       groupDescription
      //     }
      //   }
      // }
      // this.$refs.ipt.focus()
    },
    closed() {
      this.clear()
      // this.level = '0'
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
