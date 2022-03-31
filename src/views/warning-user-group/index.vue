<template>
  <container-layout adjustable-height footer-height="50%">
    <template v-slot:btns>
      <!-- v-permission="['badDefinitionGroup.update']" -->
      <span style="float: right;">
        <ki-button
          v-permission="['warningUserGroup.save']"
          type="primary"
          @click="userGroupDialog_btn('add')"
        >新增</ki-button>
        <ki-button
          v-permission="['warningUserGroup.update']"
          type="warning"
          @click="userGroupDialog_btn('update')"
        >修改</ki-button>
        <ki-message-box
          v-permission="['warningUserGroup.delete']"
          :next="del"
          @click="del_btn"
        >
          <ki-button
            type="danger"
            style="margin-left: 10px;"
          >删除</ki-button>
        </ki-message-box>
      </span>
    </template>
    <!-- <template v-slot:form>
      <el-form-item
        label="检测项目"
        clearable
      >
        <el-reference v-model="inspectionItem_select" type="inspection-items" style="width: 200px" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="query"
        >查询</el-button>
      </el-form-item>
    </template> -->
    <template v-slot:custum_content>
      <dynamic-table
        ref="dy_table1"
        v-model="select_row1"
        :header-list="header_list1"
        :request="request_userGroup_data"
        fixed-height="100%"
        @select="render_user"
      />
    </template>
    <template v-slot:footer>
      <dynamic-table
        ref="dy_table2"
        v-model="select_row2"
        :header-list="header_list2"
        :request="request_user_data"
        fixed-height="calc(100% - 38px)"
        :auto-init="false"
        :page-sizes="[999999]"
        :one-page-show-pagination="false"
      />
    </template>
    <user-group-dialog
      :visible="userGroupDialog_visible"
      :select-row="select_row1"
      :flag="userGroupDialog_flag"
      :user-table-data="user_table_data"
      @handleClose="userGroupDialog_close"
      @confirm="userGroupDialog_confirm"
    />
  </container-layout>

</template>

<script>
import UserGroupDialog from './components/user-dialog'
import user_group_dialog from './mixin/user-group-dialog'
import del_group from './mixin/del-group'
export default {
  name: 'WarningUserGroup',
  components: {
    UserGroupDialog
  },
  mixins: [user_group_dialog, del_group],
  data() {
    return {
      search_form: {
        inspectionItemsId: ''
      },
      userGroup_query_form: {
        'groupCode': '',
        'groupName': ''
        // 'inspectionName': ''
      },
      inspectionItem_select: {},
      select_row1: {},
      select_row2: {},
      header_list1: [
        { prop: 'groupCode', label: '用户组编号' },
        { prop: 'groupName', label: '用户组名称' }
        // { prop: 'inspectionName', label: '检测项目' }
      ],
      header_list2: [
        { prop: 'userId', label: '用户ID' },
        { prop: 'userName', label: '用户名' }
      ]
    }
  },
  methods: {
    // async query() {
    // //   this.$refs.table_data
    //   const inspectionItemsId = this.inspectionItem_select.id
    //   // console.log('this.inspectionItem_select', this.inspectionItem_select)
    //   // console.log('inspectionItemsId', inspectionItemsId)
    //   const { code, data } = await this.$api.warningUsergroup_queryByInspectionItemsId({ inspectionItemsId })
    //   console.log(data, code)
    // },
    async request_userGroup_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.warningUsergroup_list({
        page: page_no,
        limit: page_size,
        ...this.userGroup_query_form
      })
      if (code === '200' && data) {
        if (data.list.length === 0) {
          this.select_row1 = {}
          this.$refs.dy_table2.refresh()
          return
        }
        if (!Object.hasOwnProperty.call(this.select_row1, 'id') && data.list.length > 0) {
          this.select_row1 = data.list[0]
        }
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    },
    async request_user_data({ page_no, page_size, table_data }) {
      if (!Object.hasOwnProperty.call(this.select_row1, 'id')) {
        return
      }
      const { code, data } = await this.$api.warningUser_list({
        groupId: this.select_row1.id
      })
      if (code === '200' && data) {
        this.user_table_data = data
        return {
          data,
          total: data.length
        }
      }
      this.user_table_data = []
    },
    render_user() {
      this.$refs.dy_table2.refresh({ keep: true })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
