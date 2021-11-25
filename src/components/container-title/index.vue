<template>
  <div class="koimy-main-title">
    <slot />
  </div>
</template>

<script>

export default {
  props: {

  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss">
.koimy-main-title {
  height: 38px;
  // background: rgb(217,232,255);
  background: #dfdfdf;
  color: #606266;
  // display: flex;
  // align-items: center;
  line-height: 38px;
  :not(:last-child).el-button-group {
    border-right: 1px solid #fff !important;
    border-width: 50%;
  }
}
</style>

