<template>
  <div style="background-color: #ebebeb;">
    <cus-header fixed title="我的配件" :menu="[{title:'查看我的团队', key:'a'}]">
      <fallback slot="left"></fallback>
      <router-link to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </cus-header>
    <div class="mint-content">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">配件库</mt-tab-item>
        <mt-tab-item id="valid">不良库</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending" 
          @loadTop="pendingLoadTop" 
          @loadBottom="pendingLoadBottom" 
          :topStatus="topStatus" 
          :param="{status:'配件库', list:'pending'}"
          :allLoaded="true">
            <!-- <cus-cell
              :title="'配件型号'+item.No"
              v-for="(item,index) in isSelect"
              :value="item.type"
              :key="index">
              <div class="productForm" slot="title">配件名称： {{item.name}}</div>
              <div class="productForm" slot="title">库存量： {{item.num}}</div>
            </cus-cell> -->
            <div class="item-list cus-cell" 
              v-for="(item,index) in isSelect"
              :key="index">
               <mt-cell class="border-bottom" :title="'配件型号：'+item.No"><span style="color:#00519B">{{item.type}}</span></mt-cell>
               <mt-cell class="gray" :title="'配件名称：'+item.name"></mt-cell>
               <mt-cell class="gray" :title="'库存量：'+item.num"></mt-cell>
            </div>
         <!-- <div class="productForm" slot="title">配件名称： {{item.name}}</div>
              <div class="productForm" slot="title">库存量： {{item.num}}</div> -->
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="valid">
          <loadmore ref="valid" :loadTop="validLoadTop" :loadBottom="validLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div class="item-list cus-cell" 
              v-for="(item,index) in isSelect"
              :key="index">
                <mt-cell class="border-bottom" :title="'配件型号：'+item.No"><span style="color:#00519B">{{item.type}}</span></mt-cell>
               <mt-cell class="gray" :title="'配件名称：'+item.name"></mt-cell>
               <mt-cell class="gray" :title="'库存量：'+item.num"></mt-cell>
            </div>
           
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import cusHeader from 'public/components/cus-header';
  import loadmore from 'public/components/cus-loadmore';
  
  const NAMESPACE = 'index';

  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = Object.extend(true, {
      callback: (data) => {
        me.$refs[list][event]();
      }
    }, args.pop() || {});
    // 数据列表
    me.getMyProduct(param);
  };

  export default {
    name: NAMESPACE,
    created() {
      for (let i = 0; i < 3; i++) {
        let obj = {name: 'SRR0201712160002', num: '110', type: '维修配件', No: '1-SDSADAA2'};
        this.isSelect.push(obj);
      }
    },
    data: () => {
      return {
        selected: 'pending',
        topStatus: '',
        isSelect: []
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['currentYear'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getMyProduct']),
      // 切换头部菜单
      menuFn(item) {
        console.log(item);
      },
      // 顶部下拉加载
      pendingLoadTop(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          }
        }, param.list, 'onTopLoaded');
      },
      // 底部下拉加载
      pendingLoadBottom(param) {
        loader.call(this, {
          data: {
            'Status': param.status
          },
          more: true
        }, param.list, 'onBottomLoaded');
      },
      validLoadTop() {
      },
      validLoadBottom() {
      }
    },
    components: {loadmore, cusHeader}
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
