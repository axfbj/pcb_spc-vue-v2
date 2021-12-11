<template>
  <ki-dialog
    :visible="visible"
    title="报表生成向导"
    width="30%"
    :default-footer="false"
    @closed="closed"
    @handleClose="handleClose"
    @open="open"
    @opened="opened"
  >
    <div style="padding: 0px 20px;">
      <el-row style="padding-left: 20px;">
        <span><b>控制图层次信息字段</b></span>
      </el-row>
      <el-row style="padding-left: 40px;">
        <span>请选择控制图层次信息字段，没有被勾选的字段对应的数据将被自动合并</span>
      </el-row>
      <el-row style="padding:10px 0px 10pxpx 20px;">
        <el-col :span="18" style="border: 1px solid #ccc; height: 280px;">
          <el-col :span="12" style="padding: 10px 20px;">
            <el-checkbox-group v-model="checklist">
              <el-checkbox v-for="item in hierarchicalTypes" :key="item.id" :label="item.hierarchicalName" style="display: block;margin-bottom: 10px;">
                {{ item.hierarchicalName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-col>
        <el-col :span="6" style="text-align: center;">
          <ki-button>全选</ki-button>
          <br>
          <br>
          <ki-button>反选</ki-button>
        </el-col>
        <br>
        <el-col :span="24" style="padding-top: 10px;">
          <el-checkbox v-model="cpk_check">
            当CPK小于 <el-input-number v-model="cpk" :controls="false" style="width: 60px;" /> 时高亮显示当前单元格
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
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
export default {
  name: 'ControlGroupFiltering',
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
      checklist: [],
      cpk: 0,
      cpk_check: false
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes'])
  },
  methods: {
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

    }
  }
}
</script>

<style lang="scss" scoped>
</style>
