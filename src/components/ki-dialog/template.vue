<template>
  <ki-dialog
    :visible="visible"
    title="选项设置"
    v-bind="$attrs"
    width="38%"
    @handleClose="handleClose"
    @confirm="confirm"
    @open="open"
    @closed="closed"
  >
    <div style="padding: 10px 40px;">
      <!--  -->
    </div>
  </ki-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AddInspectionRecordDialog',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'hierarchicalTypes',
      'userId',
      'username'
    ])
  },
  created() {

  },
  methods: {
    clean() {
    },
    handleClose() {
      this.$emit('handleClose')
    },
    async confirm({ loading }) {
      this.$emit('confirm')
    },
    async add(loading) {

    },
    async update(loading) {

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
