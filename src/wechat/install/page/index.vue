<!--委外团队列表-->
<template>
  <div>
    <mt-header fixed title="安装批次列表">
      <mt-button slot="left" @click.native="$router.push('setting')">
        <i class="xs-icon icon-person"></i>
      </mt-button>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
      <mt-button @click.native="$router.push('faq')" slot="right">
        <i class="xs-icon icon-question"></i>
      </mt-button>
    </mt-header>

    <indicator></indicator>
    <div class="tips">下拉获取最新任务</div>
    <div class="wrapper install">

      <div class="mint-content">

        <cus-loadmore ref="pending"
                      @loadTop="loadTopFn"
                      @loadBottom="loadBottomFn"
                      :loadmore="false">
          <cus-cell class="multiple"
                    v-for="item in pending"
                    @click.native="toDetailFn(item.Id)"
                    :key="item.Id"
                    :title="'订单批次:'+ item.Id"
                    is-link>
            <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
            <div class="mint-cell-sub-title" slot="title">批次名称: {{item['KL Task Batch Name']}}</div>
            <div class="mint-cell-sub-title" slot="title">创建日期: {{item['Created']}}</div>
          </cus-cell>
        </cus-loadmore>

      </div>
    </div>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';

  const NAMESPACE = 'index';
  let user = {};
  let loader = function(mode) {
    let me = this;
    let isEmp = !!user['KL Primary Position Type LIC'];
    // 获取批次列表
    me.queryInstallTask({
      key: isEmp ? 'queryEmpInstallTask' : 'queryInstallTask',
      data: {id: user.Id},
      mode: mode,
      list: 'pending',
      callback: () => {
        me.$refs['pending']['onTopLoaded']();
      }
    });
  };

  export default {
    name: NAMESPACE,
    // 数据初始化
    activated() {
      user = KND.Util.parse(KND.Session.get('userInfo'));
      // 页面刷新缓存标记 如果走接口登陆，获取最新批次任务
      let mode = KND.Session.get('mode');
      if (user) {
        // 移除刷新标记
        KND.Session.remove('mode');
        // 获取数据
        this[mode === 'refresh' ? 'loadTopFn' : 'loadBottomFn']();
      } else {
        this.$router.replace({
          name: 'login',
          query: {login: true} // 重定向登陆页必须携带此参数
        });
      }
    },
    data: () => {
      return {
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['pending', 'completed', 'isManager'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['queryInstallTask']),
      // 已失效顶部加载
      loadTopFn() {
        // 获取批次列表
        loader.call(this, 'refresh');
      },
      // 待审批底部加载
      loadBottomFn() {
        // 获取批次列表
        loader.call(this);
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
  .icon-person:before {
    content: '\A128';
  }
  .icon-question:before {
    content: '\A133';
    font-size: 1.1rem;
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
    font-weight: bold;
    z-index: 1;
  }

  #app {
    > div {
      overflow: hidden;
    }
  }

  div.mint-indicator-wrapper {
    background-color: #000;
  }
</style>
