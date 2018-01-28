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

<style>
    .icon1::before {
      font-family: "mintui";
      content: '\E601';
      font-size: 20px;
    }

    .icon2::before {
      font-family: "mintui";
      content: '\E602';
      font-size: 20px;
    }

    .icon3::before {
      font-family: "mintui";
      content: '\E603';
      font-size: 20px;
    }
    .icon4::before {
      font-family: "mintui";
      content: '\E604';
      font-size: 20px;
    }
    .icon5::before {
      font-family: "mintui";
      content: '\E605';
      font-size: 20px;
    }
    .icon6::before {
      font-family: "mintui";
      content: '\E606';
      font-size: 20px;
    }
</style>
