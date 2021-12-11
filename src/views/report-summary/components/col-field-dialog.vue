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
        <span><b>列字段名</b></span>
      </el-row>
      <el-row style="padding-left: 40px;">
        <span>请选择列名字段，被勾选的字段将成为所生成报表中的列 显示出来</span>
      </el-row>
      <el-row style="padding:10px 0px 10pxpx 20px;">
        <el-col :span="18" style="border: 1px solid #ccc; height: 300px;">
          <el-col :span="12" style="padding: 10px 20px;">
            <el-checkbox-group v-model="checklist1">
              <el-checkbox v-for="label in checkbox_data1" :key="label" :label="label" style="display: block;margin-bottom: 10px;" />
            </el-checkbox-group>
          </el-col>

          <el-col :span="12" style="padding: 10px 20px;">
            <el-checkbox-group v-model="checklist2">
              <el-checkbox v-for="label in checkbox_data2" :key="label" :label="label" style="display: block;margin-bottom: 10px;" />
            </el-checkbox-group>
          </el-col>
        </el-col>
        <el-col :span="6" style="text-align: center;">
          <ki-button @click="checkAll">全选</ki-button>
          <br>
          <br>
          <ki-button @click="inverse">反选</ki-button>
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
      checkbox_data1: ['Cpk', 'Cp', 'Cpl', 'CPU', 'Ppk', 'Pp', 'Ppl', 'PPU', 'Ca', '平均值'],
      checkbox_data2: ['标准差(整体)', '标准差(组内)', '最大值', '最小值'],
      checklist1: [],
      checklist2: []
    }
  },
  methods: {
    prev() {
      this.$emit('prev')
    },
    next() {
      this.$emit('next', [...this.checklist1, ...this.checklist2])
    },
    test(scope) {
      console.log(scope)
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        // alert(1)
        // setLoadingState(true)
        // buttonLoaing(setLoadingState(false))
      })
    },
    checkAll() {
      this.checklist1 = []
      this.checklist1 = [...this.checkbox_data1]
      this.checklist2 = []
      this.checklist2 = [...this.checkbox_data2]
    },
    inverse() {
      this.checklist1 = this.checkbox_data1.filter(item => !this.checklist1.includes(item))
      this.checklist2 = this.checkbox_data2.filter(item => !this.checklist2.includes(item))
    },
    async add() {

    },
    async update() {
    },
    async open({ loading }) {
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
