<template>
  <el-select
    v-model="final_value"
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
    value: {
      type: String,
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
  data() {
    return {
      internal_value: this.value || ''
    }
  },
  computed: {
    final_value: {
      get() {
        return this.internal_value
      },
      set() {}
    }

  },
  methods: {
    change_val(val) {
      this.internal_value = val
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
