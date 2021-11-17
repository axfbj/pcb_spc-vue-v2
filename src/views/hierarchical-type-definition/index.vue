<template>
  <el-row>
    <container-layout v-model="select" :request="request_data" :page-sizes="[60,80,120]" @current-change="current_change" @select="select_callback">
      <!-- 按钮组 -->
      <template v-slot:btns>
        <container-title style="text-align: right;">
          <div>
            <ki-button type="primary" :auto-loading="true" @click="cc(...arguments,111)">修改</ki-button>
            <ki-button type="warning">备选值</ki-button>
          </div>
        </container-title>
      </template>
      <!-- 筛选表单 -->
      <template v-slot:table>
        <el-table-column
          prop="doccode"
          label="层次ID"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.doccode }}
            <!-- <el-link type="primary" @click="click_link"></el-link> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="层次类型名称"
        />
      </template>
      <template v-slot:main_footer>
        1111111111111111
      </template>
    </container-layout>
  </el-row>

</template>

<script>

export default {
  name: 'Test',
  data() {
    return {
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
      // select: [{
      //   doccode: 1
      // }, {
      //   doccode: 22
      // }]
      select: { doccode: 30 }
    }
  },

  methods: {
    cc(loddingEnd, f) {
      // setTimeout(() => {
      //   loddingEnd[0]()
      // }, 1000)
    },
    current_change(val) {
      console.log(val)
    },
    request_data({ page_no, page_size, data }) {
      console.log('------------------', page_no, page_size)
      const total = 166
      const list_num = page_no * page_size < total ? page_size : page_size - (page_no * page_size - total)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: Array(list_num).fill({
              // date: '2016-05-02',
              // name: '王小虎',
              address: '产品型号'
            }).map((i, index) => {
              const doccode = (page_no - 1) * page_size + index + 1
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
    select_callback(data) {
      console.log('select_callback：  ', JSON.stringify(data))
    },
    click_link(data) {
      console.log(data)
    }
  }
}
</script>
