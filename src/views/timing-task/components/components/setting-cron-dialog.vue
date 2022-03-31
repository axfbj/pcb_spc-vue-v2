<template>
  <ki-dialog
    v-bind="$attrs"
    :visible="visible"
    title="定时任务"
    top="5vh"
    width="70%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="秒" name="second">
          <second ref="second" @get-result="get_result" />
        </el-tab-pane>
        <el-tab-pane label="分" name="minute">
          <minute ref="minute" @get-result="get_result" />
        </el-tab-pane>
        <el-tab-pane label="时" name="hour">
          <hour ref="hour" @get-result="get_result" />
        </el-tab-pane>
        <el-tab-pane label="日" name="day">
          <day ref="day" @get-result="get_result" />
        </el-tab-pane>
        <el-tab-pane label="月" name="month">
          <month ref="month" @get-result="get_result" />
        </el-tab-pane>
        <el-tab-pane label="周" name="week">
          <week ref="week" @get-result="get_result" />
        </el-tab-pane>
        <el-tab-pane label="年" name="year">
          <year ref="year" week @get-result="get_result" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div style="padding: 10px 40px;">

      <el-descriptions title="表达式" direction="vertical" :column="8" border>
        <el-descriptions-item label="">表达式字段</el-descriptions-item>
        <el-descriptions-item label="秒">
          <el-input v-model="form.second" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="分钟">
          <el-input v-model="form.minute" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="小时">
          <el-input v-model="form.hour" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="日">
          <el-input v-model="form.day" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="月">
          <el-input v-model="form.month" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="星期">
          <el-input v-model="form.week" readonly />
        </el-descriptions-item>
        <el-descriptions-item label="年">
          <el-input v-model="form.year" readonly />
        </el-descriptions-item>
      </el-descriptions>
      <br>
      <el-form label-width="95px">
        <el-form-item label="Cron 表达式">
          <el-input v-model="input1" />
        </el-form-item>
      </el-form>
    </div>

  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import second from './second'
import minute from './minute'
import hour from './hour'
import day from './day'
import month from './month'
import week from './week'
import year from './year'
export default {
  name: 'AddTaskDialog',
  components: {
    second,
    minute,
    hour,
    day,
    month,
    week,
    year
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      activeName: 'second',
      result: '* * * * * ?'.split(' '),
      input1: '* * * * * ?',
      form: {},
      form_data: {
        second: '*',
        minute: '*',
        hour: '*',
        day: '*',
        month: '*',
        week: '?',
        year: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'username'
    ])
  },
  created() {
    Object.freeze(this.form_data)
    this.form = JSON.parse(JSON.stringify(this.form_data))
  },
  methods: {
    get_result({ type, result }) {
      // console.log({ type, result })
      const types = {
        'second': 0,
        'minute': 1,
        'hour': 2,
        'day': 3,
        'month': 4,
        'week': 5,
        'year': 6
      }
      this.result[types[type]] = result
      this.form[type] = result
      this.input1 = this.result.join(' ')
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    clean() {
      this.form = JSON.parse(JSON.stringify(this.form_data))
      this.result = '* * * * * ?'.split(' ')
      this.input1 = '* * * * * ?'
      const comp = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
      comp.forEach(item => {
        this.$refs[item] && this.$refs[item].clean()
      })
      this.activeName = 'second'
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm() {
      this.$emit('confirm', this.input1)
    },
    async open({ load }) {
    },
    closed() {
      this.clean()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
