<template>
  <el-table-column
    v-if="!list.children"
    :type="list.type"
    :prop="list.prop"
    :label="list.label"
    :width="list.width"
    :fixed="list.fixed"
    :show-overflow-tooltip="list.tooltip"
    :sortable="!!list.sortable ? ((list.sortType || sortType)==='client' ? true: 'custom'):false"
    :align="list.align"
    :min-width="list.minWidth"
    :max-width="list.maxWidth"
  >

    <template slot="header" slot-scope="scope">

      <slot name="header-template" :scope="scope" :list="list" :label="scope.column.label">
        {{ scope.column.label }}
      </slot>
    </template>

    <template slot-scope="scope">
      <template v-if="list.formatter && typeof list.formatter === 'function'">
        <!-- 类型1：只填值或者使用formatter函数进行转换   -->
        {{ list.formatter(scope.row, scope.column, scope.row[scope.column.property], scope.$index) }}
      </template>

      <!--  类型2：自定义模板  -->
      <slot v-else name="cell-template" :scope="scope" :list="list" :cell-value="scope.row[list.prop]" :row="scope.row" :column="scope.column" :index="scope.$index">
        {{ scope.row[list.prop] }}
      </slot>
    </template>
  </el-table-column>

  <!-- 类型3：多级表头,含有类型1,2 -->
  <el-table-column v-else :label="list.label" :align="list.align" :type="list.type">

    <template slot="header" slot-scope="scope">
      <slot name="header-template" :scope="scope" :list="list" :label="scope.column.label">
        {{ scope.column.label }}
      </slot>
    </template>

    <template v-for="item in list.children">
      <!-- 递归渲染 -->
      <table-column-item :key="item.prop" :list="item">
        <template slot="header-template" slot-scope="scope">
          <slot name="header-template" v-bind="scope" />
        </template>

        <template slot="cell-template" slot-scope="scope">
          <slot name="cell-template" v-bind="scope" />
        </template>
      </table-column-item>

    </template>

  </el-table-column>

</template>

<script>

export default {
  name: 'TableColumnItem', // 利用name名递归渲染多级表头,
  props: {
    list: {
      type: Object,
      default: () => ({})
    },
    sortType: {
      type: String,
      default: 'server'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
