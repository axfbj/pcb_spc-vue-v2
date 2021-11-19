<template>
  <dialog-layout
    ref="dialog"
    v-model="current_row"
    :request="render_table"
    :title="'选择物品'"
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
        <ki-button type="primary" @click="sure">确定</ki-button>
        <ki-button type="danger" @click="close">取消</ki-button>
      </div>
      <!-- <ki-button>取消</ki-button>. -->
    </template>

    <template v-slot:form>
      <el-form-item label="物品编号：" prop="goods_no">
        <el-input
          v-model="add_form.goods_no"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="物品名称：" prop="goods_name">
        <el-input
          v-model="add_form.goods_name"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="query()">查询</el-button>
      </el-form-item>
    </template>
    <!-- 表格 -->
    <template v-slot:table>
      <el-table-column
        prop="name"
        label="物品编号"
      />
      <el-table-column
        prop="address"
        label="物品名称"
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
      default: () => {}
    }
  },
  data: function() {
    // 初始值
    return {
      add_form: {
        goods_no: '',
        goods_name: ''
      }
    }
  },
  methods: {
    f1() {
      console.log(1111)
    },
    f2() {
      console.log(2222)
    },
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
      console.log('------------------', page_no, page_size)
      const total = 9
      const list_num = page_no * page_size < total ? page_size : page_size - (page_no * page_size - total)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: Array(list_num).fill({
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }).map((i, index) => {
              const doccode = (page_no - 1) * page_size + index
              console.log(doccode)
              return {
                ...i,
                doccode
              }
            }),
            total
          })
        }, 1000)
      })
    },
    query() {
      this.$refs.dialog.refresh()
    }
  }
}
</script>
