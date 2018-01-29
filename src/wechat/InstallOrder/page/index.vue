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
    </div>
  </div>
</template>

<script type="application/javascript">
  // import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import { Toast } from 'mint-ui';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      /* api.get({
        key: 'getList',
        callback: function(data) {
          console.log(data);
        }
      });*/
    },
    data: () => {
      return {
        active: 'tab-container1',
        searchKey: false,
        searchValue: '',
        selected: '1'
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
      }
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
