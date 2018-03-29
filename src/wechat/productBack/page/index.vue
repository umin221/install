<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="配件退入">
      <fallback slot="left"></fallback>
      <router-link to="add" slot="right">
        <mt-button >
          <i class="xs-icon icon-add"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">待处理</mt-tab-item>
        <mt-tab-item id="valid">处理中</mt-tab-item>
        <mt-tab-item id="invalid">已完成</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending" :loadTop="pendingLoadTop" :loadBottom="pendingLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <cus-cell
              class="multiple border-bottom"
              :title="'领用编号'+ item.No"
              v-for="(item,index) in isSelect"
              :key="index"
              is-link>
              <div class="mint-cell-sub-title" slot="title">领用人: {{item.name}}</div>
              <div class="mint-cell-sub-title" slot="title">申请领用日期: {{item.num}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="valid">
          <loadmore ref="valid" :loadTop="validLoadTop" :loadBottom="validLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div v-for="(item,index) in isSelect" :key="index">
              <cus-cell
                class="multiple"
                :title="'领用编号'+ item.No"
                v-for="(item,index) in isSelect"
                :key="index"
                is-link>
                <div class="mint-cell-sub-title" slot="title">领用人: {{item.name}}</div>
                <div class="mint-cell-sub-title" slot="title">申请领用日期: {{item.num}}</div>
              </cus-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="invalid">
          <loadmore ref="invalid" :loadTop="invalidLoadTop" :loadBottom="invalidLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div v-for="(item,index) in isSelect" :key="index">
              <cus-cell
                class="multiple"
                :title="'领用编号'+ item.No"
                v-for="(item,index) in isSelect"
                :key="index"
                is-link>
              <div class="mint-cell-sub-title" slot="title">领用人: {{item.name}}</div>
                <div class="mint-cell-sub-title" slot="title">申请领用日期: {{item.num}}</div>
              </cus-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script type="application/javascript">
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  //
  const NameSpace = 'index';

  export default {
    name: NameSpace,
    created() {
      for (let i = 0; i < 10; i++) {
        let obj = {name: '伟江', num: '2018-03-08 20:00:00', type: '维修配件', No: '1-SDSADAA2'};
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
      toDateil(name) {
        this.$router.push({
          name: 'detail',
          query: {
            id: name
          }
        });
      },
      pendingLoadTop() {
      },
      pendingLoadBottom() {
      },
      validLoadTop() {
      },
      validLoadBottom() {
      },
      invalidLoadTop() {
      },
      invalidLoadBottom() {
      }
    },
    components: {loadmore, cusCell}
  };
</script>
<style lang="scss">
  .productForm{
    line-height: 1.5rem;
  }
  .border-bottom{
    border-bottom: 1px solid #dcdcdc;
  }
</style>
