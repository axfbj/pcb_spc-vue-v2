<template>
  <ki-dialog
    :visible="visible"
    @handleClose="handleClose"
    @confirm="confirm"
  >
    <el-form
      :model="form"
      label-width="auto"
    >
      <el-form-item
        prop="hierarchical_name"
        label="类型名称:"
      >
        <el-input v-model="form.hierarchical_name" />
      </el-form-item>

    </el-form>
  </ki-dialog>
</template>

<script>
export default {
  name: 'EditHierarchicalName',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        hierarchical_name: ''
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
