<template>
  <div class="">
    <mt-header fixed title="选择配件" style="z-index: 2">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content searchTrans">
      <empty v-show="!result1.length"></empty>
      <mt-navbar v-model="selectId"
                 v-if="result1.length">
        <mt-tab-item v-for="(item, index) in result1"
                     :id="item.Id"
                     :key="index"
                     @click.native="toChild(item.Id, '2')">{{item['Display Name']}}
          <span v-if="value[item.Id]">{{value[item.Id]}}</span>
        </mt-tab-item>
      </mt-navbar>
      <mt-tab-container style="background-color: #F8F8F8;"
                        v-model="selectId"
                        v-if="result1.length">
        <mt-tab-container-item v-for="(item, index) in result1"
                               :id="item.Id"
                               :key="index">
          <empty v-if="!result2[item.Id]"></empty>
          <!--二级目录-->
          <toggle v-if="result2[item.Id]"
                  :isTitle="true"
                  :key="index2"
                  v-for="(item2, index2) in result2[item.Id]"
                  :label="item2['Display Name']"
                  @ck="toChild1({id: item2.Id, value: '3'})">
            <!--二级产品选项-->
            <cus-cell class="multiple"
                      :key="item4.id"
                      :title="'配件名称:'+ item4['KL Translated Name']"
                      v-for="(item4, index) in toarr(item2.Product, item2.Id)"
                      @click.native="select(item2.Id, index, item.Id)">
              <div class="mint-cell-sub-title" slot="title">配件代码: {{item4.Name}}</div>
              <div class="mint-cell-sub-title" slot="title">价格:{{item4["List Price"]}} </div>
              <div class="mint-cell-sub-title" slot="title">配件描述:{{item4["KL Translated Description"]}} </div>
              <div v-show="item4.select" class="selectIcon" slot="title">
                <i class="xs-icon icon-select"></i>
              </div>
            </cus-cell>

            <!--三级目录-->
            <empty v-if="!result3[item2.Id] && !item2.Product"></empty>
            <!--<sr-title srNum="目录" v-if="result3[item2.Id]"></sr-title>-->
            <toggle v-if="result3[item2.Id]"
                    :isTitle="false"
                    :key="index3"
                    v-for="(item3, index3) in result3[item2.Id]"
                    :label="item3['Display Name']">

              <!--三级产品选项-->
              <empty v-if="!item3.Product"></empty>
              <cus-cell class="multiple"
                        :key="item4.id"
                        :title="'配件名称:'+ item4['KL Translated Name']"
                        v-for="(item4, index) in toarr(item3.Product, item3.Id)"
                        @click.native="select(item3.Id, index, item.Id)">
                <div class="mint-cell-sub-title" slot="title">配件代码: {{item4.Name}}</div>
                <div class="mint-cell-sub-title" slot="title">价格:{{item4["List Price"]}} </div>
                <div class="mint-cell-sub-title" slot="title">配件描述:{{item4["KL Translated Description"]}} </div>
                <div v-show="item4.select" class="selectIcon" slot="title">
                  <i class="xs-icon icon-select"></i>
                </div>
              </cus-cell>
            </toggle>
          </toggle>
        </mt-tab-container-item>
      </mt-tab-container>
      <button-group>
        <mt-button class="single"
                   @click.native="selectEnter">确认</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusSearch from 'public/components/cus-search';
  import cusCell from 'public/components/cus-cell';
  import toggle from '../components/detail-toggle';
  import buttonGroup from 'public/components/cus-button-group';
  import Vue from 'vue';

  const NAMESPACE = 'selectParts';
  export default {
    name: NAMESPACE,
    created() {
      console.log('配件领用');
      let me = this;
      me.type = this.$route.query.type;
      me.getProduct({
        value: '1',
        callback: function(data) {
          me.toChild(data[0].Id, '2');
          me.selectId = data[0].Id;
          for (let i = 0; i < data.length;i++) {
//            Vue.set(me.value[data[i].Id], data[i].Id, 0);
            me.value[data[i].Id] = 0;
          }
        }});
    },
    components: {cusLoadmore, cusSearch, cusCell, toggle, buttonGroup},
    data: () => {
      return {
        selectId: '',
        value: {},
        number: [],
        topStatus: '',
        type: '',
        arr: {},
        result2: {},
        result3: {}
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result1', 'selected', 'returnSelect'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      ...mapMutations(NAMESPACE, ['count', 'saveModelData', 'initSelected']),
      ...mapMutations('add', ['selectProduct']),
//      ...mapMutations('comEnter', ['successCall']),
      searchFn(val) {
        this.getProduct({value: val, type: this.type});
      },
      toarr(item, id) {
        let product = KND.Util.toArray(item);
        this.arr[id] = product;
        return this.arr[id];
      },
      toChild(id, value) {
        let me = this;
        if (!me['result' + value][id]) {
          me.getProduct({
            value: value,
            ParentId: id,
            callback: function(data) {
              Vue.set(me['result' + value], id, data);
            }
          });
        }
      },
      toChild1(form) {
        let me = this;
        if (!me['result' + form.value][form.id]) {
          me.getProduct({
            value: form.value,
            ParentId: form.id,
            callback: function(data) {
              Vue.set(me['result' + form.value], form.id, data);
            }
          });
        }
      },
      isLen(item, id) {
        let me = this;
        if (!item) {
          me.value[id] = [];
          return 0;
        } else {
          return item.length;
        }
//        return item.length;
      },
      loadBottomFn() {
      },
      select(id, index, parentId) {
        let me = this;
        let i = null;
        if (!me.arr[id][index].select) {
          Vue.set(me.arr[id][index], 'select', true);
          i = me.value[parentId] + 1;
        } else {
          Vue.set(me.arr[id][index], 'select', false);
          i = me.value[parentId] - 1;
        }
        Vue.set(me.value, parentId, i);
      },
      selectEnter() {
        let me = this;
        console.log(me.arr);
        for (let key in me.arr) {
          if (me.arr[key].length) {
            for (let i = 0;i < me.arr[key].length; i++) {
              if (me.arr[key][i].select) {
                me.arr[key][i].num = 1;
                me.selectProduct(me.arr[key][i]);
              }
            }
          }
        }
        me.$router.go(-1);
      }
    }
  };
</script>
<style lang="scss">
  .mint-search-list {
    padding-bottom: 44px!important;
  }
    .selectIcon {
      position: absolute;
      top: 0;
      right: 0;
    }
    .searchTrans {
      height: 100%;
      margin-bottom: 45px;
      background-color: white !important;
      .mint-navbar {
        flex-direction: column;
        width: 20%;
        a {
          background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 1%, transparent 0%);
          padding: 1rem 0;
          position: relative;
          span {
            position: absolute;
            width: 1.1rem;
            height: 1.1rem;
            background-color: #00599f;
            top: -5px;
            right: -5px;
            z-index: 1;
            border-radius: 50%;
            color: white;
            text-align: center;
            line-height: 1rem;
          }
        }

      }
      .mint-tab-container {
        position: absolute;
        background-color: white;
        width: 80%;
        top: 0;
        left: 20%;
        padding-bottom: 44px;
        .mint-tab-container-wrap {
          display: block;
          .productTitle {
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
    .no-bar::-webkit-scrollbar {
      display: none
    }
</style>

<!--<template>-->
  <!--<div class="searchTrans">-->
    <!--<cus-search v-model="value" :show="true">-->
      <!--<cus-loadmore ref="result2"-->
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
    <!--<button-group>-->
      <!--<mt-button class="single" @click.native="selectEnter">确认</mt-button>-->
    <!--</button-group>-->
  <!--</div>-->
<!--</template>-->
<!--<style lang="scss">-->
  <!--.selectIcon {-->
    <!--position: absolute;-->
    <!--top: 0;-->
    <!--right: 0;-->
  <!--}-->
<!--</style>-->
<!--<script type="es6">-->
  <!--import {mapState, mapActions, mapMutations} from 'vuex';-->
  <!--import cusLoadmore from 'public/components/cus-loadmore';-->
  <!--import cusSearch from 'public/components/cus-search';-->
  <!--import cusCell from 'public/components/cus-cell';-->

  <!--const NAMESPACE = 'selectParts';-->
  <!--export default {-->
    <!--name: NAMESPACE,-->
    <!--created() {-->
      <!--this.initSelected();-->
      <!--this.getProduct();-->
    <!--},-->
    <!--components: {cusLoadmore, cusSearch, cusCell},-->
    <!--data: () => {-->
      <!--return {-->
        <!--value: '',-->
        <!--number: [],-->
        <!--topStatus: ''-->
      <!--};-->
    <!--},-->
    <!--computed: {-->
      <!--...mapState(NAMESPACE, ['result', 'selected', 'returnSelect'])-->
    <!--},-->
    <!--methods: {-->
      <!--...mapActions(NAMESPACE, ['getProduct']),-->
      <!--...mapMutations(NAMESPACE, ['count', 'saveModelData', 'initSelected']),-->
      <!--...mapMutations('add', ['selectProduct']),-->
<!--//      ...mapMutations('comEnter', ['successCall']),-->
      <!--searchFn(val) {-->
        <!--this.getProduct({value: val});-->
      <!--},-->
      <!--loadBottomFn() {-->
      <!--},-->
      <!--select(index, isShow) {-->
        <!--this.count({index, isShow});-->
      <!--},-->
      <!--selectEnter() {-->
        <!--let me = this;-->
        <!--for (let i = 0; i < me.result.length; i++) {-->
          <!--if (me.selected[i]) {-->
            <!--me.result[i].num = 1;-->
            <!--me.selectProduct(me.result[i]);-->
          <!--}-->
        <!--}-->
        <!--me.$router.go(-1);-->
      <!--}-->
    <!--}-->
  <!--};-->
<!--</script>-->
