<!--委外团队列表-->
<template>
  <div>
    <cus-header fixed :title="isTeam ? '团队的安装订单' : '我的安装订单'" :menu="isManager ? [isTeam ? {title:'我的安装订单', key:'my'} : {title:'查看我的团队', key:'team'}] : undefined">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSearchFn" slot="right">
        <i class="xs-icon icon-search"></i>
      </mt-button>
    </cus-header>

    <div class="mint-content">

      <mt-navbar v-model="selected">
        <mt-tab-item id="pending"
                     @click.native="!pending.length && loadBottomFn({status:'待处理', list:'pending'})"
                     v-if="isDoorEmp">待处理</mt-tab-item>
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
                      :key="item.Id"
                      :title="'订单编码:'+ item['Order Number']"
                      @click.native="toDetailFn(item.Id)"
                      v-for="item in pending"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">订单状态: {{item['Status']}}</div>
              <div class="mint-cell-sub-title" slot="title">销售类型: {{item['KL Delivery Sales Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
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
                      :key="item.Id"
                      :title="'订单编码:'+ item['Order Number']"
                      @click.native="toDetailFn(item.Id)"
                      v-for="item in process"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">订单状态: {{item['Status']}}</div>
              <div class="mint-cell-sub-title" slot="title">销售类型: {{item['KL Delivery Sales Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
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
                      :key="item.Id"
                      :title="'订单编码:'+ item['Order Number']"
                      @click.native="toDetailFn(item.Id)"
                      v-for="item in completed"
                      is-link>
              <div class="mint-cell-sub-title" slot="title">订单状态: {{item['Status']}}</div>
              <div class="mint-cell-sub-title" slot="title">销售类型: {{item['KL Delivery Sales Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">项目名称: {{item['KL Agreement Opportunity Name']}}</div>
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

  const NAMESPACE = 'index';
  // mapp
  let mapp = config.mapp;
  // 用户角色 => 状态
  let status = mapp['manager'];
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend({
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    // 获取安装订单
    console.dir('00000');
    me.getList(param, me.userInfo);
  };

  export default {
    name: NAMESPACE,
    components: {cusHeader, cusLoadmore, cusCell},
    // 数据初始化
    created() {
      var self = this;
      KND.Native.getUserInfo((info) => {
        self.userInfo = info;
        self.setInfoUser(info);
        console.log(self.userInfo);
        if (self.isDoorEmp) {
          self.tabVal = 'pending';
          self.tabStatus = '待处理';
          self.selected = 'pending';
        } else {
          self.tabVal = 'process';
          self.tabStatus = '处理中';
          self.selected = 'process';

          // 安装工程师或者安装主管，在处理中需要查询需要确认的订单
          mapp.manager['处理中'] = 'In Installing,Sales Confirmed,Submitted,In Confirming';
          mapp.list['In Installing,Sales Confirmed,Submitted,In Confirming'] = 'process';
        }
        // 获取安装订单数据
        this.loadBottomFn({
          status: self.tabStatus,
          list: self.tabVal
        });
        self.tabValMenu = self.tabVal;
        self.tabStatusMenu = self.tabStatus;
      });
    },
    // 列表刷新
    activated() {
      var self = this;
      let list = KND.Session.get('refresh');
      if (!list) return;
      KND.Native.getUserInfo((info) => {
        self.userInfo = info;
        self.setInfoUser(info);
        console.log(self.userInfo);
        if (self.isDoorEmp) {
          self.tabVal = 'pending';
          self.tabStatus = '待处理';
          self.selected = 'pending';
        } else {
          self.tabVal = 'process';
          self.tabStatus = '处理中';
          self.selected = 'process';

          // 安装工程师或者安装主管，在处理中需要查询需要确认的订单
          mapp.manager['处理中'] = 'In Installing,Sales Confirmed,Submitted,In Confirming';
          mapp.list['In Installing,Sales Confirmed,Submitted,In Confirming'] = 'process';
        }
        // 清空待处理数据
        self.setList();
        // 获取安装订单数据
        this.loadBottomFn({
          status: self.tabStatus,
          list: self.tabVal
        });
        KND.Session.remove('refresh');
      });
    },
    data: () => {
      return {
        tabVal: '',
        tabStatus: '',
        tabValMenu: '',
        tabStatusMenu: '',
        // 活跃tab
        selected: 'pending',
        userInfo: '',
        // 下拉状态
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['pending', 'process', 'completed', 'isManager', 'isTeam', 'taskIndex']),
//      是否门厂技术，包括门厂技术主管
      isDoorEmp() {
        let code = this.userInfo['KL Primary Position Type LIC'];
        // 安装工程师、门厂技术主管 部长
        this.setManager(code === 'Field Service Manager' || code === 'Door Factory Manager' || code === 'FS Department Manager');
        return code === 'Door Factory Engineer' || code === 'Door Factory Manager';
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['getList']),
      ...mapMutations(NAMESPACE, ['setInfoUser', 'setManager', 'setTeam', 'setList', 'setTaskIndex']),
      // 标题栏菜单选择回调方法
      menuFn(item) {
        var self = this;
        this.setTeam(item.key === 'team');
        self.loadBottomFn({
          status: self.tabStatusMenu,
          list: self.tabValMenu
        });
        // 切换已提交
        this.selected = self.tabValMenu;
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
      toDetailFn(id) {
        this.setTaskIndex(0);
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
