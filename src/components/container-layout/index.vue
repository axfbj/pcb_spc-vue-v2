<template>
  <div class="koimy-main-container">
    <div class="koimy-main-header">
      <container-title
        v-if="$slots.btns"
        style="padding: 0 10px;"
      >
        <slot name="btns" />
      </container-title>

      <el-form
        inline
        size="mini"
        label-position="left"
      >
        <slot name="form" />
      </el-form>
    </div>
    <!-- <div>{{ show_loading }}</div> -->
    <div
      v-if="$slots.custum_content"
      ref="content_box"
      class="content_box"
      :style="{height: typeof(content_height) === 'string'? content_height : content_height + 'px',overflow:'auto'}"
    >
      <div
        ref="content_body"
        :style="{height: typeof(content_height2) === 'string'? content_height2 : content_height2 + 'px',overflow:'auto'}"
      >
        <slot name="custum_content" />
      </div>
      <div
        v-if="$slots.footer && footer"
        ref="footer"
        class="footer"
        :style="{height: typeof(footer_height) === 'string'? footer_height : footer_height + 'px',paddingTop: '4px'}"
      >
        <div v-if="adjustableHeight" class="line-div-box">
          <div ref="lineDiv" class="lineDiv" style="top: 0" @mousedown="line_down($event)" />
        </div>
        <div style="height: 100%; overflow: auto;">
          <slot name="footer" />
        </div>
      </div>
    </div>
    <slot />
    <div
      v-if="$slots.main_footer"
      ref="main_footer"
      class="koimy-main-footer"
    >
      <slot name="main_footer" />
    </div>
  </div>
</template>

<script>
import ContainerTitle from '@/components/container-title'
import table_select from '@/mixins/table-select'

export default {
  name: 'ContainerLayout',
  components: {
    ContainerTitle
  },
  mixins: [table_select],
  props: {
    autoInit: {
      type: Boolean,
      default: true
    },
    footer: {
      type: Boolean,
      default: true
    },
    footerHeight: {
      type: [String, Number],
      default: 'auto'
    },
    adjustableHeight: {
      type: Boolean,
      default: false
    },
    fixedHeight: {
      type: [Number, String],
      default: 0
    },
    afterCalc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      content_height: '100%',
      content_height2: '100%',
      table_height: '100%',
      footer_height: 'auto',
      // x: 0,
      y: 0,
      // l: 0,
      t: 0,
      isDown: false,
      move_num: 0
    }
  },
  watch: {
    '$store.state.trigger.triggerRandom': {
      handler() {
        // 处于活跃状态,重新计算高度
        !this._inactive && this.reset_height()
      }
    }
  },
  mounted() {
    this.footer_height = this.footerHeight
    this.refresh_flag = setTimeout(() => {
      this.autoInit && this.request_data()
      this.refresh_flag = true
    }, 0)
  },
  activated() {
    if (typeof this.refresh_flag === 'number') {
      clearTimeout(this.refresh_flag)
      this.refresh_flag = true
    }
    this.autoInit && this.refresh({ keep: true })
  },
  methods: {
    line_down(e) {
      const dv = e.target
      // 获取x坐标和y坐标
      // this.x = e.clientX
      this.y = e.clientY

      // 获取左部和顶部的偏移量
      // this.l = dv.offsetLeft
      this.t = dv.offsetTop
      // 开关打开
      this.isDown = true
      // 设置样式
      dv.style.cursor = 'n-resize'
      window.onmousemove = (e) => {
        if (!this.isDown) return
        // 获取x和y
        // var nx = e.clientX
        var ny = e.clientY
        // 计算移动后的左偏移量和顶部的偏移量
        // var nl = nx - (this.x - this.l)
        var nt = ny - (this.y - this.t)

        if (nt < 0 && Math.abs(nt) >= this.$refs.content_body.clientHeight - 10) {
          dv.style.top = `-${this.$refs.content_body.clientHeight - 10}px`
        } else if (nt > 0 && Math.abs(nt) >= this.$refs.footer.clientHeight - 10) {
          dv.style.top = `${this.$refs.footer.clientHeight - 10}px`
        } else {
          dv.style.top = nt + 'px'
        }

        // dv.style.left = nl + 'px'

        e.preventDefault()
      }

      window.onmouseup = (e) => {
        if (!this.isDown) return
        this.isDown = false
        dv.style.cursor = 'default'
        this.move_num += parseFloat(dv.style.top)
        const fh = this.move_num > 0 ? '-' : '+'
        this.footer_height = `calc(${this.footerHeight} ${fh} ${Math.abs(this.move_num)}px)`
        dv.style.top = 0
        this.$store.dispatch('trigger/changeRandom')
      }
    },
    line_up(e) {
      // // 开关关闭
      // const dv = e.target
      // this.isDown = false
      // dv.style.cursor = 'default'
      // // console.log(parseFloat(dv.style.top))
      // this.move_num += parseFloat(dv.style.top)
      // const fh = this.move_num > 0 ? '-' : '+'
      // // console.log(`calc(${this.footerHeight} ${fh} ${Math.abs(this.move_num)}px)`)
      // this.footer_height = `calc(${this.footerHeight} ${fh} ${Math.abs(this.move_num)}px)`
      // dv.style.top = 0
      // this.$store.dispatch('trigger/changeRandom')
    },
    reset_height() {
      this.$nextTick(() => {
        this.calc()
      })
    },
    // 重新计算表格的最大高度
    calc() {
      let content_height, content_height2
      if (this.fixedHeight) {
        content_height = this.fixedHeight
        this.$nextTick(() => {
          this.content_height = content_height
          this.afterCalc()
        })
        return
      }
      if (!this.$refs.content_box) return
      if (this.$refs.content_box) {
        content_height = window.innerHeight - this.$refs.content_box.getBoundingClientRect().top
      } else {
        content_height = window.innerHeight - this.$refs.layout_table.getBoundingClientRect().top
      }

      content_height2 = content_height

      if (this.$refs.main_footer) {
        content_height2 -= this.$refs.main_footer.clientHeight
      }
      if (this.$refs.footer) {
        if (this.footer_height !== 'auto') {
          content_height2 = `calc(100% - ${this.footer_height})`
        } else {
          content_height2 = content_height - this.$refs.footer.clientHeight
        }
      }
      this.$nextTick(() => {
        this.content_height = content_height
        this.content_height2 = content_height2
        this.afterCalc()
      })
    }
  }
}
</script>

<style lang="scss">
.content_box {
  position: relative;
  top: 0;
  left: 0;
  .footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    .line-div-box {
      position: absolute;
      top: 0;
      left: 0;
      height: 4px;
      width: 100%;
      z-index: 100;
      background-color: #dcdcdc;
      .lineDiv {
        position: absolute;
        // top: 0;
        left: 0;
        width: 100%;
        z-index: 100;
        // background-color: #dcdcdc;
        background-color: #bdbcbc;
        height: 100%;
        transition: background-color 0.3s;
        &:hover {
          // background-color: #bdbcbc;
          background-color: #878383;
          cursor: n-resize !important;
        }
      }
    }
  }
}

.koimy-main-container {
  position: relative;
  .koimy-main-header {
    .el-form-item {
      // margin: 10px 5px 2px 5px;
      margin: 8px 5px 5px 5px;
    }
  }
  .koimy-main-footer {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 4;
    padding-top: 5px;
    background-color: #fff; // rgb(245,245,245);
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
</style>

