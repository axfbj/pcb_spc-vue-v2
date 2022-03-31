<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    top="50px"
    :append-to-body="true"
    class="koimy-dialog-container"
    :before-close="before_close"
  >
    <div class="koimy-dialog-header">
      <!-- <div v-if="$slots.btns" style="background: #d9e8ff"> -->
      <div
        v-if="$slots.btns"
        style="background: #dfdfdf"
      >
        <slot name="btns" />
      </div>
      <el-form
        v-if="$slots.form"
        ref="form"
        :model="form"
        :inline="true"
        label-position="left"
      >
        <slot name="form" />
      </el-form>
    </div>
    <el-row v-if="multiple && topTab">
      <el-scrollbar
        ref="scrollbar"
        style="height:100%"
      >
        <span style="white-space:nowrap; display:inline-bloack;">
          <div style="height:24px">
            <el-tag
              v-for="tag in save_data"
              :key="tag[unique]"
              closable
              size="small"
              type="info"
              disable-transitions
              @close="close(tag[unique])"
            >
              {{ tagContent ? tagContent(tag) : tag[unique] }}
            </el-tag>
          </div>
        </span>
      </el-scrollbar>
    </el-row>
    <div>
      <slot />
    </div>
    <!-- border
      stripe
      fit -->
    <el-table
      ref="table"
      v-loading="loading"
      :style="{width: '100%'}"
      :data="data"
      :max-height="dialog_max_height"
      :highlight-current-row="highlight_current_row"
      :current-row-key="unique"
      :row-key="unique"
      @row-click="row_click"
      @select="select"
      @select-all="select_all"
      @selection-change="selection_change"
      @row-dblclick="row_dblclick"
    >
      <el-table-column
        v-if="multiple"
        type="selection"
        width="55"
        align="center"
        fixed="left"
      />
      <slot name="table" />
    </el-table>

    <div
      v-if="$slots.table && show"
      class="koimy-dialog-footer"
    >
      <el-pagination
        ref="pagination"
        :current-page="page_no"
        :page-sizes="pageSizes"
        :page-size="pageSizes[0]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page_total"
        :pager-count="5"
        @size-change="size_change"
        @current-change="pagination_current_change"
      />
    </div>

  </el-dialog>
</template>

<script>
import table_select from '@/mixins/table-select'

import { debounce } from '@/utils/tools'

export default {
  name: 'DialogLayout',
  mixins: [table_select],
  props: {
    display: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '弹窗'
    },
    form: {
      type: Object,
      default: () => { }
    },
    tagContent: {
      type: Function,
      default: () => { }
    },
    topTab: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 初始值
    return {
      dialog_max_height: window.innerHeight / 2,
      save_data: this.multiple ? [] : {},
      flag: 0
    }
  },
  computed: {
    visible: {
      get() {
        return this.display
      },
      set() {
        this.$emit('dialog-close')
        this.$refs.form && this.$refs.form.resetFields()
      }
    }
  },
  watch: {
    display: {
      deep: true,
      handler(show) {
        this.save_data = JSON.parse(JSON.stringify(this.value))
        if (show) {
          this.refresh({ keep: true })
        }
      }
    },
    save_data: {
      deep: true,
      handler() {
        this.update_scrollbar({ vm: this })
      }
    }
  },
  methods: {
    select(selection, row) {
      this.highlight_current_row = false
      const index = this.save_data.findIndex(item => item[this.unique] === row[this.unique])
      if (index > -1) {
        this.save_data.splice(index, 1)
      } else {
        this.save_data.push(row)
      }
      this.$emit('get-all-select-data', this.save_data)
    },
    select_all(selection) {
      this.highlight_current_row = false
      this.data.forEach(row => {
        const index = this.save_data.findIndex(item => item[this.unique] === row[this.unique])
        if (selection.length === 0) {
          if (index > -1) this.save_data.splice(index, 1)
        } else {
          if (index === -1) this.save_data.push(row)
        }
      })
      this.$emit('get-all-select-data', this.save_data)
    },
    row_dblclick(...args) {
      if (this.save_data) {
        this.$emit('get-all-select-data', this.save_data)
      }
      this.$emit('row-dblclick', ...args)
    },
    close(del_key) {
      const del_row = this.data.find(row => row[this.unique] === del_key)
      if (del_row) this.$refs.table.toggleRowSelection(del_row, false)
      const del_index = this.save_data.findIndex(item => item[this.unique] === del_key)
      this.save_data.splice(del_index, 1)
      this.$emit('get-all-select-data', this.save_data)
    },
    update_scrollbar: debounce(({ vm }) => {
      vm.$nextTick(() => {
        vm.$refs.scrollbar && vm.$refs.scrollbar.update()
      })
    }, 20),
    // 重新计算表格的最大高度
    calc() {
      this.dialog_max_height = window.innerHeight / 2
    },
    before_close(done) {
      done()
    }
  }
}
</script>

<style lang="scss">
.koimy-dialog-container {
  .el-dialog__body {
    padding: 0;
  }
  .koimy-dialog-header {
    .el-form-item {
      margin: 10px;
    }
  }
  .koimy-dialog-footer {
    width: 100%;
    position: absolute;
    z-index: 4;
    padding-top: 5px;
    background-color: #fff; // rgb(245,245,245);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    text-align: right;
  }
}
</style>
