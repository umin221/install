<template>
  <div style="background-color: #ebebeb;">
    <cus-header fixed :title="isTeam ? '团队的配件' : '我的配件'" :menu="isManager ? [isTeam ? {title:'我的配件', key:'my'} : {title:'查看我的团队', key:'team'}] : undefined">
      <fallback slot="left"></fallback>
      <router-link to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </cus-header>
    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="PartsList"
                     @click.native="!PartsList.length && loadBottomFn({status:'配件库', list:'PartsList'})">配件库</mt-tab-item>
        <mt-tab-item id="badPartsList"
                     @click.native="!badPartsList.length && loadBottomFn({status:'不良库', list:'badPartsList'})">不良库</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="PartsList">
          <loadmore ref="PartsList"
            @loadTop="loadTopFn"
            @loadBottom="loadBottomFn"
            :topStatus="topStatus"
            :param="{status:'配件库', list:'PartsList'}"
            :allLoaded="true">
            <cus-cell class="multiple"
                      v-for="(item, index) in PartsList"
                      :key="item.Id"
                      @click.native="toDetail(item['Inventory Location ID'],item['Product ID'])"
                      :title="'配件代码:'+ item['Product Name']" is-link>
            <div slot="after" style="color: #0772c1">{{item.Type}}</div>
              <div class="mint-cell-sub-title" slot="title">配件名称：{{item['KL Product Name Join']}}</div>
              <div class="mint-cell-sub-title" slot="title">配件型号: {{item['KL Prod Model No']}}</div>
              <div class="mint-cell-sub-title" slot="title">库存量：{{item['KL Inventory Qty']}}</div>
              <div class="mint-cell-sub-title" slot="title" v-show="isTeam">负责人：{{item['KL Primary Employee Full Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">配件描述：{{item['KL Product Description']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="badPartsList">
          <loadmore ref="badPartsList"
                    @loadTop="loadTopFn"
                    @loadBottom="loadBottomFn"
                    :topStatus="topStatus"
                    :param="{status:'不良库', list:'badPartsList'}"
                    :allLoaded="true">
            <cus-cell class="multiple"
                      v-for="(item, index) in badPartsList"
                      :key="item.Id"
                      @click.native="toDetail(item['Inventory Location ID'],item['Product ID'])"
                      :title="'配件代码:'+ item['Product Name']" is-link>
              <div slot="after" style="color: #0772c1">{{item.Type}}</div>
              <div class="mint-cell-sub-title" slot="title">配件名称：{{item['KL Product Name Join']}}</div>
              <div class="mint-cell-sub-title" slot="title">配件型号: {{item['KL Prod Model No']}}</div>
              <div class="mint-cell-sub-title" slot="title">库存量：{{item['KL Inventory Qty']}}</div>
              <div class="mint-cell-sub-title" slot="title" v-show="isTeam">负责人：{{item['KL Primary Employee Full Name']}}</div>
              <div class="mint-cell-sub-title" slot="title">配件描述：{{item['KL Product Description']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script type="application/javascript">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusHeader from 'public/components/cus-header';
  import cusCell from 'public/components/cus-cell';
  import loadmore from 'public/components/cus-loadmore';
  const NAMESPACE = 'index';
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend(true, {
      callback: (data) => {
        me.$refs[list][event](data.length);
      }
    }, args.pop() || {});
    // 获取团队列表
    me.getList(param);
  };
  export default {
    name: NAMESPACE,
    created() {
      console.dir('000');
      let me = this;
      KND.Native.getUserInfo((info) => {
        me.setManager(info['KL Primary Position Type LIC'] === 'Field Service Manager');
        me.loadTopFn({status: '配件库', list: 'PartsList'});
      });
    },
    // 数据初始化
    activated() {
      console.dir('111');
      let me = this;
      KND.Native.getUserInfo((info) => {
        me.setManager(info['KL Primary Position Type LIC'] === 'Field Service Manager');
        me.loadTopFn({status: '配件库', list: 'PartsList'});
      });
    },
    data: () => {
      return {
        selected: 'PartsList',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['PartsList', 'badPartsList', 'isManager', 'isTeam'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getList']),
      ...mapMutations(NAMESPACE, ['setManager', 'setTeam', 'setList']),
      ...mapMutations('detail', ['setList']),
      // 切换头部菜单
      menuFn(item) {
        this.setTeam(item.key === 'team');
        this.setList();
        // 刷新数据
        this.loadBottomFn({
          status: '配件库',
          list: 'PartsList'
        });
        // 切换回待处理
        this.selected = 'PartsList';
      },
      // 顶部下拉加载
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
      toDetail(InvId, ProductId) {
        this.setList();
        this.$router.push({
          name: 'detail',
          query: {
            InvID: InvId,
            ProductId: ProductId
          }
        });
      }
    },
    components: {loadmore, cusHeader, cusCell}
  };
</script>
<style lang="scss">
  .productForm{
    line-height: 1.5rem;
  }
  .item-list{
    font-size: 0.75rem;
  }
  .mint-cell{
    min-height: 30px;
  }
  .border-bottom {
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 5px;
    padding-bottom: 5px;
  }
  .gray{
    color: #878787;
  }
  .cus-cell {
    position: relative;
    margin: 10px;
    padding: 10px;
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    font-size: 0.75rem;
}
</style>
