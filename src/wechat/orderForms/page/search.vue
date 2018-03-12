<template>
  <div class="search">
    <cus-search v-model="value"
                placeholder="请输入订单号或者负责人">

        <cus-loadmore ref="result"
                      :loadBottom="loadBottomFn"
                      :topStatus="topStatus">
          <cus-cell class="multiple"
                    :key="item.id"
                    :title="'合作伙伴名称:'+ item.Name"
                    v-for="item in result"
                    is-link>
            <div class="mint-cell-sub-title" slot="title">合作伙伴负责人: </div>
            <div class="mint-cell-sub-title" slot="title">联系电话: </div>
          </cus-cell>
        </cus-loadmore>

    </cus-search>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
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
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      searchFn(val) {
        this.value = val;
        this.getProduct(val);
      },
      loadBottomFn() {
      }
    }
  };
</script>
