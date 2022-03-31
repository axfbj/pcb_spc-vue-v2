<template>
  <div class="tip-content">
    <el-popover
      placement="bottom-start"
      width="300"
      trigger="hover"
      popper-class="no-space"
    >
      <el-card class="box-card" shadow="never" :body-style="{padding: 0}">
        <div>
          <div v-if="abnormalMessage.size">
            <div v-for="(item,i) in abnormalMessage.data" :key="i" class="text item" @click="toExceptionPage(item)">
              <span>{{ item.inspectionName }}有 <span style="color: #F56C6C;">{{ item.abnormalSize }}</span> 条异常</span>
            </div>
          </div>
          <div v-else style="text-align: center; padding: 10px;">没有未处理的异常</div>
        </div>
      </el-card>
      <div slot="reference">
        <el-badge :value="abnormalMessage.size" class="bells-icon" :hidden="!abnormalMessage.size">
          <i class="el-icon-message-solid" />
        </el-badge>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Tips',
  data() {
    return {
      card_show: false
    //   infoNum: 0
    }
  },
  computed: {
    ...mapGetters(['abnormalMessage'])
  },
  created() {},
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    toExceptionPage(item) {
      const query = {
        controlGroupId: item['controlGroupId'],
        controlChartSonId: item['controlChartSonId']
      }
      this.$router.push({ path: '/statistical-process-control/exception-handling', query })
      if (this.$route.name === 'ExceptionHandling') {
        this.$router.replace({
          path: '/redirect' + this.$route.fullPath
        })
      }
    },
    click() {
    //   this.card_show = !this.card_show
    },
    change() {

    },
    async init() {
      // setInterval(() => {
      //   console.log(2222)
      //   this.$store.commit('test/increment')
      //   this.$store.commit('test2/increment')
      //   console.log(this.$store)
      // }, 2000)
      await this.$store.dispatch('abnormalMessage/changeAbnormalMessage')
      const msg = `你有${this.abnormalMessage.size}个异常信息未处理`
      if (!this.abnormalMessage.size) return
      this.$notify({
        title: '警告',
        message: msg,
        type: 'warning',
        position: 'bottom-left'
      })
    },
    destroy() {

    }
  }
}
</script>

<style lang="scss" scope>

.no-space{
    margin: 0 !important;
    padding: 0;
}

.bells-icon {
    height: auto;
    display: inline;
    padding: 1px 1px 0 0;
}
  .text {
    font-size: 14px;
  }

  .item {
    // margin-bottom: 18px;
    padding: 10px 10px;
  }
  .item:hover {
    // margin-bottom: 18px;
    background-color: #e5e2e2;
    cursor: pointer;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 100%;
  }
</style>
