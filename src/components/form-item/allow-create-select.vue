<template>
  <el-select
    v-model="final_value"
    filterable
    allow-create
    default-first-option
    placeholder=""
    @change="change_val(...arguments)"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
