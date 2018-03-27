<template>
  <div class="cus-fallback" @click="bind(callback)">
    <mt-button><i class="xs-icon icon-back"><slot></slot></i></mt-button>
	</div>

</template>

<script type="es6">
  export default {
    name: 'cus-fallback',
    props: ['callback', 'transition'],
    methods: {
      bind(callback) {
        let go = this.fallback;
        // If Exists Callback Abort The Router Action And Excute The Callback
        typeof callback === 'function' ? this.callback(go) : go();
      },
      fallback() {
        this.$router.go(-1);
      }
    }
  };
</script>

<style lang="scss">
  .cus-fallback {
    button.mint-button {
      min-width: 1.2rem;
    }
  }
</style>
