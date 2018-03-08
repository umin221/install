<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="我的配件">
      <fallback slot="left"></fallback>
      <router-link to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">配件库</mt-tab-item>
        <mt-tab-item id="valid">不良库</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending" :loadTop="pendingLoadTop" :loadBottom="pendingLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div v-for="(item,index) in isSelect" :key="index">
              <mt-cell>
                <div class="productForm" slot="title" >配件型号:{{item.No}}<span>{{item.type}}</span></div>
                <div class="productForm" slot="title">配件名称: {{item.name}}</div>
                <div class="productForm" slot="title">库存量: {{item.num}}</div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="valid">
          <loadmore ref="valid" :loadTop="validLoadTop" :loadBottom="validLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div v-for="(item,index) in isSelect" :key="index">
              <mt-cell>
                <div class="productForm" slot="title" >配件型号:<span>{{item.type}}</span></div>
                <div class="productForm" slot="title">配件名称: {{item.name}}</div>
                <div class="productForm" slot="title">库存量: {{item.num}}</div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script type="application/javascript">
  import loadmore from 'public/components/cus-loadmore';
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
      pendingLoadTop() {
      },
      pendingLoadBottom() {
      },
      validLoadTop() {
      },
      validLoadBottom() {
      }
    },
    components: {loadmore}
  };
</script>
<style lang="scss">
  .productForm{
    line-height: 1.5rem;
  }
</style>
