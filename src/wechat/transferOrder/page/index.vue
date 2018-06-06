<!--交接单列表-->
<template>
  <div>
    <cus-header fixed :title="isTeam ? '团队的交接单' : '我的交接单'" :menu="viewTeam ? [isTeam ? {title:'我的交接单', key:'my'} : {title:'查看我的团队', key:'team'}] : undefined">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
    </cus-header>

    <div class="mint-content">

      <mt-navbar v-model="selected">
        <mt-tab-item v-for="(value, key) in navs"
                     v-text="value.label"
                     :id="key"
                     :key="key"
                     @click.native="!rows.length && loadBottomFn(key)"></mt-tab-item>
      </mt-navbar>

      <!-- tab-container -->
      <mt-tab-container v-model="selected">
        <mt-tab-container-item v-for="(value, key) in navs"
                               :key="key"
                               :id="key">
          <cus-loadmore :ref="key"
                        :param="key"
                        :topStatus="topStatus"
                        @loadTop="loadTopFn"
                        :data-rows="rows"
                        @loadBottom="loadBottomFn">
            <cus-cell class="multiple"
                      v-for="item in rows"
                      :key="item.id"
                      :title="'合同编号:'+ item['Agree Number']"
                      @click.native="toDetailFn(item)"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">工程名称: {{item['Opportunity Name']}}</div>
              <div v-if="isTeam" class="mint-cell-sub-title" slot="title">负责人: {{item['Project Owner Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">更新日期: {{new Date(item['Updated']).format('yyyy-MM-dd hh:mm:ss')}}</div>
            </cus-cell>
          </cus-loadmore>
        </mt-tab-container-item>
      </mt-tab-container>

    </div>

  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusHeader from 'public/components/cus-header';
  import cusLoadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  //
  let loader = function(...args) {
    let me = this;
    let type = args.shift();
    let more = args.shift();
    // 获取团队列表
    me.getTransferOrder({
      type,
      more,
      callback: data => {
        me.$refs[type][0][more ? 'onBottomLoaded' : 'onTopLoaded'](data.length);
      }
    });
  };

  const NAMESPACE = 'index';
  export default {
    name: NAMESPACE,
    components: {cusHeader, cusLoadmore, cusCell},
    // 数据初始化
    created() {
      let me = this;
      KND.Native.getUserInfo((info) => {
        config.userInfo = info;
        let position = info['KL Primary Position Type LIC'];
        // 设置用户权限
        me.setAuthority(position);
        // 主管可查看团队视图
        me.viewTeam = position === 'Field Service Manager';
        // 获取列表数据
        me.loadTopFn('pending');
      });
    },
    data: () => {
      return {
        // 活跃tab
        selected: 'pending',
        // 下拉状态
        topStatus: '',
        // 是否可查看团队交接单
        viewTeam: false
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['navs', 'pending', 'process', 'completed', 'isManager', 'isTeam']),
      rows() {
        let type = this.selected;
        return this[type];
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['getTransferOrder']),
      ...mapMutations(NAMESPACE, ['setTeam', 'setAuthority']),
      ...mapMutations('engineer', ['selEngineer']),
      // 标题栏菜单选择回调方法
      menuFn(item) {
        this.setTeam(item.key === 'team');
        // 刷新数据
        this.loadBottomFn('pending');
        // 切换回待处理
        this.selected = 'pending';
      },
      // 已完成顶部加载
      loadTopFn(type) {
        loader.call(this, type, false);
      },
      // 待审批底部加载
      loadBottomFn(type) {
        loader.call(this, type, true);
      },
      // 跳转搜索
      toSearchFn() {
        this.$router.push('search');
      },
      // To detail or create
      toDetailFn(item) {
        // 清空工程师选择结果
        this.selEngineer();
        // 跳转详情
        this.$router.push({
          name: 'detail',
          query: {
            id: item.Id
          }
        });
      }
    }
  };
</script>
