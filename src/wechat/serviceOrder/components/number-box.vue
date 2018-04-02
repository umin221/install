<template>
    <div class="cus-number-box">
      <mt-button
        type="default"
        size="small"
        @click.native="changeFn('minus')">
        <i class="xs-icon icon-minus"></i>
      </mt-button>
      <input type="number" v-model="value" min="1" />
      <mt-button
        type="default"
        size="small"
        @click.native="changeFn('add')">
        <i class="xs-icon icon-add"></i>
      </mt-button>
    </div>
</template>

<script type="es6">
  export default {
    name: 'cus-number',
    props: ['index'],
    data() {
      return {
        value: 1
      };
    },
    methods: {
      changeFn(type) {
        if (type === 'minus' && this.value - 1) {
          this.value = this.value - 1;
        } else if (type === 'add') {
          this.value = this.value + 1;
        }
        this.$emit('input', this.value, this.index, type);
      }
    }
  };

</script>

<style lang="scss">
  .cus-number-box {
    display: flex;
    align-items: center;

    button{
      padding: 0;
      width:1.2rem;
      height: 1.2rem;
      font-weight: bold;
    }
    input{
      width: 1.5rem;
      display: inline-block;
      height: 1rem;
      border: none;
      text-align: center;
    }
  }
</style>
