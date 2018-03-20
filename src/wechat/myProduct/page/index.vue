<template>
  <div style="background-color: #ebebeb;">
    <cus-header fixed title="我的配件" :menu="[{title:'查看我的团队', key:'a'}]">
      <fallback slot="left"></fallback>
      <router-link to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </cus-header>
    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">配件库</mt-tab-item>
        <mt-tab-item id="valid">不良库</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending" :loadTop="pendingLoadTop" :loadBottom="pendingLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <cus-cell
              :title="'配件型号'+item.No"
              v-for="(item,index) in isSelect"
              :key="index">
              <div class="productForm" slot="title">配件名称： {{item.name}}</div>
              <div class="productForm" slot="title">库存量： {{item.num}}</div>
              <div class="productForm" slot="title" >配件类型：{{item.type}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="valid">
          <loadmore ref="valid" :loadTop="validLoadTop" :loadBottom="validLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <cus-cell
              :title="'配件型号'+item.No"
              v-for="(item,index) in isSelect"
              :key="index">
              <div class="productForm" slot="title">配件名称： {{item.name}}</div>
              <div class="productForm" slot="title">库存量： {{item.num}}</div>
              <div class="productForm" slot="title" >配件类型：{{item.type}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script type="application/javascript">
  import cusHeader from 'public/components/cus-header';
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  //
  const NameSpace = 'index';

  export default {
    name: NameSpace,
    created() {
      for (let i = 0; i < 10; i++) {
        let obj = {name: 'SRR0201712160002', num: '110', type: '维修配件', No: '1-SDSADAA2'};
        this.isSelect.push(obj);
      }
    },
    data: () => {
      return {
        selected: 'pending',
        topStatus: '',
        isSelect: []
      };
    },
    computed: {
    },
    methods: {
      menuFn(item) {
        console.log(item);
      },
      pendingLoadTop() {
      },
      pendingLoadBottom() {
      },
      validLoadTop() {
      },
      validLoadBottom() {
      }
    },
    components: {loadmore, cusHeader, cusCell}
  };
</script>
<style lang="scss">
  .productForm{
    line-height: 1.5rem;
  }
</style>
