<template>
  <div>
    <mt-header fixed title="loading">
      <fallback slot="left"></fallback>
    </mt-header>

    <div class="mint-content">
      <loadmore :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" ref="load">
        <mt-cell class="multiple" v-for="{item, index} in list" :key="index" is-link>
          <div class="mint-cell-title" slot="title">合作伙伴名称</div>
          <div class="mint-cell-sub-title">恒通安装公司</div>
          <div class="mint-cell-sub-title" slot="title">合作伙伴负责人</div>
          <div class="mint-cell-sub-title">李立三 07100028</div>
          <div class="mint-cell-sub-title" slot="title">联系电话</div>
          <div class="mint-cell-sub-title">18688889999</div>
        </mt-cell>
      </loadmore>
    </div>

  </div>
</template>

<script type="application/javascript">
  import loadmore from 'public/components/cus-loadmore';

  export default {
    name: 'loading',
    // 初始化
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
      // 顶部加载
      loadTop() {
        let me = this;
        setTimeout(function() {
          for (var i = 5; i > 0; i--) {
            me.list.unshift(i);
          }
          me.$refs.load.onTopLoaded();
        }, 1000);
      },
      // 底部加载
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
