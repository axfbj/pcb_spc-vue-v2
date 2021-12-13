<template>
  <ki-dialog
    :visible="visible"
    title="报表生成向导"
    width="35%"
    :default-footer="false"
    @closed="closed"
    @handleClose="handleClose"
    @open="open"
    @opened="opened"
  >
    <div style="padding: 0px 20px;">
      <el-row style="padding-left: 20px;">
        <span><b>控制组列表</b></span>
      </el-row>
      <el-row style="padding-left: 40px;">
        <span>请勾选待分许处理的控制组项目</span>
      </el-row>
      <el-row style="padding:10px 0px 10pxpx 20px;">
        <el-col :span="18" style="border: 1px solid #ccc; height: 300px;">
          <el-tree
            ref="chekbox_tree"
            :data="tree_data"
            show-checkbox
            node-key="id"
            :props="defaultProps"
          />
        </el-col>
        <el-col :span="6" style="text-align: center;">
          <ki-button @click="checkAll">全选</ki-button>
          <br>
          <br>
          <ki-button @click="inverse">反选</ki-button>
          <!-- <ki-button @click="clear">清理</ki-button> -->
        </el-col>
      </el-row>

    </div>
    <template v-slot:footer_custum>
      <ki-button style="float: left;" @click="handleClose">取 消</ki-button>
      <!-- <ki-button type="warning" @click="prev">上一步</ki-button> -->
      <ki-button type="warning" @click="next">下一步</ki-button>
      <!-- <ki-button
        style="margin-left: 60px;"
        type="primary"
        @click="confirm"
      >确 定</ki-button> -->
    </template>
  </ki-dialog>
</template>

<script>
export default {
  name: 'ControlGroupFiltering',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRow: {
      type: [Object, Array],
      default: () => ({})
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'groupName',
        children: 'children'
      },
      tree_data: []
      // flag: false,
      // tree_data: [{
      //   id: 1,
      //   label: '一级 1',
      //   children: [{
      //     id: 4,
      //     label: '二级 1-1',
      //     children: [{
      //       id: 9,
      //       label: '三级 1-1-1'
      //     }, {
      //       id: 10,
      //       label: '三级 1-1-2'
      //     }]
      //   }]
      // }, {
      //   id: 2,
      //   label: '一级 2',
      //   children: [{
      //     id: 5,
      //     label: '二级 2-1'
      //   }, {
      //     id: 6,
      //     label: '二级 2-2'
      //   }]
      // }, {
      //   id: 3,
      //   label: '一级 3',
      //   children: [{
      //     id: 7,
      //     label: '二级 3-1'
      //   }, {
      //     id: 8,
      //     label: '二级 3-2'
      //   }]
      // }],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // }
    }
  },
  methods: {
    async getTreeDate() {
      const { code, data } = await this.$api.controlGroup_tree()
      if (code === '200' && data) {
        this.tree_data = data
      }
    },
    prev() {},
    next() {
      const checkboxKeys = this.$refs.chekbox_tree.getCheckedKeys()
      this.$emit('next', checkboxKeys)
    },
    test(scope) {
      console.log(scope)
    },
    clear() {
      const checkboxKeys = this.$refs.chekbox_tree.getCheckedKeys()
      checkboxKeys.forEach(key => this.$refs.chekbox_tree.setChecked(key, false, true))
    },
    handleClose() {
      this.$emit('handleClose')
      // this.$refs.form.resetFields()
    },
    async confirm() {
      // this.$refs.form.validate(valid => {
      //   if (!valid) return
      // })
    },
    checkAll() {
      // this.flag = true
      this.$refs.chekbox_tree.setCheckedNodes(this.tree_data)
    },
    // 全选
    batchSelect(nodes, refs, flag, seleteds) {
      if (typeof nodes !== 'undefined') {
        nodes.forEach(element => {
          refs.setChecked(element, flag, true)
        })
      }

      if (typeof seleteds !== 'undefined') {
        seleteds.forEach(node => {
          refs.setChecked(node, !flag, true)
        })
      }
    },
    // 反选
    inverse() {
      const res = this.$refs.chekbox_tree
      const nodes = res.getCheckedNodes(true, true)
      this.batchSelect(this.tree_data, res, true, nodes)
    },
    async add() {

    },
    async update() {
    },
    async open({ loading }) {
      if (!this.tree_data || this.tree_data.length === 0) {
        this.getTreeDate()
      }
    },
    async opened({ loading }) {
    },
    closed() {
      this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
