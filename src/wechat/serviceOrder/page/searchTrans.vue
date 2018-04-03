<template>
  <div class="searchTrans">
    <cus-search v-model="value"
                placeholder="请输入配件名称">

      <cus-loadmore v-if="type"
                      ref="result1"
                    :loadBottom="loadBottomFn"
                    :topStatus="topStatus">
      <cus-cell class="multiple"
                :key="item.id"
                :title="'型号:'+ item['KL Product Model No']"
                v-for="(item, index) in result"
                @click.native="select(item)">
        <div class="mint-cell-sub-title" slot="title">产品说明: {{item['KL Translated Description']}}</div>
      </cus-cell>
      </cus-loadmore>
      <cus-loadmore v-else
                      ref="result2"
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
    <button-group v-if="type !== 'fault'">
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

  const NAMESPACE = 'searchTrans';
  export default {
    name: NAMESPACE,
    created() {
      this.type = this.$route.query.type;
    },
    components: {cusLoadmore, cusSearch, cusCell},
    data: () => {
      return {
        value: '',
        number: [],
        topStatus: '',
        type: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'selected', 'returnSelect'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      ...mapMutations(NAMESPACE, ['count', 'selectProduct', 'saveModelData']),
      ...mapMutations('comEnter', ['successCall']),
      searchFn(val) {
        this.getProduct({value: val, type: this.type});
      },
      loadBottomFn() {
      },
      select(index, isShow) {
        if (this.type !== 'fault') {
          this.count({index, isShow});
        } else {
          this.$router.back();
          this.successCall({item: index, type: ' No'});
        }
      },
      selectEnter() {
        this.selectProduct();
        this.$router.go(-1);
      }
    }
  };
</script>
