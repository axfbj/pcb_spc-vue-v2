<template>
  <!-- <div style="display: inline-block;"> -->
  <div style="display: inline-block;">
    <!-- <select-factory v-if="type==='select-factory'" :extra="extra" :data="value" :disabled="disabled" @change="(v)=>$emit('change', v)" /> -->
    <!-- <select-type v-else-if="type==='select-type'" :extra="extra" :data="value" :disabled="disabled" @change="(v)=>$emit('change', v)" /> -->
    <div>
      <div v-if="!$slots.default" class="el-select" style="width:100%;">
        <div v-if="multiple" class="el-select__tags" style="max-width: calc(100% - 32px);">
          <el-scrollbar ref="scrollbar" style="height:100%">
            <span style="white-space:nowrap; display:inline-bloack;" @click.native="open()">
              <el-tag v-for="(tag,index) in value" :key="tag.doccode" closable size="small" type="info" disable-transitions @close="close(index)">
                {{ render_title(tag) }}
              </el-tag>
            </span>
          </el-scrollbar>
        </div>
        <div v-else class="el-select__tags" style="max-width: calc(100% - 32px);">
          <el-scrollbar ref="scrollbar" style="height:100%">
            <span>
              <el-tag v-if="JSON.stringify(value) !== '{}' && render_title() !== ''" closable size="small" type="info" disable-transitions color="transparent" style="border-color: transparent" @close="close()">
                {{ render_title() }}
              </el-tag>
            </span>
          </el-scrollbar>
        </div>
        <el-input
          ref="select_input"
          :readonly="true"
          :disabled="disabled"
          suffix-icon="el-icon-more"
          @focus="open"
          @click.native="open"
        />
      </div>

      <div v-if="$slots.default" @click="click_open($event)" @focus="click_open">
        <slot />
      </div>

      <!-- 模板 -->
      <inspection-items v-if="type==='inspection-items'" :display="dialog_display && type==='inspection-items'" :data="transfer_data" :title="title" :extra="extra" @add-close="dialog_display= false" @add-sure="(v)=>$emit('change', v)" />
      <!-- 检测项目 -->
      <select-dialog-template v-if="type==='select-dialog-template'" :display="dialog_display && type==='select-dialog-template'" :data="transfer_data" :title="title" :extra="extra" @add-close="dialog_display= false" @add-sure="(v)=>$emit('change', v)" />

    </div>

  </div>
</template>

<script>
import SelectDialogTemplate from './select-dialog-template'
import InspectionItems from './inspection-items'

export default {
  name: 'ElReference',
  components: {
    // 模板
    SelectDialogTemplate,
    InspectionItems

  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    /**
     * 引用类型
     */
    type: {
      type: String,
      default: ''
    },
    value: {
      type: [Object, Array],
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: ''
    },
    /**
     * extra参数
      {string | number} custom_title 自定义input框中的内容
     *  */
    extra: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialog_display: false,
      tags_data: [],
      options: [],
      transfer_data: Array.isArray(this.value) ? [] : {}// 用于再open事件中转数据,按钮v-if为false时watch不生效
    }
  },
  computed: {
    multiple() {
      return Array.isArray(this.value)
    },
    render_title() {
      const type = this.type
      return data => {
        let item
        if (!data) {
          item = this.value
        } else {
          item = data
        }
        if (!item) return ''
        let title = ''
        switch (!this.extra.custom_title && type) {
          case 'select-dialog-template':
            title = item.id
            break
          case 'inspection-items':
            title = item.id
            break
          default:
            title = typeof this.extra.custom_title === 'function' ? (this.extra.custom_title(item) || '') : (item[this.extra.custom_title] || '')
            break
        }
        return String(title) || ''
      }
    }
  },

  watch: {
    dialog_display(is_show) {
      this.transfer_data = JSON.parse(JSON.stringify(this.value))
    },
    value() {
      this.$nextTick(() => {
        this.$refs.scrollbar && this.$refs.scrollbar.update()
      })
    }
  },
  methods: {
    is_disable() {
      // TODO: mixins 不知能不能解决
      const inp = this.$refs.select_input.$el.querySelector('.el-input__inner')
      const disabled = inp.getAttribute('disabled')
      if (disabled || this.disabled) {
        return true
      } else {
        return false
      }
    },
    show() {
      this.dialog_display = true
    },
    open() {
      if (!this.is_disable()) {
        this.show()
      }
    },
    click_open(e) {
      if (this.$slots.default[0].elm.disabled) return
      if (!this.$listeners || !this.$listeners['before-open']) {
        this.show()
        return
      }
      this.$emit('before-open', this.show)
    },
    add() {
      this.tags_data.push(new Date().getTime())
      this.$nextTick(function() {
        const tags = this.$el.querySelector('.el-select__tags')
        const inp = this.$refs.select_input.$el.querySelector('.el-input__inner')
        inp.style.height = tags.offsetHeight + 'px'
      })
    },
    close(index) {
      if (!this.is_disable()) {
        if (this.multiple) {
          this.value.splice(index, 1)
          this.$emit('change', this.value)
        } else {
          this.$emit('change', {})
        }
      }
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
