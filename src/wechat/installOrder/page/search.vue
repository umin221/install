<!--搜索交接单-->
<template>
  <div class="search">
    <cus-search v-model="value"
                :show="true"
                placeholder="请输入项目名称或负责人">

      <cus-loadmore ref="result"
                    :loadBottom="loadBottomFn"
                    :emptyTips="false"
                    :topStatus="topStatus">
        <cus-cell class="multiple"
                  :key="item.Id"
                  :title="'订单编码:'+ item['Order Number']"
                  @click.native="toDetailFn(item.Id)"
                  v-for="item in result"
                  is-link>
          <div class="mint-cell-sub-title" slot="title">销售类型: {{item['KL Delivery Sales Type']}}</div>
          <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
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
    let exp = `*${me.value}*`;
    let param = Object.extend({
      data: {
        search: {
          'Order Number': exp, // 订单编号
          'KL Agreement Opportunity Name': exp,
          'KL Delivery Setter Full Name': exp
        }
      },
      callback: (data) => {
        me.$refs['result'][event](data.length);
      }
    }, args.pop() || {});
    // 获取安装订单
    console.dir('00000');
    me.getList(param, me.userInfo);
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
      toDetailFn(id) {
        this.$router.push({
          name: 'detail',
          query: {
            id: id
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
