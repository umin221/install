<template>
  <div class="searchTrans">
    <cus-search v-model="value" :show="true">
      <cus-loadmore ref="result2"
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
    <button-group>
      <mt-button class="single" @click.native="selectEnter">确认</mt-button>
    </button-group>
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
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'selectParts';
  export default {
    name: NAMESPACE,
    created() {
      this.initSelected();
      this.getProduct();
    },
    components: {cusLoadmore, cusSearch, cusCell},
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
      ...mapMutations(NAMESPACE, ['count', 'saveModelData', 'initSelected']),
      ...mapMutations('add', ['selectProduct']),
//      ...mapMutations('comEnter', ['successCall']),
      searchFn(val) {
        this.getProduct({value: val});
      },
      loadBottomFn() {
      },
      select(index, isShow) {
        this.count({index, isShow});
      },
      selectEnter() {
        let me = this;
        for (let i = 0; i < me.result.length; i++) {
          if (me.selected[i]) {
            me.result[i].num = 1;
            me.selectProduct(me.result[i]);
          }
        }
        me.$router.go(-1);
      }
    }
  };
</script>
