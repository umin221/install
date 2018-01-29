<template>
  <div>
    <mt-header fixed title="loading">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <loadmore :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" ref="load">
        <mt-cell v-for="{item, index} in list" :key="index" is-link>
          <div slot="title">合作伙伴名称</div>
          <div>恒通安装公司</div>
          <div slot="title">合作伙伴负责人</div>
          <div>李立三 07100028</div>
          <div slot="title">联系电话</div>
          <div>18688889999</div>
        </mt-cell>
      </loadmore>
    </div>

  </div>
</template>

<script type="es6">
  import loadmore from 'public/components/cus-loadmore';

  export default {
    name: 'loading',
    created() {
      for (var i = 0; i < 10; i++) {
        this.list.push(i);
      }
    },
    data() {
      return {
        allLoaded: '',
        topStatus: '',
        list: []
      };
    },
    methods: {
      loadTop() {
        let me = this;
        setTimeout(function() {
          for (var i = 5; i > 0; i--) {
            me.list.unshift(i);
          }
          me.$refs.load.onTopLoaded();
        }, 1000);
      },
      loadBottom() {
        let me = this;
        setTimeout(function() {
          if (me.list.length < 50) {
            for (var i = 5; i > 0; i--) {
              me.list.push(i);
            }
          } else {
            me.$refs.load.allLoaded = true;
          }
          me.$refs.load.onBottomLoaded();
        }, 1000);
      }
    },
    components: {
      loadmore
    }
  };
</script>
