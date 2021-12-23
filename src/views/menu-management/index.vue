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
              <ki-button type="warning" @click="menu_setting_dialog_btn('update')">修改</ki-button>
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
            default-expand-all
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
              <template v-if="data.list.template === 'enable'">
                {{ data.cellValue ? '是' : '否' }}
              </template>
              <!-- <el-link v-else-if="data.list.template === 'link'" type="primary" @click="detail_dialog(data.scope)">{{ data.cellValue }}</el-link> -->
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
        { prop: 'id', label: 'id', width: '80', type: '' },
        { prop: 'title', label: '名称', width: '220' },
        { prop: 'icon', label: '图标', width: '60', template: 'icon', align: 'center' },
        { prop: 'href', label: '菜单链接', width: '320' },
        { prop: 'powerCode', label: '权限标识', width: '140' },
        { prop: 'type', label: '类型', formatter: this.formatType, width: '140' },
        // { prop: 'pid', label: '父级id' }
        { prop: 'enable', label: '是否可用', template: 'enable' }
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
      select_row: {}
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
    menu_setting_dialog_btn(flag) {
      this.dialog_flag = flag
      if (flag === 'update') {
        if (!this.$refs.dy_table.one_row_select()) return
      }

      this.menu_setting_dialog = true
    },
    dialog_close() {
      this.menu_setting_dialog = false
    },
    dialog_confirm() {
      this.menu_setting_dialog = false
    },
    async del(flag) {
      if (flag === 'N') {
        this.$message('操作取消')
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
    async request_data({ page_no, page_size, data }) {
      const d = {
        'data': [
          {
            'id': '1',
            'pid': '0',
            'title': '统计过程控制',
            'href': '',
            'openType': '',
            'type': 0,
            'powerCode': '',
            'children': [
              {
                'id': '2',
                'pid': '1',
                'title': '控制组列表',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '3',
                'pid': '1',
                'title': '层次信息定义',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '4',
                'pid': '1',
                'title': '检测项目定义',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '5',
                'pid': '1',
                'title': '不良项目定义',
                'href': '',
                'openType': '', // 链接方式
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '6',
                'pid': '1',
                'title': '失控点处理',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              },
              {
                'id': '7',
                'pid': '',
                'title': '报表汇总',
                'href': '',
                'openType': '',
                'type': 1,
                'powerCode': ''
              }
            ]
          },
          {
            'id': '8',
            'pid': '0',
            'title': '系统管理',
            'href': '',
            'openType': '',
            'type': 0,
            'powerCode': '',
            'children': [
              {
                'id': '9',
                'pid': '8',
                'title': '用户管理',
                'href': '',
                'openType': '',
                'type': 0,
                'powerCode': ''
              },
              {
                'id': '10',
                'pid': '8',
                'title': '权限管理',
                'href': '',
                'openType': '',
                'type': 0,
                'powerCode': ''
              },
              {
                'id': '11',
                'pid': '8',
                'title': '角色管理',
                'href': '',
                'openType': '',
                'type': 0,
                'powerCode': ''
              }
            ]
          },
          {
            'id': '298',
            'pid': '0',
            'title': 'NA',
            'href': '',
            'openType': '',
            'type': 0,
            'powerCode': ''
          }
        ],
        'code': '200',
        'msg': '操作成功'
      }
      this.menu_tree = d.data
      return {
        data: d.data,
        total: d.data.length
      }
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    },
    click_link(data) {
      console.log(data)
    }
  }
}
</script>
