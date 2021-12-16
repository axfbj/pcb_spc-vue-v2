<template>
  <span class="round-shape" :style="{backgroundColor: backgroundColor,verticalAlign:'middle',width:`${size}px`,height: `${size}px`}" />
</template>

<script>
export default {
  name: 'RoundShape',
  props: {
    size: {
      type: Number,
      default: 18
    },
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
	border: 1px solid #000;
	border-radius: 50%;
}
</style>
