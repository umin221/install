<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="我的维修订单">
      <fallback slot="left"></fallback>
      <router-link to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div class="mint-content indexService">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">待处理</mt-tab-item>
        <mt-tab-item id="valid">处理中</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending" :loadTop="pendingLoadTop" :loadBottom="pendingLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div v-for="(item,index) in isSelect" :key="index">
              <mt-cell :class='{"xs-icon":true,"icon-select":item.active}' @click.native="item.active = !item.active">
                <div slot="title" >维修订单号:<span @click="toDateil(item.id)">{{item.date}}</span></div>
                <div slot="title">订单总额: 100￥</div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="valid">
          <loadmore ref="valid" :loadTop="validLoadTop" :loadBottom="validLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div v-for="(item,index) in 10" :key="index">
              <mt-cell :class='{"xs-icon":true,"icon-select":item.active}' @click.native="item.active = !item.active">
                <router-link to="search" slot="right">
                  <div slot="title">维修订单号:<span @click.native="toDateil(item.id)">{{item.date}}</span></div>
                </router-link>
                <div slot="title">订单总额: 100￥</div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
        <button-group>
          <mt-button type="primary" class="single" @click.native="changeBtnStote"  >提交</mt-button>
        </button-group>
    </div>
  </div>
</template>
<script type="application/javascript">
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  import buttonGroup from 'public/components/cus-button-group';
  //
  const NameSpace = 'index';

  export default {
    name: NameSpace,
    created() {
      for (let i = 0; i < 10; i++) {
        let obj = {active: false, date: 'SRR0201712160002', id: '110'};
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
    },
    methods: {
      selectOrder(index) {                    // 点击选中
        this.isSelect[index].active = true;
      },
      toDateil(name) {
        this.$router.push({
          name: 'detail',
          query: {
            id: name
          }
        });
      },
      pendingLoadTop() {
      },
      pendingLoadBottom() {
      },
      validLoadTop() {
      },
      validLoadBottom() {
      }
    },
    components: {loadmore, cusCell, buttonGroup}
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
