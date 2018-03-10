<!--委外团队列表-->
<template>
  <div>
    <mt-header fixed title="我的安装订单">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
    </mt-header>

    <div class="mint-content">

      <mt-navbar v-model="selected">
        <mt-tab-item id="pending"
          @click.native="!pending.length && pendingLoadBottomFn()">待处理</mt-tab-item>
        <mt-tab-item id="valid"
          @click.native="!valid.length && validLoadBottomFn()">处理中</mt-tab-item>
        <mt-tab-item id="invalid"
          @click.native="!invalid.length && invalidLoadBottomFn()">已完成</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <cus-loadmore ref="pending"
                        :loadTop="pendingLoadTopFn"
                        :loadBottom="pendingLoadBottomFn"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      :key="item.Id"
                      :title="'订单编码:'+ item['Order Number']"
                      @click.native="toDetail(item.Id)"
                      v-for="item in pending"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">销售类型: {{item['KL Delivery Sales Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="valid">
          <cus-loadmore ref="valid"
                        :loadTop="validLoadTopFn"
                        :loadBottom="validLoadBottomFn"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      :key="item.Id"
                      :title="'订单编码:'+ item['Order Number']"
                      @click.native="toDetail(item.Id)"
                      v-for="item in valid"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">销售类型: {{item['KL Delivery Sales Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="invalid">
          <cus-loadmore ref="invalid"
                        :loadTop="invalidLoadTopFn"
                        :loadBottom="invalidLoadBottomFn"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      :key="item.Id"
                      :title="'订单编码:'+ item['Order Number']"
                      @click.native="toDetail(item.Id)"
                      v-for="item in invalid"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">销售类型: {{item['KL Delivery Sales Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
            </cus-cell>
          </cus-loadmore>

        </mt-tab-container-item>
      </mt-tab-container>

    </div>

  </div>
</template>

<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'index';
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.assign({
      data: {
        'body': {
          'OutputIntObjectName': 'KL Install Order',
          'SearchSpec': '[Order Entry - Orders.Status]=\'安装中\'',
          'ViewMode': 'Sales Rep',
          'StartRowNum': '0',
          'PageSize': '10'
        }
      },
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    // 获取安装订单
    me.getList(param);
  };

  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusCell},
    // 数据初始化
    created() {
      loader.call(this, 'pending', 'onBottomLoaded');
    },
    data: () => {
      return {
        // 活跃tab
        selected: 'pending',
        // 下拉状态
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['pending', 'valid', 'invalid'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getList']),
      // 待审批顶部加载
      pendingLoadTopFn() {
        loader.call(this, 'pending', 'onTopLoaded');
      },
      // 有效顶部加载
      validLoadTopFn() {
        loader.call(this, {
          data: {
            'KL Partner Status': '有效'
          }
        }, 'valid', 'onTopLoaded');
      },
      // 失效顶部加载
      invalidLoadTopFn() {
        loader.call(this, {
          data: {
            'KL Partner Status': '失效'
          }
        }, 'invalid', 'onTopLoaded');
      },
      // 待审批底部加载
      pendingLoadBottomFn() {
        loader.call(this, {
          more: true
        }, 'pending', 'onBottomLoaded');
      },
      // 有效底部加载
      validLoadBottomFn() {
        loader.call(this, {
          data: {
            'KL Partner Status': '有效'
          },
          more: true
        }, 'valid', 'onBottomLoaded');
      },
      // 失效底部加载
      invalidLoadBottomFn() {
        loader.call(this, {
          data: {
            'KL Partner Status': '失效'
          },
          more: true
        }, 'invalid', 'onBottomLoaded');
      },
      // 跳转搜索
      toSearchFn() {
        this.$router.push('search');
      },
      // To detail or create
      toDetailFn(id) {
        let query = typeof id === 'string' ? {
          // detail
          type: 'read',
          state: this.selected,
          id: id
        } : {
          // create
          type: 'add'
        };
        this.$router.push({
          name: 'detail',
          query: query
        });
      }
    }
  };
</script>
