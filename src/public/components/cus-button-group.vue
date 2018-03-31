<template>
  <div class="cus-group-container">
    <div class="cus-group-button co-flex co-jc">
      <slot></slot>
    </div>
  </div>
</template>

<script type="es6">
  export default {
    name: 'cus-button-group'
  };
</script>

<style lang="scss">
  .readonly, .disable {
    .cus-group-container {
      height: 0;
    }
  }
  .cus-group-container {
    height: 2rem;

    div.cus-group-button {
      position: fixed;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      background-color: #fbfbfb;
      /*padding: 0 .8rem;*/

      a, button {
        /*max-width: 7rem;*/
        flex: 1;
        border-radius: 0;
        /*margin: .3rem .8rem;*/

        &.mint-button {
          height: 2rem;
          font-size: $font-size-default;
         /*padding: 0 6px;*/
        }
      }
    }
  }
</style>
