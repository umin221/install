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

    <slot></slot>

    <div slot="bottom" class="mint-loadmore-bottom">
      <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span>
          <span v-show="bottomStatus === 'loading'">
            <mt-spinner type="snake"></mt-spinner>
          </span>
    </div>
  </mt-loadmore>
</template>

<script type="es6">
	export default {
		name: 'cust-loadmore',
    data() {
      return {
        topStatus: '',
        bottomStatus: '',
        allLoaded: false
      };
    },
		props: ['loadTop', 'loadBottom'],
		methods: {
      handleTopChange(status) {
        this.topStatus = status;
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      onTopLoaded() {
        this.$refs.loadmore.onTopLoaded();
      },
      onBottomLoaded(hasmore = true) {
        this.$refs.loadmore.onBottomLoaded();
        this.allLoaded = hasmore;
      }
		}
	};
</script>

<style lang="scss">
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
