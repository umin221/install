<template>
  <mt-loadmore :bottom-method="loadBottom"
               :bottom-all-loaded="allLoaded"
               :top-method="loadTop"
               :autoFill="false"
               @bottom-status-change="handleBottomChange"
               @top-status-change="handleTopChange"
               ref="loadmore">

    <div slot="top" class="mint-loadmore-top">
      <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
    </div>

    <slot>
      <empty v-show="emptyTips"></empty>
    </slot>

    <div v-show="bottomShow" slot="bottom" class="mint-loadmore-bottom">
      <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
          <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
    </div>
  </mt-loadmore>
</template>

<script type="es6">
  let pageSize = config.pageSize;

  export default {
    name: 'cus-loadmore',
    created() {
      let me = this;
      me.loadTop = me.refresh ? () => this.$emit('loadTop', this.param) : undefined;
      me.loadBottom = me.loadmore ? () => this.$emit('loadBottom', this.param) : undefined;
    },
    data() {
      return {
        topStatus: '',
        bottomStatus: '',
        bottomShow: false,
        allLoaded: false
      };
    },
    props: {
      param: '',
      emptyTips: {
        type: Boolean,
        default: true
      },
      refresh: {
        type: Boolean,
        default: true
      },
      loadmore: {
        type: Boolean,
        default: true
      }
    }, // ['loadTop', 'loadBottom'],
    methods: {
      handleTopChange(status) {
        this.topStatus = status;
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      onTopLoaded(len = 0) {
        let flag = len < pageSize;
        this.$refs.loadmore.onTopLoaded();
        this.allLoaded = flag;
        this.bottomShow = !flag;
      },
      onBottomLoaded(len = 0) {
        let flag = len < pageSize;
        this.$refs.loadmore.onBottomLoaded();
        this.allLoaded = flag;
        this.bottomShow = !flag;
      }
    }
  };
</script>

<style lang="scss">
  .mint-loadmore {
    min-height: 380px;
  }

  .mint-loadmore-top {
    span {
      display: inline-block;
      transition: .2s linear;
      vertical-align: middle;
    }
    span.is-rotate {
      transform: rotate(180deg);
    }
  }

  .mint-loadmore-bottom {
    span {
      display: inline-block;
      transition: .2s linear;
      vertical-align: middle;
    }
    span.is-rotate {
      transform: rotate(180deg);
    }
  }
</style>
