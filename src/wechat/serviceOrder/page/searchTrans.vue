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
                    v-for="item in result">
            <div class="mint-cell-sub-title" slot="title">配件代码: {{item.Name}}</div>
            <div class="mint-cell-sub-title" slot="title">价格:{{item["List Price"]}} </div>
            <div class="mint-cell-sub-title numberBox" slot="title">
              <div></div>
              <mt-button size="small" type="default" @click.native="miuns"><i class="xs-icon icon-minus" style="font-size: 12px"></i></mt-button>
              <div style="width: 2rem;text-align: center;">{{number}}</div>
              <mt-button size="small" type="default" @click.native="add"><i class="xs-icon icon-add" style="font-size: 12px"></i></mt-button>
            </div>
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
    background-color: $bg-cancel;
    z-index: 1000;
  }
</style>
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
        number: 0,
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
      },
      add() {
        this.number = this.number + 1;
      },
      miuns() {
        if (this.number) {
          this.number = this.number - 1;
        }
      }
    }
  };
</script>
