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
        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
        </el-table>
      </div>
    </div>
  </ki-dialog>
</template>

<script>

import UploadExcelComponent from '@/components/UploadExcel/index.vue'
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
    handleSuccess({ results, header }) {
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
      // const { code, data } = await this.$api.badDefinition_list({
      //   page: '1',
      //   limit: '300'
      // })
      // if (code === '200' && data) {
      //   this.data = data.list
      // }
    },
    closed() {
      // this.level = '0'
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
