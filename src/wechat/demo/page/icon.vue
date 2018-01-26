<template>
  <div>
    <mt-header fixed title="图标库">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <p v-for="i in 100" :class="'icon'+ i">\E60{{i}}</p>
    </div>
  </div>
</template>

<script type="application/javascript">
  export default {
  };
</script>

<style type="sass">

  .mint-content {
    font-family: "mintui" !important;
    .icon1::before {
      content: '\E601';
      font-size: 20px;
    }
  }
</style>
