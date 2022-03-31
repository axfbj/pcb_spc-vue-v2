<template>
  <ki-dialog
    :visible="visible"
    title="多项目输入"
    v-bind="$attrs"
    top="2vh"
    width="70%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <div class="box-content1">
        <div class="custum-table">
          <div class="custum_col">
            <div class="head-style">规格上线</div>
            <div class="head-style">目标值</div>
            <div class="head-style">规格下线</div>
            <div class="head-style">序号</div>
          </div>

          <template v-for="(row,index) in deep_selectRow">
            <template>
              <div :key="row.id" class="custum_col">
                <div class="head-style">{{ row.usl }}</div>
                <div class="head-style">{{ row.sl }}</div>
                <div class="head-style">{{ row.lsl }}</div>
                <div class="head-style">{{ row.inspectionItemsName }}</div>
              </div>
            </template>
            <div v-if="index === deep_selectRow.length - 1" :key="`poinit_${index}`" class="t">
              <div v-for="item in commonPoint" :key="item.id" class="custum_col">
                <div v-for="num in 3" :key="`a_${num}`" class="head-style">-</div>
                <div class="head-style">{{ item.hierarchicalName }}</div>
              </div>
            </div>

            <div v-if="index === deep_selectRow.length - 1" :key="`createuser_${index}`" class="custum_col">
              <div v-for="num in 3" :key="`a_${num}`" class="head-style">-</div>
              <div class="head-style">录入用户</div>
            </div>

            <div v-if="index === deep_selectRow.length - 1" :key="`time1_${index}`" class="custum_col">
              <div v-for="num in 3" :key="`b_${num}`" class="head-style time-style">-</div>
              <div class="head-style time-style">抽检时间</div>
            </div>
            <div v-if="index === deep_selectRow.length - 1" :key="`time2_${index}`" class="custum_col">
              <div v-for="num in 3" :key="`c_${num}`" class="head-style time-style">-</div>
              <div class="head-style time-style">录入时间</div>
            </div>
          </template>
        </div>

        <div class="box-content3" :style="{width: 120 + (deep_selectRow.length * 120) + 540 + commonPoint.length * 120 + 'px' } ">
          <div class="custum-table">
            <div class="custum_col">
              <div v-for="item in list_num" :key="`serial_${item}`" class="head-style">
                {{ item }}
              </div>
            </div>
            <template v-for="(row,index) in deep_selectRow">
              <template>
                <div :key="row.id" class="custum_col">
                  <div v-for="num in list_num" :key="`value_${num}`" class="cell-style">
                    <el-input-number v-if="row.sampleSize - (num - (Math.ceil(num / maxSampleSize) - 1) * maxSampleSize) < 0" disabled :controls="false" />
                    <el-input-number v-else v-model="row['inspectData'][Math.ceil(num / maxSampleSize) - 1][`value${num - (Math.ceil(num / maxSampleSize) - 1) * maxSampleSize}`]" :controls="false" @change="value_change(Math.ceil(num / maxSampleSize) - 1,...arguments)" />
                  </div>
                </div>
              </template>
              <!-- commonPoint -->
              <div v-if="index === deep_selectRow.length - 1" :key="`poinit_${index}`" class="t">
                <div v-for="item in commonPoint" :key="item.id" class="custum_col">
                  <template v-for="num in list_num">
                    <div v-if="(num / maxSampleSize) % 1 === 0" :key="`create_${num}`" class="cell-style">
                      <allow-create-select
                        v-model="hTypeArr[Math.ceil(num / maxSampleSize) - 1][`hierarchicalTypeValue${parseNum[item.serialNumber]}`]"
                        style="width:100%"
                        :props="keywordProps"
                        :options="options[`hierarchicalType${item.serialNumber}`]"
                        @focus="getHierarchicalType(item.id)"
                        @change="hierarchicalTypeValueChange(Math.ceil(num / maxSampleSize) - 1,`hierarchicalTypeValue${parseNum[item.serialNumber]}`,item.id,...arguments)"
                      />
                    </div>
                    <div v-else :key="num" class="head-style">-</div>
                  </template>
                </div>
              </div>

              <div v-if="index === deep_selectRow.length - 1" :key="`createuser_${index}`" class="custum_col">
                <template v-for="num in list_num">
                  <div v-if="(num / maxSampleSize) % 1 === 0" :key="`create_${num}`" class="cell-style">
                    {{ username }}
                  </div>
                  <div v-else :key="num" class="head-style">-</div>
                </template>
              </div>

              <div v-if="index === deep_selectRow.length - 1" :key="`time1_${index}`" class="custum_col">
                <template v-for="num in list_num">
                  <div v-if="(num / maxSampleSize) % 1 === 0" :key="`inTime_${num}`" class="cell-style time-style">
                    <el-date-picker
                      v-model="timeArr[Math.ceil(num / maxSampleSize) - 1]['inspectionDate']"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    />
                  </div>
                  <div v-else :key="num" class="head-style time-style">-</div>
                </template>
              </div>
              <div v-if="index === deep_selectRow.length - 1" :key="`time2_${index}`" class="custum_col ">
                <template v-for="num in list_num">
                  <div v-if="(num / maxSampleSize) % 1 === 0" :key="`createTime_${num}`" class="cell-style time-style">
                    <el-date-picker
                      v-model="timeArr[Math.ceil(num / maxSampleSize) - 1]['createDate']"
                      type="datetime"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    />
                  </div>
                  <div v-else :key="num" class="head-style time-style">-</div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'loadsh'
import multiple_entry from './mixins/multiple-entry'
import { AllowCreateSelect } from '@/components/form-item'
export default {
  name: 'MultipleEntryDialog',
  components: {
    AllowCreateSelect
  },
  mixins: [multiple_entry],
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
      maxSampleSize: 0,
      deep_selectRow: [],
      input_row_number: 0
    }
  },
  computed: {
    ...mapGetters([
      'hierarchicalTypes',
      'userId',
      'username',
      'commonVariable'
    ]),
    list_num() {
      return this.maxSampleSize * this.input_row_number
    },
    parseNum() {
      return this.commonVariable['parseNum']
    }
  },
  created() {

  },
  methods: {
    clean() {
      this.maxSampleSize = 0
      this.deep_selectRow = []
      this.input_row_number = 0
      this.hTypeArr = []
      this.timeArr = []
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      const param = this.getSaveParams()
      const arr = []
      if (!param) return
      loading(true)
      param.forEach(item => {
        const r = this.$api.inspectionRecord_save(item)
        arr.push(r)
      })
      Promise.all(arr).then(res => {
        const success = res.every(r => r.code === '200')
        if (success) {
          this.$emit('confirm')
        }
        loading(false)
      }).catch(reason => {
        loading(false)
      })
    },
    async add(loading) {
    },
    async update(loading) {
    },
    async open({ load }) {
      const ids = this.selectRow.map(row => row.id)
      const { code, data } = await load(() => this.$api.controlChartSon_infos(ids))
      if (code === '200' && data) {
        // this.deep_selectRow = _.cloneDeep(this.selectRow)
        this.deep_selectRow = []
        this.maxSampleSize = _.maxBy(this.selectRow, 'sampleSize')['sampleSize']
        data.forEach((item, index) => {
          this.deep_selectRow[index] = {
            // ...this.deep_selectRow[index],
            ...item
          }
        })
        this.input_row_number = 1
      }
    },
    closed() {
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>
.box-content1 {
  overflow-x: auto;
}
.box-content3 {
  height: 60vh;
  overflow-x: visible;
  overflow-y: auto;
    .custum-table {
      &:last-child {
      .custum_col {
        > div {
          &:first-child {
            border-top-width: 0px;
          }
        }
      }
    }
  }
}
.t {
  display: flex;
  flex-direction: row;
  .custum_col {
      &:first-child {
        border-left-width: 0px !important;
      }
  }
}
.custum-table {
  display: flex;
  flex-direction: row;
  .custum_col {
    display: flex;
    flex-direction: column;
       &:first-child {
        border-left: 1px solid #ccc;
      }
    > div {
      padding: 0 5px;
      width: 120px;
      height: 38px;
      border: 1px solid #ccc;
      border-bottom-width: 0px;
      border-left-width: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:last-child {
        border-bottom-width: 1px;
      }
    }
    .head-style {
      font-weight: 800;
    }
    .cell-style {
     font-weight: normal;
    }
    .time-style {
      width: 200px;
    }
  }
}

</style>
