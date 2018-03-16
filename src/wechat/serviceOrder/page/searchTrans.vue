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
                    v-for="(item, index) in result"
                    @click.native="select(index, selected[index])">
            <div class="mint-cell-sub-title" slot="title">配件代码: {{item.Name}}</div>
            <div class="mint-cell-sub-title" slot="title">价格:{{item["List Price"]}} </div>
            <div v-show="selected[index]" class="selectIcon" slot="title">
              <i class="xs-icon icon-select"></i>
            </div>
          </cus-cell>
        </cus-loadmore>
    </cus-search>
    <buttonGroup>
      <mt-button type="primary" class="single" @click.native="selectEnter">确认</mt-button>
    </buttonGroup>
  </div>
</template>
<style lang="scss">
  .selectIcon {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';

  //
  const NAMESPACE = 'searchTrans';
  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusSearch, cusCell, buttonGroup},
    data: () => {
      return {
        value: '',
        number: [],
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'selected', 'returnSelect'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      ...mapMutations(NAMESPACE, ['count', 'selectProduct']),
      searchFn(val) {
        this.getProduct(val);
      },
      loadBottomFn() {
      },
      select(index, isShow) {
        this.count({index, isShow});
      },
      selectEnter() {
        this.selectProduct();
        this.$router.go(-1);
      }
    }
  };
</script>
