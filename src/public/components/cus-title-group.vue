<template>
  <div class="cus-group-title">
    <p><slot></slot></p>
  </div>
</template>

<script type="es6">
  export default {
    name: 'cus-title-group'
  };
</script>

<style lang="scss">
  div.cus-group-title {
    margin-top: 10px;
    padding: 15px 10px;
    background: #fff;
    font-size: $font-size-small;
    @include border;

    p {
      margin: 0;
      padding: 0 5px;
      color: $gray-minor;
      border-left: 3px solid $theme-color;
    }
  }


</style>
