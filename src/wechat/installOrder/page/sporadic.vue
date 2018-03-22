<template>
  <div>
    <mt-header fixed title="真锁安装">
      <fallback slot="left"></fallback>
      <mt-button slot="right" @click.native="submit">提交</mt-button>
    </mt-header>
    <div class="mint-content">
      <mt-cell v-for="item in list" :key="item.id" is-link @click.native="scavenging">
        <div slot="title" class="list-text"><span>产品型号:</span><span>{{item.code}}</span></div>
        <div slot="title" class="list-text"><span>产品条形码:</span><span>{{item.savrsNo}}</span></div>
        <div slot="title" class="list-text"><span></span><span>{{item.name}}</span></div>
      </mt-cell>
      <button-group>
        <mt-button class="single"
                   @click.native="scavenging">扫码安装</mt-button>
      </button-group>
    </div>
  </div>
</template>

<script type="application/javascript">
  // import api from '../api/api';
  import buttonGroup from 'public/components/cus-button-group';
  import {mapState, mapActions} from 'vuex';
  import { Toast } from 'mint-ui';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
    },
    data: () => {
      return {
        searchKey: false,
        searchValue: '',
        selected: '1',
        allLoaded: '',
        topStatus: '',
        list: [
          {id: '1', code: 'SZ100', savrsNo: 'AZ201706010001001', name: 'XXXXXXX'},
          {id: '2', code: 'SZ200', savrsNo: 'AZ201706010001002', name: 'ZZZZZZ'},
          {id: '3', code: 'SZ300', savrsNo: 'AZ201706010001003', name: 'QQQQQQQ'}
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      submit() {
        Toast('提交');
      },
      scavenging() {
        var self = this;
        self.$router.push('scanCode');
      }
    },
    components: {buttonGroup}
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
