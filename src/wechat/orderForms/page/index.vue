<template>
  <div style="background-color: #ebebeb;">
    <cus-header fixed :title="isTeam ? '团队的服务订单' : '我的服务订单'" :menu="isManager ? [isTeam ? {title:'我的服务订单', key:'my'} : {title:'查看我的团队', key:'team'}] : undefined">
      <fallback slot="left"></fallback>
      <router-link to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </cus-header>
    <div class="mint-content">
      <!--<loadmore ref="pending"
                @loadTop="pendingLoadTop"
                @loadBottom="pendingLoadBottom"
                :param="isTeam"
                :topStatus="topStatus"
                :allLoaded="true">
        <cus-cell
          v-for="(item,index) in orderEntry"
          :key="index"
          class="multiple"
           @click.native="toDateil(item['Order Number'])" is-link>
          <div class="mint-cell-sub-title" slot="title">维修订单号： {{item['Order Number']}}</div>
          <div class="mint-cell-sub-title" slot="title">EBS订单编号: {{item['Back Office Order Number']}}</div>
          <div class="mint-cell-sub-title" slot="title">WMS订单编号: {{item['KL WMS Order Number']}}</div>
          <div class="mint-cell-sub-title" slot="title">订单总额： ￥{{item['Order Total']}}</div>
        </cus-cell>
      </loadmore>-->
      <mt-tab-container-item>
        <loadmore ref="pending"
                  :allLoaded="true"
                  @loadTop="loadTopFn"
                  :topStatus="topStatus"
                  @loadBottom="loadBottomFn"
                  :param="{status:'待处理', list:'pending'}">
          <cus-cell
            class="multiple border-bottom"
            :title="'维修订单号'+ item['Order Number']"
            v-for="(item,index) in orderEntry"
            @click.native="toDateil(item['Order Number'])"
            :key="index"
            is-link>
            <div class="mint-cell-sub-title" slot="title">EBS订单编号: {{item['Back Office Order Number']}}</div>
            <div class="mint-cell-sub-title" slot="title">WMS订单编号: {{item['KL WMS Order Number']}}</div>
            <div class="mint-cell-sub-title" slot="title">订单总额： ￥{{item['Order Total']}}</div>
          </cus-cell>
        </loadmore>
      </mt-tab-container-item>
    </div>
  </div>
</template>
<script type="application/javascript">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusHeader from 'public/components/cus-header';
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  //
  let userName = '';
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend(true, {
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    me.getList(param);
  };
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      KND.Native.getUserInfo((info) => {
        userName = info;
        me.setManager(info['KL Primary Position Type LIC'] === 'Field Service Manager');
      });
      me.pendingLoadTop(me.isTeam);
    },
    data: () => {
      return {
        selected: 'pending',
        topStatus: '',
        isSelect: []
      };
    },
    computed: {
      ...mapState(NameSpace, ['loginMeg', 'orderEntry', 'isTeam', 'isManager'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      ...mapMutations(NameSpace, ['setManager', 'setTeam']),
      menuFn(item) {
        this.setTeam(item.key === 'team');
        this.pendingLoadTop(item.key === 'team');
        // 刷新数据
      },
      toDateil(name) {
        console.log(name);
        this.$router.push({
          name: 'detail',
          query: {
            type: name
          }
        });
      },
      loadTopFn(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          }
        }, param.list, 'onTopLoaded');
      }, // 底部加载
      loadBottomFn(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          },
          more: true
        }, param.list, 'onBottomLoaded');
      },
      pendingLoadTop(param) {
        loader.call(this, {
          data: {team: param, Owner: userName['KL Employee Full Name']}}, 'pending',
          'onTopLoaded');
      },
      pendingLoadBottom(param) {
        loader.call(this, {
          data: {team: param, Owner: userName['KL Employee Full Name']},
          more: true}, 'pending',
          'onBottomLoaded');
      }
    },
    components: {loadmore, cusCell, cusHeader}
  };
</script>
<style lang="scss">
  .icon-select:before {
    content: '\A160';
    position: absolute;
    right: 1rem;
    top: 0.5rem;
  }
</style>
