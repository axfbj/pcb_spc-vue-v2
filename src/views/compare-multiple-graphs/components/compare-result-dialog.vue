<template>
  <ki-dialog
    :visible="visible"
    title="选项设置"
    v-bind="$attrs"
    width="55%"
    top="10vh"
    :default-footer="false"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px; overflow: hidden; width: 100%;">
      <div class="clearfix">
        <ki-button style="float: right; margin:5px" type="primary" @click="export_excel">导出</ki-button>
      </div>
      <dynamic-table
        ref="dy_table"
        v-model="select_row"
        :allow-highlight="false"
        :request="request_data"
        :header-list="header_list"
        :fixed-height="400"
        :one-page-show-pagination="false"
        :page-sizes="[999999]"
        :auto-init="false"
      >

      <!-- <div class="descriptions-box">
        <div class="descriptions header-style">
          <el-descriptions :column="1" :size="size" border>
            <el-descriptions-item v-for="item in labels" :key="item.key" :content-style="{display: 'none'}" :label="item.label">
              kooriookami
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div v-for="(data,index) in listData" :key="index" class="descriptions">
          <el-descriptions :column="1" :size="size" border>
            <el-descriptions-item v-for="item in labels" :key="item.key" :label-style="{display: 'none'}" :content-style="{borderLeftWidth: 0}">
              <span class="nowrap-text">
                {{ data[item.key] || '-' }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div> -->

      </dynamic-table></div>
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { saveAs } from 'file-saver'
export default {
  name: 'CompareResultDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    compareChartIds: {
      type: Array,
      default: () => ([])
    }
  },

  data() {
    return {
      listData: [],
      size: 'mini',
      select_row: {},
      // header_list: [],
      header_list: [
        { prop: '控制组名称', label: '控制组名称' },
        { prop: '检测项目', label: '检测项目' },
        { prop: '图类', label: '图类' },
        { prop: '样本个数', label: '样本个数' },
        { prop: '数据点个数', label: '数据点个数' },
        { prop: '失控点个数', label: '失控点个数' },
        { prop: '规格上限', label: '规格上限' },
        { prop: '目标值', label: '目标值' },
        { prop: '规格下限', label: '规格下限' },
        { prop: '平均值', label: '平均值' },
        { prop: '最大值', label: '最大值' },
        { prop: '最小值', label: '最小值' },
        // { prop: 10, label: '标准差(整体' },
        // { prop: 11, label: '标准差(组内)' },
        { prop: 'Cpk', label: 'Cpk' },
        { prop: 'Cp', label: 'Cp' },
        { prop: 'Cpl', label: 'Cpl' },
        { prop: 'CPU', label: 'CPU' },
        { prop: 'Ppk', label: 'Ppk' },
        { prop: 'Pp', label: 'Pp' }
        // { key: 16, label: 'PPL' },
        // { key: 16, label: 'PPU' },
        // { key: 16, label: 'Ca' }
      ]

    }
  },
  computed: {
    ...mapGetters([
      'hierarchicalTypes',
      'userId',
      'username',
      'commonVariable'
    ])
  },
  created() {
  },
  methods: {
    async request_data() {
      const p = {
        controlChartSonIds: this.compareChartIds
      }
      const { code, data } = await this.$api.multipleComparisonExcelQuery(p)
      if (code === '200' && data) {
        // console.log('data', data)
        // this.listData = data
        return {
          data: data.map((item, index) => ({
            ...item,
            id: index
          })),
          tatol: data.length || 0
        }
      }
    },
    async export_excel(loading) {
      const p = {
        controlChartSonIds: this.compareChartIds,
        excelName: '对比数据.xls'
      }
      loading(true)
      const data = await this.$api.multipleComparisonExcel(p)
      if (data) {
        const blob = new Blob([data])
        saveAs(blob, `对比数据.xls`)
      }
      loading(false)
    },
    clean() {
      this.listData = []
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$emit('confirm')
    },
    async add(loading) {
    },
    async update(loading) {

    },
    async open({ load }) {
      this.$refs.dy_table.refresh()
      // const p = {
      //   controlChartSonIds: this.compareChartIds
      // }
      // const { code, data } = await load(() => this.$api.multipleComparisonExcelQuery(p))
      // if (code === '200' && data) {
      //   this.listData = data
      // }
    },
    closed() {
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>
.descriptions-box {
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
}
.descriptions {
    flex: 0 0 100px;
    &.header-style {
        flex: 0 0 100px;
    }
    .nowrap-text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
