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
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: #fbfbfb;
    padding: .3rem .8rem;

    button {
      flex: 1;
      margin: 0 .8rem;

      &.single {
        width: 60%;
        margin: 0 20%;
      }

      &.mint-button {
        height: 1.8rem;
      }
    }
  }
</style>
