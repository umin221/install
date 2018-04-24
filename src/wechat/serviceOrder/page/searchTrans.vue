<template>
  <div class="searchTrans">
    <mt-header fixed title="选择配件" >
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      <empty v-show="!result.length"></empty>
      <mt-navbar v-model="selectId" v-if="result.length">
      <mt-tab-item>产品目录</mt-tab-item>
      <mt-tab-item v-for="(item, index) in result"
                    :id="item.Id"
                    :key="index">{{item['Display Name']}}</mt-tab-item>
      </mt-navbar>
       <mt-tab-container v-model="selectId"
                         v-if="result.length">
          <div class="productTitle">产品选择</div>
          <mt-tab-container-item v-for="(item, index) in result"
                                  :id="item.Id"
                                  :key="index">
          <empty v-show="!item.Product"></empty>
            <mt-checklist
              v-if="item.Product"
              :options="toarr(item.Product)"
              v-model="value">
            </mt-checklist>
          </mt-tab-container-item>
        </mt-tab-container>
      <!--<cus-search v-model="value"-->
                <!--placeholder="请输入配件名称">-->

      <!--<cus-loadmore v-if="type"-->
                      <!--ref="result1"-->
                    <!--:loadBottom="loadBottomFn"-->
                    <!--:topStatus="topStatus">-->
      <!--<cus-cell class="multiple"-->
                <!--:key="item.id"-->
                <!--:title="'型号:'+ item['KL Product Model No']"-->
                <!--v-for="(item, index) in result"-->
                <!--@click.native="select(item)">-->
        <!--<div class="mint-cell-sub-title" slot="title">产品说明: {{item['KL Translated Description']}}</div>-->
      <!--</cus-cell>-->
      <!--</cus-loadmore>-->
      <!--<cus-loadmore v-else-->
                      <!--ref="result2"-->
                    <!--:loadBottom="loadBottomFn"-->
                    <!--:topStatus="topStatus">-->

        <!--<cus-cell class="multiple"-->
                  <!--:key="item.id"-->
                  <!--:title="'配件名称:'+ item['KL Translated Name']"-->
                  <!--v-for="(item, index) in result"-->
                  <!--@click.native="select(index, selected[index])">-->
          <!--<div class="mint-cell-sub-title" slot="title">配件代码: {{item.Name}}</div>-->
          <!--<div class="mint-cell-sub-title" slot="title">价格:{{item["List Price"]}} </div>-->
          <!--<div v-show="selected[index]" class="selectIcon" slot="title">-->
            <!--<i class="xs-icon icon-select"></i>-->
          <!--</div>-->
        <!--</cus-cell>-->
      <!--</cus-loadmore>-->
    <!--</cus-search>-->
    </div>
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
  .searchTrans{
    margin-bottom: 40px;
    .mint-navbar{
      flex-direction:column;
      width: 25%;
      a{
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 1%, transparent 0%);
        padding: 1rem 0;
      }
    }
    .mint-tab-container{
      position: absolute;
      background-color: white;
      width: 75%;
      top:0;
      left: 25%;
      .mint-tab-container-wrap{
        display: block;
        .productTitle{
          padding: 0.8rem;
          text-align: center;
          color: #777;
          font-size: 18px;
        }
        /*.mint-tab-container-item{*/
          /*.mint-checklist*/
        /*}*/
      }
    }
  }
</style>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
  import toggle from '../components/detail-toggle';

  const NAMESPACE = 'searchTrans';
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      this.type = this.$route.query.type;
      this.initSelected();
      me.getProduct(function(data) {
        me.selectId = data;
      });
    },
    components: {cusLoadmore, cusSearch, cusCell, toggle},
    data: () => {
      return {
        selectId: '',
        value: [],
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
      ...mapMutations(NAMESPACE, ['count', 'saveModelData', 'initSelected']),
      ...mapMutations('saveFault', ['selectProduct']),
//      ...mapMutations('comEnter', ['successCall']),
      searchFn(val) {
        this.getProduct({value: val, type: this.type});
      },
      toarr(item) {
        let arr = [];
        let product = KND.Util.toArray(item);
        for (let i = 0; i < product.length;i++) {
          let name = product[i]['KL Translated Name'] + product[i]['Name'];
          arr.push({
            label: name,
            value: product[i]
          });
        };
        return arr;
      },
      loadBottomFn() {
      },
      select(index, isShow) {
        if (this.type !== 'fault') {
          this.count({index, isShow});
        } else {
          this.$router.back();
//          this.successCall({item: index, type: ' No'});
        }
      },
      selectEnter() {
        let me = this;
        if (me.value.length) {
          for (let i = 0; i < me.value.length; i++) {
            me.value[i].num = 1;
            me.selectProduct(me.value[i]);
          }
        }
        me.$router.go(-1);
      }
    }
  };
</script>
