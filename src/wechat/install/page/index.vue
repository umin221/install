<!--委外团队列表-->
<template>
  <div>
    <mt-header fixed title="安装批次列表">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
    </mt-header>

    <div class="mint-content">

      <mt-navbar v-model="selected" v-if="isManager">
        <mt-tab-item id="pending"
          @click.native="!pending.length && loadBottomFn({status:'待处理', list:'pending'})">待处理</mt-tab-item>
        <mt-tab-item id="completed"
          @click.native="!completed.length && loadBottomFn({status:'已完成', list:'completed'})">已完成</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <cus-loadmore ref="pending"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status: '待处理', list: 'pending'}"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      @click.native="toDetailFn(item.Id)"
                     :key="item.id"
                     :title="'订单批次:'+ item.Name"
                     v-for="item in pending"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">创建日期: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="completed">
          <cus-loadmore ref="completed"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status: '已完成', list: 'completed'}"
                        :topStatus="topStatus">
            <cus-cell class="multiple"
                      @click.native="toDetailFn(item.Id)"
                     :key="item.id"
                     :title="'订单批次:'+ item.Name"
                     v-for="item in completed"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Partner Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">创建日期: {{item['Main Phone Number']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

      </mt-tab-container>

    </div>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'index';
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend({
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop());
    // 获取团队列表
    me.getPartners(param);
  };

  export default {
    name: NAMESPACE,
    components: {cusLoadmore, cusCell},
    // 数据初始化
    created() {
      let me = this;
      KND.Native.getUserInfo((info) => {
        // 获取数据
        me.loadBottomFn({
          status: '待处理',
          list: 'pending'
        });
      });
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
      ...mapState(NAMESPACE, ['pending', 'completed', 'isManager'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getPartners']),
      ...mapMutations(NAMESPACE, ['setManager']),
      // 已失效顶部加载
      loadTopFn(param) {
        loader.call(this, {
          data: {
            'KL Partner Status': param.status
          }
        }, param.list, 'onTopLoaded');
      },
      // 待审批底部加载
      loadBottomFn(param) {
        loader.call(this, {
          data: {
            'KL Partner Status': param.status
          },
          more: true
        }, param.list, 'onBottomLoaded');
      },
      // 跳转搜索
      toSearchFn() {
        this.$router.push('search');
      },
      // To detail or create
      toDetailFn(id) {
        this.$router.push({
          name: 'assets'
        });
      }
    }
  };
</script>
