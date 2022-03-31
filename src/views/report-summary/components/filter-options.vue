<template>
  <ki-dialog
    :visible="visible"
    title="报表生成向导"
    width="40%"
    :default-footer="false"
    @closed="closed"
    @handleClose="handleClose"
    @open="open"
    @opened="opened"
  >
    <el-form ref="form" style="padding: 0px 20px;" :model="form" label-width="auto">
      <el-row style="padding-left: 20px;">
        <span><b>过滤选项</b></span>
      </el-row>
      <el-row style="padding-left: 40px;">
        <span>通过设置的相应过滤条件，可以使生产后报表中的内容更易查看</span>
      </el-row>
      <!-- <el-row>
        <el-checkbox v-model="filter_control">使用过滤选项</el-checkbox>
      </el-row> -->
      <!-- <el-row>
        <el-form :model="form" :inline="true" :disabled="!filter_control">
          <el-form-item style="margin: 5px;" label-width="0">
            <el-select v-model="form.dataType" placeholder="请选择" style="width: 100px;">
              <el-option
                v-for="item in dataType_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          &nbsp;
          &nbsp;
          <el-form-item v-if="form.dataType !== '0'" label="时间范围" style="margin: 5px;">
            <el-date-picker
              v-model="form.date"
              :disabled="form.dataType === '0'"
              type="datetimerange"
              range-separator="到"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
        </el-form>
      </el-row> -->
      <el-row style="padding:10px 0px 10px 20px;border: 1px solid #ccc; margin-top: 5px;" :gutter="20">
        <el-col v-for="item in hierarchicalTypes" :key="item.id" :span="12">
          <el-form-item :label="item.hierarchicalName">
            <!-- :disabled="disabled_select_arr.includes(String(item.serialNumber))" -->
            <allow-create-select
              v-model="form[`hierarchicalTypeValue${parseNum[item.serialNumber]}`]"
              :disabled="!filter_control"
              style="width:100%"
              :props="keywordProps"
              :options="options[`hierarchicalType${item.serialNumber}`]"
              @focus="getHierarchicalType(item.id)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer_custum>
      <ki-button style="float: left;" @click="handleClose">取 消</ki-button>
      <ki-button type="warning" @click="prev">上一步</ki-button>
      <!-- <ki-button type="warning" @click="next">下一步</ki-button> -->
      <ki-button
        style="margin-left: 60px;"
        type="primary"
        @click="confirm"
      >生 成</ki-button>
    </template>
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { AllowCreateSelect } from '@/components/form-item'
export default {
  name: 'ControlGroupFiltering',
  components: {
    AllowCreateSelect
  },
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
      dataType_options: [
        {
          value: '0',
          label: '全部数据'
        },
        {
          value: '1',
          label: '录入时间'
        }, {
          value: '2',
          label: '抽检时间'
        }
      ],
      filter_control: true,
      form: {},
      dataType: '0',
      date: [],
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
      form_data: {
        hierarchicalTypeValueOne: '',
        hierarchicalTypeValueTwo: '',
        hierarchicalTypeValueThree: '',
        hierarchicalTypeValueFour: '',
        hierarchicalTypeValueFive: '',
        hierarchicalTypeValueSix: '',
        hierarchicalTypeValueSeven: '',
        hierarchicalTypeValueEight: '',
        hierarchicalTypeValueNine: ''

        // hierarchicalTypeCheckbox1: false,
        // hierarchicalTypeCheckbox2: false,
        // hierarchicalTypeCheckbox3: false,
        // hierarchicalTypeCheckbox4: false,
        // hierarchicalTypeCheckbox5: false,
        // hierarchicalTypeCheckbox6: false,
        // hierarchicalTypeCheckbox7: false,
        // hierarchicalTypeCheckbox8: false,
        // hierarchicalTypeCheckbox9: false
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
    prev() {
      this.$emit('prev')
    },
    next() {},
    test(scope) {
      console.log(scope)
    },
    handleClose() {
      this.$emit('handleClose')
      this.$refs.form.resetFields()
    },
    confirm() {
      // this.$refs.form.validate(valid => {
      //   if (!valid) return
      // this.$emit('confirm', { form: this.this.form, flag: 'chartcode_dialog' })
      this.$emit('confirm', { filteOptions_data: this.form, flag: 'chartcode_dialog' })
      // setLoadingState(true)
      // buttonLoaing(setLoadingState(false))
      // })
    },
    async add() {

    },
    async update() {
    },
    async open({ loading }) {
      // console.log(this.hierarchicalTypes)
    },
    async opened({ loading }) {
    },
    closed() {
      this.clear()
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
