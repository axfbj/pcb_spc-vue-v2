<template>
  <span class="round-shape" :style="{backgroundColor: backgroundColor,verticalAlign:'middle'}" />
</template>

<script>
export default {
  name: 'RoundShape',
  props: {
    state: {
      type: String,
      default: '0'
    }
  },
  computed: {
    backgroundColor() {
      const bcColors = {
        '0': '#fff',
        '1': '#D9001B',
        '2': '#4B7902'
      }
      return bcColors[this.state]
    }
  }
}
</script>

<style lang="scss" scoped>
.round-shape {
	display: inline-block;
	width: 18px;
	height: 18px;
	border: 1px solid #000;
	border-radius: 50%;
}
</style>
