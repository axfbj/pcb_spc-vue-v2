<template>
  <el-row>
    <el-col :span="24">
      <container-layout>
        <template v-slot:btns>
          <el-row>
            <!-- <span style="font-size: 14px; color: #008040;">控制组路径: {{ path }}</span> -->
            <span style="float: right;">
              <!-- user.excel.import -->
              <ki-button v-permission="['user.update']" type="primary" @click="menu_setting_dialog_btn('add')">新建</ki-button>
              <ki-button v-permission="['user.excel.import']" type="primary" @click="import_user_btn">导入用户</ki-button>
              <ki-button v-permission="['user.excel.export']" type="primary" @click="export_user_btn">导出用户</ki-button>
              <ki-message-box
                v-permission="['user.delete']"
                :next="del"
                @click="del_btn"
              >
                <ki-button
                  type="danger"
                  style="margin-left: 10px;"
                >删除</ki-button>
              </ki-message-box>
            </span>
          </el-row>

        </template>
        <!-- 表格 -->
        <template v-slot:form>
          <el-form-item
            label="用户账号"
            prop="userCode"
          >
            <el-input
              v-model="form.userCode"
              style="width: 160px"
              clearable
            />
          </el-form-item>
          <el-form-item
            label="用户名"
            prop="userName"
          >
            <el-input
              v-model="form.userName"
              style="width: 160px"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="query"
            >查询</el-button>
          </el-form-item>
        </template>
        <template v-slot:custum_content>
          <dynamic-table
            ref="dy_table"
            v-model="select_row"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[30,60,120]"
            fixed-height="100%"
          >
            <!-- :one-page-show-pagination="false" -->
            <template v-slot:cell-template="data">
              <template v-if="data.list.template === 'icon'">
                <i
                  :class="{[data.cellValue]:true}"
                  style="display: inline-block; width: 12px; height: 14px; font-size: 12px;"
                />
              </template>
              <template v-else-if="data.list.template === 'userStatus'">
                {{ data.cellValue ? '是' : '否' }}
              </template>
              <template v-else-if="data.list.template === 'sex'">
                {{ data.row.sex === 1 ? '男' : '女' }}
              </template>
              <!-- <template v-else-if="data.list.template === 'isAdmin'">
                {{ data.row.isAdmin === 1 ? '是' : '否' }}
              </template> -->
              <template v-else-if="data.list.template === 'operate'">
                <div class="operate-box">
                  <el-link v-permission="['user.update']" type="primary" @click="update_user_btn(data.scope)">修改</el-link>
                  <el-link v-permission="['user.reset.pwd']" type="primary" @click="reset_pwd(data.scope)">重置密码</el-link>
                  <!-- <el-link v-permission="['user.update.pwd']" type="primary" @click="update_pwd(data.scope)">修改密码</el-link> -->
                </div>
              </template>
              <!-- <el-link v-else-if="data.list.template === 'link'" type="primary" @click="detail_dialog(data.scope)">{{ data.cellValue }}</el-link> -->
              <template v-else>{{ data.cellValue }}</template>
            </template>
          </dynamic-table>
        </template>
      </container-layout>
    </el-col>

    <add-user-dialog
      :visible="update_user_dialog"
      :select-row="select_row"
      :send-data="send_data"
      :flag="dialog_flag"
      @handleClose="dialog_close"
      @confirm="dialog_confirm"
    />

    <!-- <update-pwd-dialog
      :visible="update_pwd_dialog"
      :select-row="select_row"
      :send-data="send_data"
      @handleClose="update_pwd_dialog_close"
      @confirm="update_pwd_dialog_confirm"
    /> -->

    <assign-permissions-dialog
      :visible="assign_permissions_dialog"
      :select-row="select_row"
      :send-data="send_data"
      @handleClose="permissions_dialog_close"
      @confirm="permissions_dialog_confirm"
    />

    <import-user-dialog
      :visible="import_user_dialog"
      @handleClose="import_user_dialog_close"
      @confirm="import_user_dialog_confirm"
    />
  </el-row>

</template>

<script>
import AddUserDialog from './components/add-user-dialog'
// import UpdatePwdDialog from './components/update-pwd-dialog'
import AssignPermissionsDialog from './components/assign-permissions-dialog'
import ImportUserDialog from './components/import-user-dialog'

import import_users from './mixins/import-users'
import export_users from './mixins/export-users'

export default {
  name: 'UserManagement',
  components: {
    // MenuTree
    AddUserDialog,
    AssignPermissionsDialog,
    ImportUserDialog
    // UpdatePwdDialog
  },
  mixins: [import_users, export_users],
  data() {
    return {
      update_user_dialog: false,
      update_pwd_dialog: false,
      assign_permissions_dialog: false,
      dialog_flag: '',
      header_list: [
        { prop: 'userCode', label: '用户账号' },
        { prop: 'userName', label: '用户名' },
        { prop: 'sex', label: '性别', template: 'sex' },
        { prop: 'mobilePhone', label: '电话' },
        { prop: 'email', label: '邮箱' },
        { prop: 'company', label: '公司' },
        { prop: 'department', label: '部门' },
        { prop: 'position', label: '职位' },
        // { prop: 'isAdmin', label: '管理员', template: 'isAdmin' },
        { prop: 'userStatus', label: '启用', template: 'userStatus' },
        { prop: 'operate', label: '操作', template: 'operate', align: 'center' }
      ],
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: ''
      // },
      form: {
        userCode: '',
        userName: ''
      },
      checkList: ['选中且禁用', '复选框 A'],
      select_row: [],
      send_data: []
    }
  },

  methods: {
    query() {
      this.$refs.dy_table.refresh()
    },
    update_user_btn({ row }) {
      this.dialog_flag = 'update'
      this.send_data = row
      this.update_user_dialog = true
    },
    update_pwd() {
      this.update_pwd_dialog = true
    },
    update_pwd_dialog_close() {
      this.update_pwd_dialog = false
    },
    update_pwd_dialog_confirm() {
      this.update_pwd_dialog = false
    },
    reset_pwd({ row }) {
      this.$confirm('确定重置密吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code, data } = await this.$api.resetPwd({ userId: row.id })
        if (code === '200' && data) {
          this.$message.success('密码重置成功!')
        }
      }).catch(() => {
      })
    },
    del_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    getRolesOptions() {

    },
    menu_setting_dialog_btn() {
      this.dialog_flag = 'add'
      this.update_user_dialog = true
    },
    dialog_close() {
      this.update_user_dialog = false
    },
    dialog_confirm() {
      this.$refs.dy_table.refresh({ keep: true })
      this.update_user_dialog = false
    },
    permissions_dialog_close() {
      this.assign_permissions_dialog = false
    },

    permissions_dialog_confirm() {
      this.assign_permissions_dialog = false
    },

    async del(flag) {
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }

      const ids = Array.isArray(this.select_row) ? this.select_row.map(item => item.id) : [this.select_row.id]
      const { code, data } = await this.$api.userDelete(ids)
      if (code === '200' && data) {
        this.select_row = []
        this.$message.success('删除成功！')
        this.$refs.dy_table.refresh()
      }
    },

    formatType(row, col) {
      const states = {
        0: '',
        1: '目录',
        2: '菜单',
        3: '接口',
        4: '数据'
      }
      return states[row[col.property]] || ''
    },
    async request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.userList({
        page: page_no,
        limit: page_size,
        ...this.form
      })
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .operate-box {
  .el-link + .el-link {
    margin-left: 5px;
  }
}
</style>
