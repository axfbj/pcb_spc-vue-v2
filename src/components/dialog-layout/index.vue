<template>
  <el-dialog :title="title" :visible.sync="visible" top="50px" :append-to-body="true" class="koimy-dialog-container" :before-close="before_close">
    <div class="koimy-dialog-header">
      <!-- <div v-if="$slots.btns" style="background: #d9e8ff"> -->
      <div v-if="$slots.btns" style="background: #dfdfdf">
        <slot name="btns" />
      </div>
      <el-form v-if="$slots.form" ref="form" :model="form" :inline="true" label-position="left">
        <slot name="form" />
      </el-form>
    </div>
    <el-row v-if="multiple && topTab">
      <el-scrollbar ref="scrollbar" style="height:100%">
        <span style="white-space:nowrap; display:inline-bloack;">
          <div style="height:24px">
            <el-tag v-for="(tag,index) in save_data" :key="tag[unique]" closable size="small" type="info" disable-transitions @close="close(index)">
              {{ tagContent ? tagContent(tag) : tag[unique] }}
            </el-tag>
          </div>
        </span>
      </el-scrollbar>
    </el-row>
    <div>
      <slot />
    </div>
    <el-table
      ref="table"
      v-loading="loading"
      :style="{width: '100%'}"
      :data="data"
      :max-height="dialog_max_height"
      border
      stripe
      fit
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

    <div v-if="$slots.table && show" class="koimy-dialog-footer">
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
      default: () => {}
    },
    tagContent: {
      type: Function,
      default: () => {}
    },
    topTab: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
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
        this.$nextTick(() => {
          this.fill_data(this.value, false)
        })
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
      handler() {
        this.save_data = JSON.parse(JSON.stringify(this.value))

        if (this.flag === 0) {
          this.flag++
          this.request_data()
        }
      }
    },
    value: {
      deep: true,
      handler(selection, old_selection) {
        this.save_all_select_row({ vm: this, selection, old_selection })
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
    row_dblclick(...args) {
      this.$emit('row-dblclick', ...args)
    },
    close(index) {
      const del_row = this.save_data[index]
      if (del_row) {
        const del_row_index = this.data.findIndex(item => {
          return item[this.unique] === del_row[this.unique]
        })
        if (del_row_index !== -1) {
          this.set_currentRow(-1)
          this.$refs.table.toggleRowSelection(this.data[del_row_index], false)
          return
        }
        this.save_data.splice(index, 1)
        this.$emit('get-all-select-data', this.save_data)
      }
    },
    update_scrollbar: debounce(({ vm }) => {
      vm.$nextTick(() => {
        vm.$refs.scrollbar && vm.$refs.scrollbar.update()
      })
    }, 20),
    save_all_select_row: debounce(({ vm, selection, old_selection }) => {
      // console.log('old_selection', old_selection)
      // console.log('selection', selection)
      // console.log('vm.save_data', vm.save_data)

      if (!vm.multiple) {
        // 单选翻页高亮的情况
        if (selection === null || JSON.stringify(selection) === '{}') {
          vm.save_data = { ...old_selection }
        } else {
          vm.save_data = { ...selection }
        }
        vm.$emit('get-all-select-data', vm.save_data)
        return
      }
      if (vm.multiple && vm.highlight_current_row && selection.length === 1) {
        // console.log('多选高亮')
        // 多选高亮
        vm.save_data = [...selection]
        vm.$emit('get-all-select-data', vm.save_data)
        return
      }

      if (!Array.isArray(selection) || !Array.isArray(old_selection)) return

      if (selection.length >= old_selection.length) {
        const add_data = selection.filter(item => {
          return old_selection.every(i => {
            return i[vm.unique] !== item[vm.unique]
          })
        })
        // console.log('add_data', add_data)
        if (add_data.length >= 1) {
          add_data.forEach(item => {
            const add_data_bool = vm.save_data.every(i => {
              return item[vm.unique] !== i[vm.unique]
            })
            // console.log('vm.save_data', vm.save_data)
            if (add_data_bool) {
              vm.save_data.push(item)
            }
          })
        }
      } else {
        const del_data = old_selection.filter(item => {
          return selection.every(i => {
            return i[vm.unique] !== item[vm.unique]
          })
        })
        if (del_data.length >= 1) {
          const del_data_index_arr = []
          del_data.forEach(item => {
            const del_data_index = vm.save_data.findIndex(i => {
              return item[vm.unique] === i[vm.unique]
            })
            if (del_data_index !== -1) {
              del_data_index_arr.push(del_data_index)
            }
          })
          // console.log(del_data_index_arr)
          del_data_index_arr.forEach(i => {
            vm.save_data[i] = null
          })
          vm.save_data = vm.save_data.filter(i => i !== null)
        }
      }
      vm.$emit('get-all-select-data', vm.save_data)
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
        padding: 0
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
