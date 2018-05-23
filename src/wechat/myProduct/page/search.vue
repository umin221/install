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
        <cus-cell class="multiple"
                  :key="item.id"
                  :title="'配件代码:'+ item['Product Name']"
                  @click.native="toDetailFn(item['Inventory Location ID'],item['Product ID'])"
                  v-for="item in result">
          <div slot="after" style="color: #0772c1">{{item.Type}}</div>
          <div class="mint-cell-sub-title" slot="title">配件名称：{{item['KL Product Name Join']}}</div>
          <div class="mint-cell-sub-title" slot="title">配件型号: {{item['KL Prod Model No']}}</div>
          <div class="mint-cell-sub-title" slot="title">库存量：{{item['KL Inventory Qty']}}</div>
          <div class="mint-cell-sub-title" slot="title">配件描述：{{item['KL Product Description']}}</div>
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
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let name = me.value;
    let param = {
      data: {
        'Product Name': '*' + name + '*',
        'KL Prod Model No': '*' + name + '*',
        'KL Product Name Join': '*' + name + '*',
        'KL Primary Employee Full Name': '*' + name + '*'
      },
      more: args.pop(),
      callback: (data) => {
        me.$refs.result[event](data.length);
      }
    };
    // 获取团队列表
    me.getList(param);
  };

  const NAMESPACE = 'index';
  export default {
    name: 'search',
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
      ...mapActions(NAMESPACE, ['getList']),
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
