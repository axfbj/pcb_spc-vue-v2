<template>
  <el-row>
    <el-col :span="4">
      <container-layout ref="left_tree">
        <template v-slot:btns>
          <div style="text-align: left;">
            控制组列表
          </div>
        </template>
        <template v-slot:custum_content>
          <ki-tree />
        </template>
      </container-layout>
    </el-col>
    <el-col :span="20">
      <container-layout ref="control-pic-list">
        <template v-slot:btns>
          <div style="text-align: right;">
            <ki-button
              type="primary"
              :auto-loading="true"
              @click="cc(...arguments,'1111')"
            >控制图设置</ki-button>
            <ki-button type="warning">单项目输入</ki-button>
            <ki-button
              type="danger"
              :auto-loading="true"
              @click="cc(...arguments,'1111')"
            >删除</ki-button>
          </div>
        </template>
        <template v-slot:form>
          <el-form-item label="日期:">
            <el-col :span="11">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
            <el-col
              class="line"
              :span="1"
            >至</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="form.date1"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-col>
          </el-form-item>
          <el-form-item label="状态:">
            <allow-create-select
              v-model="value2"
              style="width: 100px;"
            />
          </el-form-item>
          <el-form-item label="编号:">
            <allow-create-select
              v-model="value1"
              style="width: 100px;"
            />
          </el-form-item>
          <el-form-item label="检测项目:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="图类:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="产品型号:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="产品名称:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="产线:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="班次:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="设备:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="供应商:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="客户:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>
          <el-form-item label="批次:">
            <el-input
              v-model="form.name"
              style="width:100px"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="dialogVisible = true"
            >查询</el-button>
          </el-form-item>
        </template>
        <template v-slot:custum_content>
          <dynamic-table
            v-model="select"
            :header-list="header_list"
            :request="request_data"
            :page-sizes="[20,60,100]"
            fixed-height="100%"
            @current-change="current_change"
            @select="select_callback"
          />
        </template>
        <template v-slot:footer>
          <div class="states-list">
            <span
              v-for="(item,index) in states_text"
              :key="index"
            >
              <rectangle
                v-if="item.flag === 'history'"
                :state="item.state"
              />
              <round-shape
                v-else
                :state="item.state"
              />
              {{ item.text }}
            </span>
          </div>
        </template>
      </container-layout>
    </el-col>
  </el-row>

</template>

<script>
import Rectangle from './components/rectangle'
import RoundShape from './components/round-shape'
import { AllowCreateSelect } from '@/components/form-item'
// import StatusFlag from './components/status-flag'
export default {
  name: 'ControlGroupList',
  components: {
    Rectangle,
    RoundShape,
    AllowCreateSelect
    // StatusFlag
  },
  data() {
    return {
      form_data: {
        state: '',
        s_number: '',
        test_item: '',
        graph_type: ''
      },
      value1: '111',
      value2: '222',
      states_text: [
        { flag: 'history', state: '0', text: '历史点未失控' },
        { flag: 'history', state: '1', text: '历史点未处理' },
        { flag: 'history', state: '2', text: '历史点已处理' },
        { flag: 'last', state: '0', text: '最后点未失控' },
        { flag: 'last', state: '1', text: '最后点未处理' },
        { flag: 'last', state: '2', text: '最后点已处理' }
      ],
      item2: {},
      header_list: [
        { prop: 'doccode', label: '层次类型ID', width: '180' },
        { prop: 'name', label: '层次', width: '180' },
        { prop: 'address', label: '类型名称' }
      ],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      checkList: ['选中且禁用', '复选框 A'],
      select2: [],
      select: [{
        id: 1
      }]
    }
  },

  methods: {
    cc(loddingEnd, f) {
      setTimeout(() => {
        loddingEnd()
      }, 1000)
    },

    click_link(data) {
      console.log(data)
    },

    async copy(name, title) {
      if (!this.can_copy) return

      await this.can_copy.writeText(`<icon name="${name}" title="${title}" />`)
      this.$message.success('按钮已到剪贴板')
    },
    current_change(val) {
      console.log('current_change')
      console.log(val)
    },
    request_data({ page_no, page_size, data }) {
      console.log('------------------', page_no, page_size)
      const total = 60
      page_no = Number(page_no)
      page_size = Number(page_size)
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
    },
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    }
  }
}
</script>

<style lang="scss" scoped>
.states-list {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: 12px;
  padding-bottom: 2px;
  // span {
  // &+span {
  //   margin-left: 10px;
  // }
  // }
}
</style>
