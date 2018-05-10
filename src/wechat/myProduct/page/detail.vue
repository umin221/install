<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="出入库明细" >
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="DestinationList"
                     @click.native="!DestinationList.length && loadBottomFn({status:'入库', list:'DestinationList'})">入库</mt-tab-item>
        <mt-tab-item id="SourceList"
                     @click.native="!SourceList.length && loadBottomFn({status:'出库', list:'SourceList'})">出库</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="DestinationList">
          <loadmore ref="DestinationList"
            @loadTop="loadTopFn"
            @loadBottom="loadBottomFn"
            :topStatus="topStatus"
            :param="{status:'入库', list:'DestinationList'}"
            :allLoaded="true">
            <cus-cell class="multiple"
                      v-for="(item, index) in DestinationList"
                      :key="item.Id"
                      :title="'源库名称:'+  item['Source Inventory']">
              <div class="mint-cell-sub-title" slot="title">订单编号：{{item['KL Order Number']}}</div>
              <div class="mint-cell-sub-title" slot="title">交易类型：{{item['Transaction Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">交易时间：{{toDate(item['Transaction Date'])}}</div>
              <div class="mint-cell-sub-title" slot="title">数量：{{item['Quantity']}}</div>
            </cus-cell>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="SourceList">
          <loadmore ref="SourceList"
                    @loadTop="loadTopFn"
                    @loadBottom="loadBottomFn"
                    :topStatus="topStatus"
                    :param="{status:'出库', list:'SourceList'}"
                    :allLoaded="true">
            <cus-cell class="multiple"
                      v-for="(item, index) in SourceList"
                      :key="item.Id"
                      :title="'目标库名称 :'+ item['Destination Inventory']">
              <div class="mint-cell-sub-title" slot="title">订单编号：{{item['KL Order Number']}}</div>
              <div class="mint-cell-sub-title" slot="title">交易类型：{{item['Transaction Type']}}</div>
              <div class="mint-cell-sub-title" slot="title">交易时间：{{toDate(item['Transaction Date'])}}</div>
              <div class="mint-cell-sub-title" slot="title">数量：{{item['Quantity']}}</div>
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
  const NAMESPACE = 'detail';
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
    me.getDetail(param);
  };
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.InvID = me.$route.query.InvID;
      me.ProductId = me.$route.query.ProductId;
      me.setManager();
      me.loadTopFn({status: '入库', list: 'DestinationList'});
    },
    data: () => {
      return {
        InvID: '',
        ProductId: '',
        selected: 'DestinationList',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['DestinationList', 'SourceList'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getDetail']),
      ...mapMutations(NAMESPACE, ['setManager']),
      // 顶部下拉加载
      toDate(time) {
        if (time) {
          return KND.Util.format(time, 'yyyy-MM-dd hh:mm:ss');
        } else {
          return '';
        }
      },
      loadTopFn(param) {
        let me = this;
        console.log(me);
        loader.call(this, {
          data: {
            'Status': param.status,
            'InvID': me.InvID,
            'ProductId': me.ProductId
          }
        }, param.list, 'onTopLoaded');
      }, // 底部加载
      loadBottomFn(param) {
        let me = this;
        loader.call(this, {
          data: {
            'Status': param.status,
            'InvID': me.InvID,
            'ProductId': me.ProductId
          },
          more: true
        }, param.list, 'onBottomLoaded');
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
