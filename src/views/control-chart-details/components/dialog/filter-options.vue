<template>
  <ki-dialog
    :visible="visible"
    title="过滤"
    width="40%"
    :default-footer="false"
    @closed="closed"
    @handleClose="handleClose"
    @open="open"
  >
    <el-form v-if="hierarchicalTypes.length !== 0" ref="form" style="padding: 0px 20px;" :model="form" label-width="auto">
      <el-row style="padding-left: 20px;">
        <span style="color: #409EFF;">数据点层次信息过滤选项</span>
        <span style="color: #F56C6C; padding-left: 60px;">注意: 当"值"为空时表示忽略该条件</span>
      </el-row>
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
    <el-row v-else style="height: 100px; text-align: center;">
      <span style="color: #F56C6C;font-size: 18px;">该控制图没有数据点层次信息</span>
    </el-row>
    <template v-slot:footer_custum>
      <div v-if="hierarchicalTypes.length !== 0" class="clearfix">
        <div style="float: left;">
          <ki-button @click="clean">清空所有条件</ki-button>
        </div>
        <div style="float: right;">
          <ki-button type="primary" @click="confirm">确 定</ki-button>
          <ki-button @click="cancel_btn">取 消</ki-button>
        </div>
      </div>
    </template>
  </ki-dialog>
</template>

<script>
import { AllowCreateSelect } from '@/components/form-item'
export default {
  name: 'FilterOptions',
  components: {
    AllowCreateSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    hierarchicalTypes: {
      type: Array,
      default: () => ([])
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
  // computed: {
  //   ...mapGetters(['hierarchicalTypes'])
  // },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    cancel_btn() {
      this.$emit('handleClose')
    },
    clean() {
      this.form = JSON.parse(JSON.stringify(this.form_data))
    },
    handleClose() {
      this.$emit('handleClose')
      this.$refs.form.resetFields()
    },
    confirm() {
      this.$emit('confirm', this.form)
    },
    open({ loading }) {
      console.log(this.hierarchicalTypes)
    },
    closed() {
      this.clean()
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
