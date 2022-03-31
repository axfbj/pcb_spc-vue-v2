<template>
  <div>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      拖拽Excel文件 或
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">
        浏览
      </el-button>
    </div>
    <div style="margin-top: 20px">
      <el-radio-group v-model="radio4" @change="c">
        <el-radio-button v-for="(SheetName,index) in SheetNames" :key="`${SheetName}_${index}`" :label="SheetName"> {{ SheetName }}</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import { dateformat } from '@/utils/date-method'
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function,// eslint-disable-line
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      radio4: '',
      workbook: {},
      SheetNames: [],
      loading: false,
      excelData: {
        header: null,
        results: null
      }
    }
  },
  watch: {
    visible(show) {
      if (!show) {
        this.radio4 = ''
        this.workbook = {}
        this.SheetNames = []
        this.loading = false
        this.excelData = {
          header: null,
          results: null
        }
      }
    }
  },
  methods: {
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
      return d
    },
    c(SheetName) {
      // console.log('SheetName', SheetName)
      const worksheet = this.workbook.Sheets[SheetName]
      const header = this.getHeaderRow(worksheet)
      // console.log('worksheet', worksheet)

      for (const key in worksheet) {
        if (Object.hasOwnProperty.call(worksheet, key)) {
          const item = worksheet[key]
          if (item.t === 'n' && isNaN(item.w) && !isNaN(Date.parse(item.w))) {
            item.t = 's'
            item.v = dateformat(this.getFormatDate_XLSX(item.v))
          }
        }
      }

      const results = XLSX.utils.sheet_to_json(worksheet, {
        defval: ''
      })
      this.generateData({ header, results })
      this.$emit('sheet-change', { SheetName })
    },
    generateData({ header, results }) {
      this.excelData.header = header
      this.excelData.results = results

      this.onSuccess && this.onSuccess(this.excelData)
    },
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0] // only use files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      if (!rawFile) return
      this.upload(rawFile)
    },
    upload(rawFile) {
      this.$refs['excel-upload-input'].value = null // fix can't select the same excel

      if (!this.beforeUpload) {
        this.readerData(rawFile)
        return
      }
      const before = this.beforeUpload(rawFile)
      if (before) {
        this.radio4 = ''
        this.readerData(rawFile)
      }
    },
    readerData(rawFile) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          this.SheetNames = workbook.SheetNames
          this.workbook = workbook
          // console.log('workbook', workbook)
          // const firstSheetName = workbook.SheetNames[0]
          // const worksheet = workbook.Sheets[firstSheetName]
          // const header = this.getHeaderRow(worksheet)
          // const results = XLSX.utils.sheet_to_json(worksheet)
          // this.generateData({ header, results })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },
    getHeaderRow(sheet) {
      const headers = []
      if (!Object.hasOwnProperty.call(sheet, '!ref')) {
        return headers
      }
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    }
  }
}
</script>

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
.drop{
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
</style>
