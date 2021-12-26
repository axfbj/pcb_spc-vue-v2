<template>
  <ki-dialog
    :visible="visible"
    title="检验数据导入"
    v-bind="$attrs"
    width="80%"
    top="5vh"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <div class="app-container">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
        <div />
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        </el-table>
      </div>
    </div>
  </ki-dialog>
</template>

<script>

import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { dateformat } from '@/utils/date-method'
export default {
  name: 'ExcelImportDialog',
  components: { UploadExcelComponent },
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
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    getFormatDate_XLSX(serial) {
      const utc_days = Math.floor(serial - 25569)
      const utc_value = utc_days * 86400
      const date_info = new Date(utc_value * 1000)
      const fractional_day = serial - Math.floor(serial) + 0.0000001
      let total_seconds = Math.floor(86400 * fractional_day)
      const seconds = total_seconds % 60
      total_seconds -= seconds
      const hours = Math.floor(total_seconds / (60 * 60))
      const minutes = Math.floor(total_seconds / 60) % 60
      const d = new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds)
      /* //得到Date()对象后，便可进行日期格式化了！
    const add0 = (m) => m < 10 ? '0' + m : m;
    const d = getFormatDate_XLSX(44358.9999884259);
    const YYYY = d.getFullYear();
    const MM = add0(d.getMonth() + 1);
    const DD = add0(d.getDate());
    const hh = add0(d.getHours());
    const mm = add0(d.getMinutes());
    const ss = add0(d.getSeconds());
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
    */
      return d
    },
    handleSuccess({ results, header }) {
      results = results.map(row => {
        return {
          ...row,
          '抽检时间': dateformat(this.getFormatDate_XLSX(row['抽检时间'])),
          '录入时间': dateformat(this.getFormatDate_XLSX(row['录入时间']))
        }
      })
      // console.log('results', results)
      this.tableData = results
      this.tableHeader = header
    },
    async confirm({ loading }) {

    },
    async add() {

    },
    async update() {

    },
    async open({ load }) {
    },
    closed() {
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .drop{
  height: 100px;
  line-height: 100px;
}
</style>
