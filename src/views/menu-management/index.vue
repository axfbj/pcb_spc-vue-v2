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
        <!-- <template v-slot:btns> -->
        <!-- <el-row> -->
        <!-- <span style="font-size: 14px; color: #008040;">控制组路径: {{ path }}</span> -->
        <!-- <span style="float: right;"> -->
        <!-- <ki-button type="primary" @click="add_menu_btn('add')">新建</ki-button> -->
        <!-- <ki-button type="warning" @click="menu_setting_dialog_btn('update')">修改</ki-button> -->
        <!-- <ki-message-box
                :next="del"
                @click="del_btn"
                v-permission="['menu.delete']"
              >
                <ki-button
                  type="danger"
                  style="margin-left: 10px;"
                >删除</ki-button>
              </ki-message-box> -->
        <!-- </span> -->
        <!-- </el-row> -->

        <!-- </template> -->
        <!-- 表格 -->
        <template v-slot:custum_content>
          <!-- default-expand-all -->
          <dynamic-table
            ref="dy_table"
            v-model="select_row"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[99999]"
            fixed-height="100%"
            :one-page-show-pagination="false"
            @select="select_callback"
          >
            <template v-slot:cell-template="data">
              <template v-if="data.list.template === 'icon'">
                <i
                  :class="{[data.cellValue]:true}"
                  style="display: inline-block; width: 16px; height: 16px; font-size: 16px;"
                />
              </template>
              <template v-else-if="data.list.template === 'type'">
                <el-tag v-if="data.cellValue === 1">菜单</el-tag>
                <el-tag v-if="data.cellValue === 2" type="warning">数据</el-tag>
              </template>
              <template v-else-if="data.list.template === 'enable'">
                {{ data.cellValue ? '是' : '否' }}
              </template>
              <template v-else-if="data.list.template === 'operate'">
                <div class="operate-box">
                  <!-- <el-link type="primary" @click="add_menu_son_btn(data.scope)">添加</el-link> -->
                  <el-link v-permission="['menu.update']" type="primary" @click="update_menu_son_btn(data.scope)">修改</el-link>
                </div>
              </template>
              <template v-else>{{ data.cellValue }}</template>
            </template>
          </dynamic-table>
        </template>
      </container-layout>
    </el-col>

    <menu-setting-dialog
      :visible="menu_setting_dialog"
      :select-row="select_row"
      :flag="dialog_flag"
      :menu-tree="menu_tree"
      :send-row="send_row"
      @handleClose="dialog_close"
      @confirm="dialog_confirm"
    />
  </el-row>

</template>

<script>
// import MenuTree from './components/menu-tree'
import MenuSettingDialog from './components/menu-setting-dialog'
export default {
  name: 'MenuManagement',
  components: {
    // MenuTree
    MenuSettingDialog
  },
  data() {
    return {
      menu_setting_dialog: false,
      dialog_flag: '',
      menu_tree: [],
      header_list: [
        // { prop: 'id', label: 'id', width: '180', type: '' },
        { prop: 'title', label: '名称' },
        { prop: 'icon', label: '图标', width: '60', template: 'icon', align: 'center' },
        { prop: 'href', label: '菜单链接' },
        // { prop: 'href', label: '菜单链接', width: '320' },
        { prop: 'powerCode', label: '权限标识' },
        { prop: 'sort', label: '排序码', width: '60' },
        { prop: 'type', label: '类型', width: '80', template: 'type', align: 'center' },
        // { prop: 'pid', label: '父级id' }
        { prop: 'enable', label: '是否可用', template: 'enable', width: '80' },
        { prop: 'operate', label: '操作', template: 'operate', align: 'center', width: '140' }
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
      select_row: {},
      send_row: {}
    }
  },

  methods: {
    node_click() {},
    render_after() {},
    path_change() {},
    del_btn(open) {
      if (!this.$refs.dy_table.one_row_select()) return
      open()
    },
    add_menu_btn() {
      this.dialog_flag = 'add-clear'
      this.menu_setting_dialog = true
    },
    add_menu_son_btn({ row }) {
      this.dialog_flag = 'add'
      this.send_row = row
      this.menu_setting_dialog = true
    },
    update_menu_son_btn({ row }) {
      // if (!this.$refs.dy_table.one_row_select()) return
      this.dialog_flag = 'update'
      this.send_row = row
      this.menu_setting_dialog = true
    },
    dialog_close() {
      this.menu_setting_dialog = false
    },
    dialog_confirm() {
      this.menu_setting_dialog = false
      this.$refs.dy_table.refresh()
    },
    async del(flag) {
      if (flag === 'N') {
        this.$message('操作取消')
        return
      }
      if (Object.hasOwnProperty.call(this.select_row, 'children')) {
        this.$message.warning('含有子节点的菜单不能直接删除!')
        return
      }
      const ids = Array.isArray(this.select_row) ? this.select_row.map(item => item.id) : [this.select_row.id]
      const { code, data } = await this.$api.menu_delete(ids)
      if (code === '200' && data) {
        this.select_row = {}
        this.$message.success('删除成功！')
        this.$refs.dy_table.refresh()
      }
    },
    async request_data({ page_no, page_size, table_data }) {
      const { code, data } = await this.$api.menu_tree()
      if (code === '200' && data) {
        this.menu_tree = data
        return {
          data: data,
          total: data.length
        }
      }
    },
    select_callback(data) {
      // console.log('select_callback：  ', JSON.stringify(data))
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
