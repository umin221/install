<template>

</template>

<script type="es6">
  export default {
    name: 'floor-box',
    props: ['Building', 'floor', 'Room'],
    data() {
      return {
        buil: this.building
      };
    },
    methods: {
      change(type) {
        console.log(this.Building);
      }
    }
  };

</script>

<style lang="scss">
  .floor-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 48px;

    input{
      width: 30%;
    }
  }
</style>
