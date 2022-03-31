import { saveAs } from 'file-saver'
import { dateformat } from '@/utils/date-method'
export default {
  data() {
    return {}
  },
  methods: {
    download_excel(data, filename = '') {
      const blob = new Blob([data])
      saveAs(blob, `${filename}（${dateformat(new Date())}）.xls`)
    },
    async export_user_btn(loading) {
      if (!this.select_row || this.select_row.length === 0) {
        this.$message.warning('导出前请选择用户')
        return
      }
      loading(true)
      const params = {
        excelName: `用户列表（${dateformat(new Date())}）.xls`,
        userIds: this.select_row.map(user => user.id)
      }
      const data = await this.$api.user_export(params)
      if (data) {
        this.download_excel(data, '用户列表')
      }
      loading(false)
    }
  }
}

