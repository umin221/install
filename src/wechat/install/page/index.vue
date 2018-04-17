<!--委外团队列表-->
<template>
  <div>
    <mt-header fixed title="安装批次列表">
      <mt-button class="logout" slot="left"
        @click.native="logoutFn">注销</mt-button>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
    </mt-header>

    <indicator></indicator>
    <div class="tips">下拉更新数据</div>
    <div class="mint-content install">

      <!--<mt-navbar v-model="selected" v-if="isManager">-->
        <!--<mt-tab-item id="pending"-->
          <!--@click.native="!pending.length && loadBottomFn({status:'待处理', list:'pending'})">待处理</mt-tab-item>-->
        <!--<mt-tab-item id="completed"-->
          <!--@click.native="!completed.length && loadBottomFn({status:'已完成', list:'completed'})">已完成</mt-tab-item>-->
      <!--</mt-navbar>-->
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
                     :key="item.Id"
                     :title="'订单批次:'+ item.Id"
                     v-for="item in pending"
                     is-link>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">创建日期: {{item['Created']}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>

        <!--<mt-tab-container-item id="completed">-->
          <!--<cus-loadmore ref="completed"-->
                        <!--@loadTop="loadTopFn"-->
                        <!--@loadBottom="loadBottomFn"-->
                        <!--:param="{status: '已完成', list: 'completed'}"-->
                        <!--:topStatus="topStatus">-->
            <!--<cus-cell class="multiple"-->
                      <!--@click.native="toDetailFn(item.Id)"-->
                     <!--:key="item.Id"-->
                     <!--:title="'订单批次:'+ item.Id"-->
                     <!--v-for="item in completed"-->
                     <!--is-link>-->
              <!--<div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>-->
              <!--<div class="mint-cell-sub-title" slot="title">创建日期: {{item['Created']}}</div>-->
            <!--</cus-cell>-->
          <!--</cus-loadmore>-->
        <!--</mt-tab-container-item>-->

      </mt-tab-container>

    </div>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'index';
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend({
      list: list,
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop());
    // 获取团队列表
    me.queryInstallTask(param);
  };

  export default {
    name: NAMESPACE,
    // 数据初始化
    created() {
      // 获取数据
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
      ...mapState(NAMESPACE, ['pending', 'completed', 'isManager'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryInstallTask', 'logout']),
      // 已失效顶部加载
      loadTopFn(param) {
        loader.call(this, {
          mode: 'refresh'
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
      // 注销登录
      logoutFn() {
        let me = this;
        tools.cordova.confirm('注销将清除本地缓存数据，确定要注销登录吗？', mode => {
          if (mode === 1) return;
          // 注销用户登录
          me.logout({
            success: result => {
              console.log(result);
              me.$router.replace({
                name: 'login',
                query: {login: true} // 重定向登陆页必须携带此参数
              });
            }
          });
        });
      },
      // 跳转搜索
      toSearchFn() {
        this.$router.push('search');
      },
      // To detail or create
      toDetailFn(id) {
        this.$router.push({
          name: 'assets',
          query: {
            TaskId: id
          }
        });
        // 标记楼栋资产刷新
        KND.Session.set('refreshAssets', true);
      }
    },
    components: {cusLoadmore, cusCell}
  };
</script>

<style lang="scss">
  .logout {
    text-indent: 10px;
  }

  .tips {
    position: fixed;
    top: 2.4rem;
    width: 100%;
    background-color: #fff;
    font-size: $font-size-default;
    text-align: center;
    padding: 6px 0;
    color: $theme-color;
    z-index: 1;
  }

  #app .mint-content.install {
    top: 3.8rem;
  }

  div.mint-indicator-wrapper {
    background-color: #000;
  }
</style>
