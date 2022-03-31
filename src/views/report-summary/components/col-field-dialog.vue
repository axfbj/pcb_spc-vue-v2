<template>
  <ki-dialog
    :visible="visible"
    title="报表生成向导"
    width="35%"
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
        <el-col :span="18" style="border: 1px solid #ccc; height: 334px;">
          <el-col :span="12" style="padding: 10px 20px;">
            <el-checkbox-group v-model="checklist1">
              <el-checkbox v-for="item in checkbox_data1" :key="item.key" :label="item.key" style="display: block;margin-bottom: 8px;">
                {{ item.label }}
              </el-checkbox>>
            </el-checkbox-group>
          </el-col>

          <el-col :span="12" style="padding: 10px 20px;">
            <el-checkbox-group v-model="checklist2">
              <el-checkbox v-for="item in checkbox_data2" :key="item.key" :label="item.key" style="display: block;margin-bottom: 8px;">
                {{ item.label }}
              </el-checkbox>>
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
      <!-- <ki-button
        style="margin-left: 60px;"
        type="primary"
        @click="confirm"
      >确 定</ki-button> -->
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
      checkbox_data1: [
        { key: 'cpk', label: 'Cpk' },
        { key: 'cp', label: 'Cp' },
        { key: 'cpl', label: 'Cpl' },
        { key: 'cpu', label: 'CPU' },
        { key: 'ppk', label: 'Ppk' },
        { key: 'pp', label: 'Pp' },
        { key: 'ppl', label: 'Ppl' },
        { key: 'ppu', label: 'Ppu' },
        { key: 'ca', label: 'Ca' },
        { key: 'average', label: '平均值' },
        { key: 'r', label: '极差值' }
        // { key: 'allSD', label: '标准差(整体)' }
      ],
      checkbox_data2: [
        // { key: 'groupSD', label: '标准差(组内)' },
        { key: 'max', label: '最大值' },
        { key: 'min', label: '最小值' },
        { key: 'records', label: '记录数' }
      ],
      // checkbox_data1: ['Cpk', 'Cp', 'Cpl', 'CPU', 'Ppk', 'Pp', 'Ppl', 'PPU', 'Ca', '平均值'],
      // checkbox_data2: ['标准差(整体)', '标准差(组内)', '最大值', '最小值'],
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
    // async confirm() {
    //   this.$refs.form.validate(valid => {
    //     if (!valid) return
    //   })
    // },
    checkAll() {
      this.checklist1 = []
      this.checklist1 = [...this.checkbox_data1.map(item => item.key)]
      this.checklist2 = []
      this.checklist2 = [...this.checkbox_data2.map(item => item.key)]
    },
    inverse() {
      this.checklist1 = this.checkbox_data1.map(item => {
        if (!this.checklist1.includes(item.key)) { return item.key }
      })
      this.checklist2 = this.checkbox_data2.map(item => {
        if (!this.checklist2.includes(item.key)) { return item.key }
      })
    },
    async add() {

    },
    async update() {
    },
    async open({ loading }) {
    },
    async opened({ loading }) {
    },
    clear() {
      this.checklist1 = []
      this.checklist2 = []
    },
    closed() {
      this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
