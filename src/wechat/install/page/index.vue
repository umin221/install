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
    <div class="wrapper install">

      <div class="mint-content">

        <cus-loadmore ref="pending"
                      @loadTop="loadTopFn"
                      @loadBottom="loadBottomFn"
                      :loadmore="false">
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
    // 获取批次列表
    me.queryInstallTask({
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
      let info = KND.Util.parse(KND.Session.get('userInfo'));
      if (info) {
        if (info.Id !== user.Id) {
          user = info;
          // 获取数据
          this.loadBottomFn();
        }
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
      ...mapActions(NAMESPACE, ['queryInstallTask', 'logout']),
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
      // 注销登录
      logoutFn() {
        let me = this;
        // 注销用户登录
        me.logout({
          success: result => {
            // 清除用户信息 下次匹配后刷新本地缓存
            user = {};
            KND.Session.remove('userInfo');
            // 重定向到登录
            me.$router.replace({
              name: 'login',
              query: {login: true} // 重定向登陆页必须携带此参数
            });
          }
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

  #app {
    > div {
      overflow: hidden;

      > .wrapper {
        position: absolute;
        width: 100%;
        top: $header-height;
        bottom: 0;
        overflow: scroll;

        &.install {
          top: 4rem;
        }
      }
    }
  }

  div.mint-indicator-wrapper {
    background-color: #000;
  }
</style>
