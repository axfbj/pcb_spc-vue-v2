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
        <span><b>控制图</b></span>
      </el-row>
      <el-row style="padding-left: 40px;">
        <span>请选择控制图要导出的控制图</span>
      </el-row>
      <el-row style="padding:10px 0px 10pxpx 20px;">
        <el-col :span="18" style="border: 1px solid #ccc; height: 300px;">
          <el-col :span="12" style="padding: 10px 20px; width: 100%; height: 100%; overflow: auto;">
            <el-checkbox-group v-model="checklist">
              <el-checkbox v-for="(item,index) in chartCodes" :key="index" :label="item.controlChartCode" style="display: block;margin-bottom: 8px;">
                {{ item.controlChartCode }}( {{ item.inspectionName }}  )
              </el-checkbox>
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
      <ki-button type="parimary" @click="confirm">生 成</ki-button>
    </template>
  </ki-dialog>
</template>

<script>
export default {
  name: 'ControlChartCodeFilter',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    },
    chartCodes: {
      type: [Object, Array],
      default: () => ({})
    }
  },
  data() {
    return {
      checklist: []
    }
  },
  methods: {
    checkAll() {
      this.checklist = [...this.chartCodes.map(i => i.controlChartCode)]
    },
    inverse() {
      const c = this.chartCodes.filter(item => !this.checklist.includes(item.controlChartCode))
      this.checklist = c.map(i => i.controlChartCode)
    },
    prev() {
      this.$emit('prev')
    },
    next() {
      this.$emit('next')
    },
    test(scope) {
      console.log(scope)
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm() {
      if (this.checklist.length === 0) {
        this.$message.warning('请至少选择一个控制图')
        return
      }
      this.$emit('confirm', this.checklist)
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
    clear() {
      this.cpkHighligh = false
      this.cpkHighlightValue = 0
      this.checklist = []
    },
    closed() {
      this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
