<template>
  <rectangle v-if="show" :state="states[0]" :size="sizes[0]">
    <round-shape :state="states[1]" :size="sizes[1]" />
  </rectangle>
</template>

<script>
import RoundShape from './round-shape'
import Rectangle from './rectangle'

export default {
  name: 'StatusFlag',
  components: {
    RoundShape,
    Rectangle
  },
  props: {
    states: {
      type: Array,
      default: () => (['0', '0'])
    },
    sizes: {
      type: Array,
      default: () => ([22, 14])
    }
  },
  computed: {
    show() {
      return !this.states.includes('-1')
      // return true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
