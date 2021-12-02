<template>
  <ki-dialog
    :visible="visible"
    title="控制图设置"
    width="60%"
    v-bind="$attrs"
    @handleClose="handleClose"
    @confirm="confirm"
    @opened="opened"
  >
    <div style="padding: 0px 20px; overflow:hidden;">
      <el-form
        ref="form"
        :model="form"
        :inline="true"
        style="float: left;"
      >
        <el-form-item label="控制图类型:" style="margin-bottom: 10px;">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <ki-button
          type="primary"
        >添加</ki-button>
        <ki-button type="warning">克隆</ki-button>
        <ki-button
          type="danger"
        >删除</ki-button>
      </el-form>

      <!-- <div style="overflow:hidden; text-align: right;">
        <ki-button type="primary">添加</ki-button>
        <ki-button type="danger">删除</ki-button>
      </div> -->
    </div>
    <div>
      <dynamic-table
        v-model="select"
        :header-list="header_list"
        :request="request_data"
        :page-sizes="[100]"
        fixed-height="26vh"
        :one-page-show-pagination="false"
        @select="select_callback"
      />
    </div>
    <el-row>
      <el-col :span="6">
        <el-form :model="form" label-width="auto">
          <fieldset style="border: 1px solid #ccc;">
            <legend style="color:#606266">基本信息</legend>
            <el-form-item label="规格上限:">
              <el-input type="text" />
            </el-form-item>
            <el-form-item label="目标值:">
              <el-input type="text" />
            </el-form-item>
            <el-form-item label="规格下限:">
              <el-input type="text" />
            </el-form-item>
            <el-form-item label="样本容量:">
              <el-input type="text" />
            </el-form-item>
          </fieldset>
        </el-form>
      </el-col>
      <el-col :span="18">
        <el-form :model="form" label-width="auto">
          <fieldset style="border: 1px solid #ccc;">
            <legend style="color:#606266">控制图信息</legend>
            <el-form-item label="规格上限:">
              <el-input type="text" />
            </el-form-item>
            <el-form-item label="目标值:">
              <el-input type="text" />
            </el-form-item>
            <el-form-item label="规格下限:">
              <el-input type="text" />
            </el-form-item>
            <el-form-item label="规格下限:">
              <el-input type="text" />
            </el-form-item>
            <!-- <el-form-item label="样本容量:">
              <el-input type="text" />
            </el-form-item> -->
          </fieldset>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-form :model="form" label-width="auto">
        <fieldset style="border: 1px solid #ccc;">
          <legend style="color:#606266">其他信息</legend>
          <el-form-item label="控制图描述:">
            <el-input type="text" />
          </el-form-item>
          <el-form-item label="自定义控制图标题:">
            <el-input type="text" />
          </el-form-item>
        </fieldset>
      </el-form>
    </el-row>
  </ki-dialog>
</template>

<script>
export default {
  name: 'ControlChartSettings',
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
      select: {},
      header_list: [
        { prop: 'id', label: 'id', width: '180' },
        { prop: 'name', label: '姓名', width: '180' },
        { prop: 'address', label: '地址' }
      ],
      form: {
        hierarchicalName: ''
      },
      value: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }]
    }
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('handleClose')
    },
    confirm() {
      this.$emit('confirm')
    },
    opened() {
      this.form.hierarchicalName = this.selectRow.hierarchicalName
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    },
    request_data({ page_no, page_size, data }) {
      console.log('------------------', page_no, page_size)
      page_no = Number(page_no)
      page_size = Number(page_size)
      const total = 6
      const list_num = page_no * page_size < total ? page_size : page_size - (page_no * page_size - total)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: Array(list_num).fill({
              date: '2016-05-02',
              name: '王小虎',
              address: '上海市普陀区金沙江路 1518 弄'
            }).map((i, index) => {
              const id = (page_no - 1) * page_size + index
              console.log(id)
              return {
                ...i,
                id
              }
            }),
            total
          })
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:v-deep .el-form-item--mini.el-form-item{
  margin-bottom: 14px;
}

</style>
