<template>
  <div class="cus-lock icon-add-circle xs-icon">
    <mt-cell :title="title"
              @click.native="clickFn(title)">
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
      title: String
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
