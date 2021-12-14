<template>
  <div slot="empty" class="bonus-back" style="margin-top: 15px;">
    <img src="@/assets/empty.png">
    <div style="font-size: 16px;font-weight: bold;top: 10px;color:#9EA1A6">暂无数据</div>
  </div>
</template>

<style lang="scss" >

  .bonus-back {
    height: 256px;
    width: 280px;
    position: absolute;
    left: 50%;
    top: 48%;
    margin-left: -140px;           /***浮动层宽度的一半****/
    margin-top: -128px;            /***浮动层高度的一半****/
    z-index: 99999;                /***浮动在img之上***/
    text-align: center;
    }
</style>
