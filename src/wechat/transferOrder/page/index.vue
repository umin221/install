<!--交接单列表-->
<template>
  <div>
    <cus-header fixed title="我的交接单" :menu="[{title:'查看我的团队', key:'a'}]">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
    </cus-header>

    <div class="mint-content">

      <mt-navbar v-model="selected">
        <mt-tab-item id="pending"
          @click.native="!pending.length && loadBottomFn({status:'待处理', list:'pending'})">待处理</mt-tab-item>
        <mt-tab-item id="process"
          @click.native="!process.length && loadBottomFn({status:'处理中', list:'process'})">处理中</mt-tab-item>
        <mt-tab-item id="completed"
          @click.native="!completed.length && loadBottomFn({status:'已完成', list:'completed'})">已完成</mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <cus-loadmore ref="pending"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status:'待处理', list:'pending'}"
                        :topStatus="topStatus">
            <empty v-show="!pending.length"></empty>
            <cus-cell class="multiple"
                     :key="item.id"
                     :title="'合同编号:'+ item['Agree Number']"
                     @click.native="toDetailFn(item)"
                     v-for="item in pending"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['Lead Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">更新日期: {{new Date(item['Updated']).format('yyyy-MM-dd hh:mm:ss')}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="process">
          <cus-loadmore ref="process"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status:'处理中', list:'process'}"
                        :topStatus="topStatus">
            <empty v-show="!process.length"></empty>
            <cus-cell class="multiple"
                     :key="item.id"
                     :title="'合同编号:'+ item['Agree Number']"
                     @click.native="toDetailFn(item)"
                     v-for="item in process"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['Lead Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">更新日期: {{new Date(item['Updated']).format('yyyy-MM-dd hh:mm:ss')}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="completed">
          <cus-loadmore ref="completed"
                        @loadTop="loadTopFn"
                        @loadBottom="loadBottomFn"
                        :param="{status:'已完成', list:'completed'}"
                        :topStatus="topStatus">
            <empty v-show="!completed.length"></empty>
            <cus-cell class="multiple"
                      :key="item.id"
                      :title="'合同编号:'+ item['Agree Number']"
                      @click.native="toDetailFn(item)"
                      v-for="item in completed"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">工程: {{item['Lead Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">更新日期: {{new Date(item['Updated']).format('yyyy-MM-dd hh:mm:ss')}}</div>
            </cus-cell>
          </cus-loadmore>

        </mt-tab-container-item>
      </mt-tab-container>

    </div>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import cusHeader from 'public/components/cus-header';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'index';
  // mapp
  let mapp = config.mapp;
  // 用户角色 => 状态
  let status = mapp['manager'];
  let list = mapp['list'];
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend({
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    // 获取团队列表
    me.getTransferOrder(param);
  };

  export default {
    name: NAMESPACE,
    components: {cusHeader, cusLoadmore, cusCell},
    // 数据初始化
    created() {
      this.loadBottomFn({
        status: '待处理',
        list: 'pending'
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
      ...mapState(NAMESPACE, ['pending', 'process', 'completed'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getTransferOrder']),
      // 标题栏菜单选择回调方法
      menuFn(item) {
        console.log(item);
      },
      // 已完成顶部加载
      loadTopFn(param) {
        loader.call(this, {
          data: {
            'Status': status[param.status]
          }
        }, param.list, 'onTopLoaded');
      },
      // 待审批底部加载
      loadBottomFn(param) {
        loader.call(this, {
          data: {
            'Status': status[param.status]
          },
          more: true
        }, param.list, 'onBottomLoaded');
      },
      // 跳转搜索
      toSearchFn() {
        this.$router.push('search');
      },
      // To detail or create
      toDetailFn(item) {
        this.$router.push({
          name: 'detail',
          query: {
            status: list[item.Status],
            id: item.Id
          }
        });
      }
    }
  };
</script>
