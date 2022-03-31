<template>
  <dialog-layout
    ref="dialog"
    v-model="current_row"
    :request="render_table"
    title="选择用户组"
    :display.sync="display"
    :form="add_form"
    :tag-content="tag_content"
    @row-dblclick="row_dblclick_sure"
    @dialog-close="close"
    @get-all-select-data="get_all_select_data"
  >
    <!-- 按钮组 -->
    <template v-slot:btns>
      <div style="text-align: right; padding: 4px 10px;">
        <ki-button
          type="primary"
          @click="sure"
        >确定</ki-button>
        <ki-button
          type="danger"
          @click="close"
        >取消</ki-button>
      </div>
      <!-- <ki-button>取消</ki-button>. -->
    </template>

    <template v-slot:form>
      <el-form-item
        label="用户名："
        prop="userName"
      >
        <el-input
          v-model="add_form.userName"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="query()"
        >查询</el-button>
      </el-form-item>
    </template>

    <!-- 表格 -->
    <template v-slot:table>
      <!-- { prop: 'groupCode', label: '用户组编号' },
        { prop: 'groupName', label: '用户组名称' },
        { prop: 'inspectionName', label: '检测项目' } -->
      <el-table-column
        prop="groupCode"
        label="用户组编号"
      />
      <el-table-column
        prop="groupName"
        label="用户组名称"
      />
    </template>
  </dialog-layout>
</template>

<script>

import dialog_common from '@/mixins/dialog-common'

export default {
  mixins: [dialog_common],
  props: {
    title: {
      type: String,
      default: ''
    },
    /**
     * extra 参数
     *
     *
     */
    extra: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 初始值
    return {
      add_form: {
        inspectionName: ''
      }
    }
  },
  methods: {
    tag_content(tag) {
      // 定义tab标签内容
      return ` ${tag.userName}`
    },
    close() {
      this.$emit('add-close')
    },
    // 点击确定
    async sure() {
      if (!['[]', '{}'].includes(JSON.stringify(this.select_row))) {
        // 点击保存按钮获取表单的字段
        const select_row = JSON.parse(JSON.stringify(this.select_row))

        this.$emit('add-sure', select_row)

        this.close()
      } else {
        this.$message.warning('请点击选择一条表格数据')
      }
    },
    // 查询数据
    async render_table({ page_no, page_size }) {
      const { code, data } = await this.$api.warningUsergroup_list({
        page: page_no,
        limit: page_size
      })
      if (code === '200' && data) {
        return {
          data: data.list,
          total: data.totalCount
        }
      }
    },
    query() {
      this.$refs.dialog.refresh()
    }
  }
}
</script>
