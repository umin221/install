<template>
  <div class="cus-lock xs-icon" :class="{'icon-add-circle': add}">
    <mt-cell :title="title"
              @click.native="add && clickFn(title)">
    </mt-cell>
    <slot></slot>
  </div>
</template>

<script type="es6">
  let NameSpace = 'cus-lock-row';
  export default {
    name: NameSpace,
    data() {
      return {};
    },
    props: {
      title: String,
      add: Boolean
    },
    methods: {
      clickFn() {
        this.$emit('click');
      }
    }
  };

</script>

<style lang="scss">
  .cus-lock {

    &.icon-add-circle:before {
      position: absolute;
      right: 10px;
      line-height: 48px;
      color: $theme-color;
      z-index: 1;

      @include disable;
    }

    .mint-cell-wrapper {
      font-size: $font-size-small;
    }
  }
</style>
