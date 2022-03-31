<template>
  <ki-dialog
    :visible="visible"
    title="导入用户"
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
        <el-form :model="form" inline>
          <el-form-item label="批量设置角色:" style="margin: 0;">
            <el-select v-model="form.roleIds" placeholder="请选择角色" multiple style="width: 300px" @change="role_change">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-table ref="multipleTable" :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
          <el-table-column
            v-if="tableHeader && tableHeader.length !==0 "
            type="selection"
            width="55"
            align="center"
          />
          <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" :min-width="item === '$角色名' ? '150': undefined" />
        </el-table>
      </div>
    </div>
  </ki-dialog>
</template>

<script>

import UploadExcelComponent from '@/components/UploadExcel/index.vue'
export default {
  name: 'ExportUserDialog',
  components: { UploadExcelComponent },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        roleIds: []
      },
      tableData: [],
      tableHeader: [],
      options: []
    }
  },
  methods: {
    get_roleField(field) {
      const reulst = []
      this.form.roleIds.map(id => {
        const f = this.options.find(item => {
          return id === item.id
        })
        if (f) {
          reulst.push(f[field])
        }
      })
      console.log(reulst)
      return reulst.toString()
    },
    role_change(data) {
      const _selectData = this.$refs.multipleTable.selection
      // console.log('_selectData', _selectData)
      if (_selectData && _selectData.length > 0) {
        _selectData.forEach(row => {
          row.roleIds = data.toString()
          row.roleCodes = this.get_roleField('roleCode')
          row.roleName = this.get_roleField('roleName')
          row['$角色名'] = this.get_roleField('roleName')
        })
      }
      console.log('_selectData', _selectData)
      // console.log(this.tableData)
    },
    clear() {
      this.options = []
      this.tableData = []
      this.tableHeader = []
    },
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
      this.tableData = results.map(item => {
        return {
          ...item,
          '$角色名': '',
          'roleCodes': '',
          'roleIds': '',
          'roleName': ''
        }
      })
      header.push('$角色名')
      this.tableHeader = header
    },
    getParams() {
      // const hearderPorp = {
      //   'company': '',
      //   'department': '',
      //   'email': '',
      //   'id': 0,
      //   'mobilePhone': '',
      //   'position': '',
      //   'roleCodes': '',
      //   'roleIds': '',
      //   'roleName': '',
      //   'sex': 0,
      //   'userCode': '',
      //   'userName': '',
      //   'userStatus': 0
      // }

      const p = []

      let errorMsg = ''
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]

        const sex = {
          '男': 1,
          '女': 0
        }
        const userStatus = {
          '是': 1,
          '否': 0
        }

        if (!item['用户账号']) {
          errorMsg = '用户账号不能为空'
          break
        }
        if (!item['用户名']) {
          errorMsg = '用户名不能为空'
          break
        }
        if (!item['roleIds']) {
          errorMsg = '用户没有设置角色'
          break
        }

        const r = {
          userCode: item['用户账号'] || '',
          userName: item['用户名'] || '',
          userStatus: userStatus[item['启用']] || 0,
          company: item['公司'] || '',
          department: item['部门'] || '',
          position: item['职位'] || '',
          email: item['邮箱'] || '',
          mobilePhone: item['电话'] || '',
          sex: sex[item['性别']] || 0,
          loginPassword: item['密码'] || '123456',
          'roleIds': item.roleIds,
          'roleCodes': item.roleCodes,
          'roleName': item.roleName
        }

        p.push(r)
      }

      if (errorMsg) {
        this.$message.warning(errorMsg)
        return false
      }
      return p
    },
    async confirm({ loading }) {
      // const params = []
      const params = this.getParams()
      if (!params) return
      loading(true)
      // console.log('params', params)
      const { code, data } = await this.$api.user_import(params)
      if (code === '200' && data) {
        this.$emit('confirm')
      }
      loading(false)
    },
    async update() {

    },
    async open({ loading }) {
      loading(true)
      const { code, data } = await this.$api.getRoles({ page: '1', limit: '100' })
      if (code === '200' && data) {
        this.options = data.list
      }
      loading(false)
    },
    closed() {
      this.clear()
    },
    getSaveParams() {

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
