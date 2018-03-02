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
        <div  v-for="item in list" :key="item.Id" @click="toDetail(item.Id)">
          <mt-cell is-link >
            <div slot="title" class="list-text"><span>订单编码:</span><span>{{item["Order Number"]}}</span></div>
            <div slot="title" class="list-text"><span>销售类型:</span><span>{{item["KL Delivery Sales Type"]}}</span></div>
            <div slot="title" class="list-text"><span>项目名称:</span><span>{{item["KL Agreement Opportunity Name"]}}</span></div>
          </mt-cell>
        </div>
      </loadmore>
    </div>
  </div>
</template>

<script type="application/javascript">
  // import api from '../api/api';
  import loadmore from 'public/components/cus-loadmore';
  import {mapState, mapActions} from 'vuex';
  import { Toast } from 'mint-ui';
  import api from '../api/api';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      api.get({
        key: 'getList',
        data: {
        },
        success: function(data) {
          console.log(me);
          me.list = data.items;
          console.log(me.list);
        }
      });
    },
    data: () => {
      return {
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
      toDetail(id) { // 详情
        this.$router.push({
          name: 'detail',
          query: {
            id: id
          }
        });
      },
      // 顶部加载
      loadTop() {
      },
      // 底部加载
      loadBottom() {
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
  .list-text {
    line-height: 30px;
  }
</style>
