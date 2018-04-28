<template>
  <div class="searchTrans">
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入配件名称">
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
    <button-group v-if="type !== 'fault'">
      <mt-button class="single" @click.native="selectEnter">确认</mt-button>
    </button-group>
  </div>
</template>
<style lang="scss">
  .searchTerm{
    background-color: white;
  }
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
      this.initSelected();
//      this.getProduct({value: '1'});
      this.getProduct();
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
      ...mapState(NAMESPACE, ['result', 'result1', 'result2', 'result3', 'result4', 'selected', 'returnSelect'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      ...mapMutations(NAMESPACE, ['count', 'saveModelData', 'initSelected']),
      ...mapMutations('saveFault', ['selectProduct']),
//      ...mapMutations('comEnter', ['successCall']),
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
//          this.successCall({item: index, type: ' No'});
        }
      },
//      toNetx(id, item) {
//        console.log(item);
//        this.getProduct({value: item, ParentId: id});
//      },
      selectEnter() {
        console.log(this.result);
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
<!--<template>
  <div class="searchTrans">
    <mt-header fixed title="选择配件" >
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      &lt;!&ndash;<empty v-show="!result.length"></empty>&ndash;&gt;
      &lt;!&ndash;<mt-navbar v-model="selectId" v-if="result.length">&ndash;&gt;
      &lt;!&ndash;<mt-tab-item>产品目录</mt-tab-item>&ndash;&gt;
      &lt;!&ndash;<mt-tab-item v-for="(item, index) in result"&ndash;&gt;
                    &lt;!&ndash;:id="item.Id"&ndash;&gt;
                    &lt;!&ndash;:key="index"&ndash;&gt;
                   &lt;!&ndash;@click.native="toChild(item.Id)">{{item['Display Name']}}&ndash;&gt;
        &lt;!&ndash;<span v-if="isLen(value[item.Id],item.Id)">{{isLen(value[item.Id],item.Id)}}</span>&ndash;&gt;
      &lt;!&ndash;</mt-tab-item>&ndash;&gt;
      &lt;!&ndash;</mt-navbar>&ndash;&gt;
       &lt;!&ndash;<mt-tab-container v-model="selectId"&ndash;&gt;
                         &lt;!&ndash;v-if="result.length">&ndash;&gt;
          &lt;!&ndash;<div class="productTitle">产品选择</div>&ndash;&gt;
          &lt;!&ndash;<mt-tab-container-item v-for="(item, index) in result"&ndash;&gt;
                                  &lt;!&ndash;:id="item.Id"&ndash;&gt;
                                  &lt;!&ndash;:key="index">&ndash;&gt;
            &lt;!&ndash;<toggle v-if="result2.length"&ndash;&gt;
                    &lt;!&ndash;:key="index2"&ndash;&gt;
                    &lt;!&ndash;v-for="(item2, index2) in result2"&ndash;&gt;
                    &lt;!&ndash;:label="item2.Name"></toggle>&ndash;&gt;
          &lt;!&ndash;<empty v-show="!item.Product"></empty>&ndash;&gt;
            &lt;!&ndash;<mt-checklist&ndash;&gt;
              &lt;!&ndash;v-if="item.Product"&ndash;&gt;
              &lt;!&ndash;:options="toarr(item.Product, item.Id)"&ndash;&gt;
              &lt;!&ndash;v-model="value[item.Id]">&ndash;&gt;
            &lt;!&ndash;</mt-checklist>&ndash;&gt;
          &lt;!&ndash;</mt-tab-container-item>&ndash;&gt;
        &lt;!&ndash;</mt-tab-container>&ndash;&gt;
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
    .mint-navbar{
      flex-direction:column;
      width: 20%;
      a{
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 1%, transparent 0%);
        padding: 1rem 0;
        position: relative;
        span{
          position: absolute;
          width: 1.1rem;
          height: 1.1rem;
          background-color: #00599f;
          top: -5px;
          right: -5px;
          z-index: 2001;
          border-radius: 50%;
          color: white;
          text-align: center;
          line-height: 1rem;
        }
      }

    }
    .mint-tab-container{
      position: absolute;
      background-color: white;
      width: 80%;
      top:0;
      left: 20%;
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
//      let me = this;
      this.type = this.$route.query.type;
      this.initSelected();
      this.getProduct({value: val});
//      me.getProduct({
//        Number: 1,
//        callback: function(data) {
//          me.getProduct({
//            Number: 2,
//            parentId: data
//          });
//          me.selectId = data;
//        }
//      });
    },
    components: {cusLoadmore, cusSearch, cusCell, toggle},
    data: () => {
      return {
        selectId: '',
        value: {},
        number: [],
        topStatus: '',
        type: '',
        arr: {},
        result2: {}
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['result', 'result2', 'selected', 'returnSelect'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getProduct']),
      ...mapMutations(NAMESPACE, ['count', 'saveModelData', 'initSelected']),
      ...mapMutations('saveFault', ['selectProduct']),
//      ...mapMutations('comEnter', ['successCall']),
      searchFn(val) {
        this.getProduct({value: val, type: this.type});
      },
//      toarr(item, id) {
//        let arr = [];
//        let product = KND.Util.toArray(item);
//        for (let i = 0; i < product.length;i++) {
//          let name = product[i]['KL Translated Name'] + product[i]['Name'];
//          arr.push({
//            label: name,
//            value: product[i]
//          });
//        };
//        this.arr[id] = arr;
//        if (!this.value[id]) {
//          this.value[id] = [];
//        }
//        return this.arr[id];
//      },
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
//        for (let key in me.value) {
//          console.log(me.value[key].length);
//          if (me.value[key].length) {
//            for (let i = 0;i < me.value[key].length; i++) {
//              me.value[key][i].num = 1;
//              me.selectProduct(me.value[key][i]);
//            }
//          }
//        }
        me.$router.go(-1);
      }
    }
  };
</script>-->
