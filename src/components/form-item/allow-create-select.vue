<template>
  <el-select
    v-model="final_value"
    :disabled="disabled"
    filterable
    allow-create
    clearable
    default-first-option
    placeholder=""
    @change="change_val(...arguments)"
    @focus="focus"
  >
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item[props.label]"
      :value="item[props.value]"
    />
  </el-select>
</template>

<script>
export default {
  name: 'AllowCreateSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    props: {
      type: Object,
      default: () => ({
        value: 'value',
        label: 'label'
      })
    },
    options: {
      type: Array,
      default: () => ([{
        value: 'HTML',
        label: 'HTML'
      }, {
        value: 'CSS',
        label: 'CSS'
      }, {
        value: 'JavaScript',
        label: 'JavaScript'
      }])
    }
  },
  computed: {
    final_value: {
      get() {
        return this.value
      },
      set() {}
    }

  },
  methods: {
    change_val(val) {
      this.$emit('change', val)
    },
    focus(...args) {
      this.$emit('focus', ...args)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
