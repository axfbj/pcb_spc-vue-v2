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
    <el-form style="padding: 0px 20px;" :model="form" label-width="auto">
      <el-row style="padding-left: 20px;">
        <span><b>过滤选项</b></span>
      </el-row>
      <el-row style="padding-left: 40px;">
        <span>通过设置的相应过滤条件，可以使生产后报表中的内容更易查看</span>
      </el-row>
      <el-row style="padding:10px 0px 10px 20px;border: 1px solid #ccc; margin-top: 10px;" :gutter="20">
        <!-- <el-col :span="24" style="border: 1px solid #ccc; height: 280px; padding-top: 20px;"> -->
        <el-col v-for="item in hierarchicalTypes" :key="item.id" :span="12">
          <el-form-item :label="item.hierarchicalName">
            <!-- :disabled="disabled_select_arr.includes(String(item.serialNumber))" -->
            <allow-create-select
              v-model="form[`hierarchicalTypeValue${item.serialNumber}`]"
              style="width:100%"
              :props="keywordProps"
              :options="options[`hierarchicalType${item.serialNumber}`]"
              @focus="getHierarchicalType(item.id)"
            />

          </el-form-item>
        </el-col>
        <!-- </el-col> -->
      </el-row>
    </el-form>
    <template v-slot:footer_custum>
      <ki-button style="float: left;" @click="handleClose">取 消</ki-button>
      <ki-button type="warning" @click="prev">上一步</ki-button>
      <ki-button type="warning" @click="next">下一步</ki-button>
      <ki-button
        style="margin-left: 60px;"
        type="primary"
        @click="confirm"
      >确 定</ki-button>
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
    prev() {},
    next() {},
    test(scope) {
      console.log(scope)
    },
    handleClose() {
      this.$emit('handleClose')
      this.$refs.form.resetFields()
    },
    async confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        // alert(1)
        // setLoadingState(true)
        // buttonLoaing(setLoadingState(false))
      })
    },
    async add() {

    },
    async update() {
    },
    async open({ loading }) {
      console.log(this.hierarchicalTypes)
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
