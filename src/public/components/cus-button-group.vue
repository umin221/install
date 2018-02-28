<template>
  <div class="cus-group-button">
    <slot></slot>
  </div>
</template>

<script type="es6">
	export default {
		name: 'cus-button-group'
	};
</script>

<style lang="scss">
  div.cus-group-button {
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: #fbfbfb;

    button {
      &.single {
        width: 60%;
        margin: .3rem 20%;
      }

      &.mint-button {
        height: 1.8rem;
      }
    }
  }
</style>
