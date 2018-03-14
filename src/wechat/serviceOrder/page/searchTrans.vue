<template>
  <div class="searchTrans">
    <cus-search v-model="value"
                placeholder="请输入配件名称">

        <cus-loadmore ref="result"
                      :loadBottom="loadBottomFn"
                      :topStatus="topStatus">
          <cus-cell class="multiple"
                    :key="item.id"
                    :title="'配件名称:'+ item['KL Translated Name']"
                    v-for="(item, index) in result">
            <div class="mint-cell-sub-title" slot="title">配件代码: {{item.Name}}</div>
            <div class="mint-cell-sub-title" slot="title">价格:{{item["List Price"]}} </div>
          </cus-cell>
        </cus-loadmore>
    </cus-search>
  </div>
</template>
<style lang="scss">
  .numberBox {
    display: flex;
    position: absolute;
    right: 1rem;
    top: 0;
    align-items: center;
    background-color: #ffffff;
    z-index: 1000;
  }
</style>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
  //
  const NAMESPACE = 'searchTrans';
  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        number: [],
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      ...mapMutations(NAMESPACE, ['count']),
      searchFn(val) {
        this.getProduct(val);
      },
      loadBottomFn() {
      },
      add(index) {
        this.count({index: index, type: 'add'});
      },
      minus(index) {
        this.count({index: index, type: 'minus'});
      }
    }
  };
</script>
