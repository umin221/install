<!--搜索交接单-->
<template>
  <div class="search">
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入配件名称或负责人">

      <cus-loadmore ref="result"
                    @loadBottom="loadBottomFn"
                    :emptyTips="false"
                    :topStatus="topStatus">
        <!--<cus-cell class="multiple"
                  :key="item.id"
                  :title="'配件代码:'+ item['Product Name']"
                  v-for="item in result">
          <div slot="after" style="color: #0772c1">{{item.Type}}</div>
          <div class="mint-cell-sub-title" slot="title">配件名称：{{item['KL Product Name Join']}}</div>
          <div class="mint-cell-sub-title" slot="title">配件型号: {{item['KL Prod Model No']}}</div>
          <div class="mint-cell-sub-title" slot="title">库存量：{{item['KL Inventory Qty']}}</div>
          <div class="mint-cell-sub-title" slot="title">配件描述：{{item['KL Product Description']}}</div>
        </cus-cell>-->
        <cus-cell class="multiple"
                  :key="item.id"
                  :title="'配件名称:'+ item['KL Translated Name']"
                  @click.native="select(index, item.Id)"
                  v-for="item in result">
          <div class="mint-cell-sub-title" slot="title">配件代码: {{item.Name}}</div>
          <div class="mint-cell-sub-title" slot="title">价格:{{item["List Price"]}} </div>
          <div class="mint-cell-sub-title" slot="title">配件描述:{{item["KL Translated Description"]}} </div>
          <div v-show="item.select" class="selectIcon" slot="title">
            <i class="xs-icon icon-select"></i>
          </div>
        </cus-cell>
        <button-group>
          <mt-button class="single"
                     @click.native="submitFn">确认</mt-button>
        </button-group>
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
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let name = me.value;
    let param = {
      data: {
        'name': name
      },
      more: args.pop(),
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.getSearchProduct(param);
  };

  const NAMESPACE = 'searchPart';
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
      ...mapActions(NAMESPACE, ['getSearchProduct']),
      /**
       * 搜索回调
       * @param {String} val 搜索值
       */
      searchFn(val) {
        loader.call(this, 'onBottomLoaded');
      },
      /**
       * To detail
       * @param {Object} item 行内容
       */
      /* toDetailFn(item) {
        this.$router.push({
          name: 'detail',
          query: {
            id: item.Id
          }
        });
      },*/
      toDetailFn(InvId, ProductId) {
        this.$router.push({
          name: 'detail',
          query: {
            InvID: InvId,
            ProductId: ProductId
          }
        });
      },
      /**
       * Load more
       */
      loadBottomFn() {
        loader.call(this, {
          more: true
        }, 'onBottomLoaded');
      }
    }
  };
</script>
