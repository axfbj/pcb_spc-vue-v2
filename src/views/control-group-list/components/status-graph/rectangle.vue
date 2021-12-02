<template>
  <span class="rectangle" :style="{backgroundColor: backgroundColor,verticalAlign:'middle'} ">
    <div class="flex-box">
      <slot />
    </div>
  </span>

</template>

<script>
export default {
  name: 'Rectangle',
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
.rectangle {
	display: inline-block;
	justify-content: center;
	align-items: center;
	width: 22px;
	height: 22px;
	border: 1px solid #000;

	.flex-box {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
	}
}
</style>
