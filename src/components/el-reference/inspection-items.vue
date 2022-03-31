<template>
  <dialog-layout
    ref="dialog"
    v-model="current_row"
    :request="render_table"
    title="选择检测项目"
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
        label="检测项目名称："
        prop="inspectionName"
      >
        <el-input
          v-model="add_form.inspectionName"
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
      <el-table-column
        prop="id"
        label="检测项目ID"
      />
      <el-table-column
        prop="inspectionName"
        label="检测项目名称"
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
      default: '选择物品'
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
      return ` ${tag.goods_no} （${tag.goods_name}）`
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
      const { code, data } = await this.$api.inspectionItems_list({
        inspectionName: this.add_form.inspectionName,
        page: page_no,
        limit: page_size,
        order: 'asc'
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
