<template>
  <div>
    <mt-header fixed title="我的安装订单">
      <fallback slot="left"></fallback>
      <mt-button icon="search" slot="right" @click.native="searchKey = true"></mt-button>
    </mt-header>
    <div class="mint-content">
      <div class="page-search" v-show="searchKey">
        <mt-search autofocus placeholder="请输入项目名称或负责人" @keyup.enter.native="search" cancel-text="取消" v-model="searchValue" :result.sync="filterResult"></mt-search>
      </div>
      <mt-navbar class="page-part" v-model="selected">
        <mt-tab-item id="1">待处理</mt-tab-item>
        <mt-tab-item id="2">处理中</mt-tab-item>
        <mt-tab-item id="3">已完成</mt-tab-item>
      </mt-navbar>
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

<script type="application/javascript">
  // import api from '../api/api';
  import loadmore from 'public/components/cus-loadmore';
  import {mapState, mapActions} from 'vuex';
  import { Toast } from 'mint-ui';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      for (var i = 0; i < 10; i++) {
        this.list.push(i);
      }
    },
    data: () => {
      return {
        active: 'tab-container1',
        searchKey: false,
        searchValue: '',
        selected: '1',
        allLoaded: '',
        topStatus: '',
        list: []
      };
    },
    computed: {
      ...mapState(NameSpace, ['value']),
      filterResult() {
        console.dir(this.searchValue);
        // return this.defaultResult.filter(value => new RegExp(this.value, 'i').test(value));
      }
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      search() {
        Toast(this.searchValue);
      },
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
<style>
  .mint-search {
    height: 8vh!important;
  }
  .list-img {
    color: #A2BBFC;
  }
</style>
