<template>
  <el-row :gutter="24" class="panel-group">
    <el-col :xs="12" :sm="12" :md="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-xr">
          <!-- <svg-icon icon-class="peoples" class-name="card-panel-icon" /> -->
          <span style="font-size: 20px;font-weight:bold;">Xbar-R</span>
        </div>
        <div class="card-panel-description">
          <!-- <div class="card-panel-text">
            控制图数
          </div> -->
          <count-to :start-val="0" :end-val="chartNum.xbarRNum" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <!-- <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col"> -->
    <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-xs">
          <!-- <svg-icon icon-class="message" class-name="card-panel-icon" /> -->
          <span style="font-size: 20px;font-weight:bold;">Xbar-S</span>
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="chartNum.xbarSNum" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>

    <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-mr">
          <span style="font-size: 20px;font-weight:bold;">X-MR</span>
        </div>
        <div class="card-panel-description">

          <count-to :start-val="0" :end-val="chartNum.xmrNum" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-p">
          <span style="font-size: 20px;font-weight:bold;">p</span>
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="chartNum.pnum" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-np">
          <span style="font-size: 20px;font-weight:bold;">np</span>
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="chartNum.npNum" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-u">
          <span style="font-size: 20px;font-weight:bold;">U</span>
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="chartNum.unum" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-c">
          <span style="font-size: 20px;font-weight:bold;">C</span>
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="chartNum.cnum" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="3" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-y">
          <span style="font-size: 20px;font-weight:bold;">Y</span>
        </div>
        <div class="card-panel-description">
          <count-to :start-val="0" :end-val="chartNum.ynum" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      chartNum: {
        xbarRNum: 0,
        xbarSNum: 0,
        xmrNum: 0,
        pnum: 0,
        npNum: 0,
        unum: 0,
        cnum: 0,
        ynum: 0
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      const { code, data } = await this.$api.dashboard_getControlChartType()
      if (code === '200' && data) {
        const { xbarRNum, xbarSNum, xmrNum, pnum, npNum, unum, cnum, ynum } = data
        this.chartNum = {
          xbarRNum: parseInt(xbarRNum),
          xbarSNum: parseInt(xbarSNum),
          xmrNum: parseInt(xmrNum),
          pnum: parseInt(pnum),
          npNum: parseInt(npNum),
          unum: parseInt(unum),
          cnum: parseInt(cnum),
          ynum: parseInt(ynum)
        }
      }
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
@media only screen and (min-width: 1200px) {
  .el-col-lg-4-8 {
      width: 20%;
  }
}

.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-xr {
        background: #40c9c6;
      }

      .icon-xs {
        background: #36a3f7;
      }

      .icon-mr {
        background: #abcb48;
      }

      .icon-p {
        background: #34bfa3
      }
      .icon-np {
        background: #bf6e34
      }
      .icon-c {
        background: #abcb48;
      }

      .icon-u {
        background: #34bfa3
      }
      .icon-y {
        background: #bf6e34
      }
    }

    .icon-xr {
      color: #40c9c6;
    }

    .icon-xs {
      color: #36a3f7;
    }

    .icon-mr {
      color: #abcb48;
    }

    .icon-p {
      color: #34bfa3
    }
    .icon-np {
      color: #bf6e34
    }
    .icon-u {
      color: #abcb48;
    }

    .icon-c {
      color: #34bfa3
    }
    .icon-y {
      color: #bf6e34
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
