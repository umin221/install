<template>
  <div class="cus-cell">
    <div class="co-flex co-jt">
      <div class="cus-title co-f2" v-text="title"></div><slot name="after"></slot>
    </div>
    <mt-cell :to="to"
          :icon="icon"
          :label="label"
          :isLink="isLink"
          :value="value">
      <slot name="title" slot="title"></slot>
    </mt-cell>
  </div>
</template>

<script type="es6">
  export default {
    name: 'cus-cell',
    props: {
      to: [String, Object],
      icon: String,
      title: String,
      label: String,
      isLink: Boolean,
      value: {}
    }
  };
</script>

<style lang="scss">
  .cus-cell {
    position: relative;
    margin: 10px;
    padding: 10px;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    font-size: $font-size-default;

    .cus-title {
      padding-bottom: 10px;
      color: $black-base;
    }

    .mint-cell {
      @include border(top);

      .mint-cell-wrapper {
        padding: 0;
      }
    }

    &::after {
      background-color: #000;
      content: " ";
      opacity: 0;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      position: absolute;
      content: " ";
    }

    &:active::after {
      opacity: .1;
    }
  }
</style>
