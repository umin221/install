<template>
    <div class="cus-header"
      :class="{visible:visible}">
      <mt-header fixed class="xs-icon"
                 @click.native="toggleFn"
                 :class="{'icon-arrow-up': hasMenu}"
                 :title="title">
        <slot name="left" slot="left"></slot>
        <slot name="right" slot="right"></slot>
      </mt-header>
      <div class="cus-header-menu"
            v-show="visible">
        <div v-for="m in menu"
             @click="menuFn(m)">{{m.title}}</div>
      </div>
      <div class="cus-overlay"
        @click="visible=false"></div>
    </div>
</template>

<script type="es6">
  export default {
    name: 'cus-header',
    data() {
      return {
        visible: false
      };
    },
    computed: {
      hasMenu() {
        return !!this.menu;
      }
    },
    props: {
      title: String,
      menu: Array
    },
    methods: {
      // toggle menu
      toggleFn(evt) {
        let me = this;
        if (me.hasMenu && evt.target.nodeName === 'H1') {
          me.visible = !me.visible;
        }
      },
      // choose menu
      menuFn(item) {
        let me = this;
        me.$parent.menuFn(item);
        me.visible = false;
      }
    }
  };

</script>

<style lang="scss">
  .cus-header {

    &.visible {
      .mint-header:before {
        -webkit-transform: translateX(-50%) rotate(0deg);
        transform: translateX(-50%) rotate(0deg);
      }

      .cus-overlay {
        display: block !important;
      }
    }

    .mint-header {

      &:before {
        position: absolute;
        bottom: 2px;
        left: 50%;
        font-size: $font-size-small;
        -webkit-transform: translateX(-50%) rotate(180deg);
        transform: translateX(-50%) rotate(180deg);
        transition: transform .4s ease;

        @include disable;
      }

      .mint-header-title {
        line-height: $header-height;
        margin: 0;
      }
    }

    .cus-header-menu {
      position: absolute;
      top: $header-height;
      width: 40%;
      font-size: $font-size-small;
      line-height: 2.1rem;
      color: $place-holder-font;
      background-color: #414143;
      margin: 5px 30%;
      border-radius: 4px;
      text-align: center;
      z-index: 10;

      /*div {*/
      /*@include border;*/
      /*}*/
    }

  }
</style>
