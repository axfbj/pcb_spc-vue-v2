<template>
  <el-row>
    <!-- <el-col :span="4" style="">
      <container-layout>
        <template v-slot:custum_content>
          <menu-tree
            ref="tree"
            @node-click="node_click"
            @render-after="render_after"
            @path-change="path_change"
          />
        </template>
      </container-layout>
    </el-col> -->
    <el-col :span="24">
      <container-layout>
        <template v-slot:btns>
          <el-row>
            <!-- <span style="font-size: 14px; color: #008040;">控制组路径: {{ path }}</span> -->
            <span style="float: right;">
              <ki-button type="primary" @click="menu_setting_dialog_btn('add')">新建</ki-button>
              <!-- <ki-button type="warning" @click="menu_setting_dialog_btn('update')">修改</ki-button> -->
              <ki-message-box
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
        <template v-slot:custum_content>
          <dynamic-table
            ref="dy_table"
            v-model="select_row"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[30,60,120]"
            fixed-height="100%"
            :one-page-show-pagination="false"
            @select="select_callback"
          >
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
              <template v-else-if="data.list.template === 'isAdmin'">
                {{ data.row.isAdmin === 1 ? '是' : '否' }}
              </template>
              <template v-else-if="data.list.template === 'operate'">
                <div class="operate-box">
                  <el-link type="primary" @click="update_user_btn(data.scope)">修改</el-link>
                  <el-link type="primary" @click="reset_pwd(data.scope)">重置密码</el-link>
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

    <assign-permissions-dialog
      :visible="assign_permissions_dialog"
      :select-row="select_row"
      :send-data="send_data"
      @handleClose="permissions_dialog_close"
      @confirm="permissions_dialog_confirm"
    />
  </el-row>

</template>

<script>
import AddUserDialog from './components/add-user-dialog'
import AssignPermissionsDialog from './components/assign-permissions-dialog'
// import { userList, userDelete, resetPwd } from '@/api/user'

export default {
  name: 'Role',
  components: {
    // MenuTree
    AddUserDialog,
    AssignPermissionsDialog
  },
  data() {
    return {
      update_user_dialog: false,
      assign_permissions_dialog: false,
      dialog_flag: '',
      header_list: [
        { prop: 'userCode', label: '编号' },
        { prop: 'userName', label: '账号' },
        { prop: 'sex', label: '性别', template: 'sex' },
        { prop: 'mobilePhone', label: '电话' },
        { prop: 'email', label: '邮箱' },
        // { prop: 'isAdmin', label: '管理员', template: 'isAdmin' },
        { prop: 'userStatus', label: '启用', template: 'userStatus' },
        { prop: 'operate', label: '操作', template: 'operate', align: 'center' }
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      checkList: ['选中且禁用', '复选框 A'],
      select_row: [],
      send_data: []
    }
  },

  methods: {
    update_user_btn({ row }) {
      this.dialog_flag = 'update'
      this.send_data = row
      this.update_user_dialog = true
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
      this.$refs.dy_table.refresh()
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
        limit: page_size
      })
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalPage
        }
      }
    },
    select_callback(data) {
    },
    click_link(data) {
      console.log(data)
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
