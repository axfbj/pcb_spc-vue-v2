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
        <span><b>控制图层次信息字段</b></span>
      </el-row>
      <el-row style="padding-left: 40px;">
        <span>请选择控制图层次信息字段，没有被勾选的字段对应的数据将被自动合并</span>
      </el-row>
      <el-row style="padding:10px 0px 10pxpx 20px;">
        <el-col :span="18" style="border: 1px solid #ccc; height: 280px;">
          <el-col :span="12" style="padding: 10px 20px;">
            <el-checkbox-group v-model="checklist">
              <el-checkbox v-for="item in hierarchicalTypes" :key="item.id" :label="item.id" style="display: block;margin-bottom: 10px;">
                {{ item.hierarchicalName }}
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-col>
        <el-col :span="6" style="text-align: center;">
          <ki-button @click="checkAll">全选</ki-button>
          <br>
          <br>
          <ki-button @click="inverse">反选</ki-button>
        </el-col>
        <br>
        <el-col :span="24" style="padding-top: 10px;">
          <el-checkbox v-model="cpkHighlight">
            当CPK小于 <el-input-number v-model="cpkHighlightValue" :controls="false" style="width: 60px;" /> 时高亮显示当前单元格
          </el-checkbox>
        </el-col>
      </el-row>
    </div>
    <template v-slot:footer_custum>
      <ki-button style="float: left;" @click="handleClose">取 消</ki-button>
      <ki-button type="warning" @click="prev">上一步</ki-button>
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
import { mapGetters } from 'vuex'
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
      checklist: [],
      cpkHighlightValue: 0,
      cpkHighlight: false,
      parseNum: {
        1: 'One',
        2: 'Two',
        3: 'Three',
        4: 'Four',
        5: 'Five',
        6: 'Six',
        7: 'Seven',
        8: 'Eight',
        9: 'Nine'
      }
    }
  },
  computed: {
    ...mapGetters(['hierarchicalTypes']),
    checkbox_data() {
      return this.hierarchicalTypes.map(item => item.id)
    }
  },
  methods: {
    checkAll() {
      this.checklist = [...this.checkbox_data]
    },
    inverse() {
      this.checklist = this.checkbox_data.filter(item => !this.checklist.includes(item))
    },
    prev() {
      this.$emit('prev')
    },
    next() {
      const param_list = {}
      this.checklist.forEach(item => {
        param_list[`hierarchicalType${this.parseNum[item]}`] = 1
      })
      param_list.cpkHighlight = Number(this.cpkHighlight)
      param_list.cpkHighlightValue = this.cpkHighlightValue

      this.$emit('next', param_list)
    },
    test(scope) {
      console.log(scope)
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm() {
      // this.$refs.form.validate(valid => {
      //   if (!valid) return
      //   // alert(1)
      // })
    },
    async add() {

    },
    async update() {
    },
    async open({ loading }) {
      console.log(this.hierarchicalTypes)
    },
    async opened({ loading }) {
    },
    clear() {
      this.checklist = []
    },
    closed() {
      this.clear()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
