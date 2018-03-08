<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="维修工单列表">
      <fallback slot="left"></fallback>
      <router-link v-if="loginMeg['Job Title'] === '400'" to="addService" slot="right">
        <mt-button>
          <i class="xs-icon icon-add"></i>
        </mt-button>
      </router-link>
      <router-link v-if="loginMeg['Job Title'] === 'install'" to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div v-if="loginMeg['Job Title'] === 'install'" class="mint-content indexService">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">待处理</mt-tab-item>
        <mt-tab-item id="valid">处理中</mt-tab-item>
        <mt-tab-item id="invalid">已完成</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending" :loadTop="pendingLoadTop" :loadBottom="pendingLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div class="list-content" v-for="(item,index) in pending" @click="toDetail(item['SR Number'])" :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}<mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge></div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">申请时间: {{item.Created}}</div>
                <div class="my-cell-sub" slot="title">优先级: {{item.Priority}}</div>
                <div class="my-cell-sub" slot="title">地址:{{item['KL Personal Province']}} {{item['Personal City']}} {{item['Personal Street Address']}}</div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="valid">
          <loadmore ref="valid" :loadTop="validLoadTop" :loadBottom="validLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div class="list-content" v-for="(item,index) in valid" @click="toDetail(item['SR Number'])" :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}<mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge></div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">申请时间: {{item.Created}}</div>
                <div class="my-cell-sub" slot="title">优先级: {{item.Priority}}</div>
                <div class="my-cell-sub" slot="title">地址:{{item['KL Personal Province']}} {{item['Personal City']}} {{item['Personal Street Address']}}</div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="invalid">
          <loadmore ref="invalid" :loadTop="invalidLoadTop" :loadBottom="invalidLoadBottom" :topStatus="topStatus" :allLoaded="true">
            <div class="list-content" v-for="(item,index) in invalid" @click="toDetail(item['SR Number'])" :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}<mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge></div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">申请时间: {{item.Created}}</div>
                <div class="my-cell-sub" slot="title">优先级: {{item.Priority}}</div>
                <div class="my-cell-sub" slot="title">地址:{{item['KL Personal Province']}} {{item['Personal City']}} {{item['Personal Street Address']}}</div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <div v-else-if="loginMeg['Job Title'] === '400'" class="mint-content customService" >
      <loadmore :loadTop="loadTop" ref="pending">
        <div class="list-content" v-for="(item,index) in cusService" @click="toDetail(item['SR Number'],item['Contact Id'])" :key="index">
          <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}<mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge></div>
          <mt-cell class="multiple" is-link>
            <div class="my-cell-sub" slot="title">申请时间: {{item.Created}}</div>
            <div class="my-cell-sub" slot="title">优先级: {{item.Priority}}</div>
            <div class="my-cell-sub" slot="title">地址:{{item['KL Personal Province']}} {{item['Personal City']}} {{item['Personal Street Address']}}</div>
          </mt-cell>
        </div>
      </loadmore>
    </div>
  </div>
</template>
<style lang="scss">
  .indexService,.customService{
    .mint-loadmore{
      .mint-loadmore-content{
        padding: 0 10px ;
        .mint-cell{
          height: 100px;
        }
      }
    }
  }
  .list-content{
    background: white;
    padding: 0 1rem;
    margin-top: 0.5rem;
    .my-title{
      font-size: 0.7rem;
      line-height: 2rem;
      background-position: bottom;
      .badge-status{
        line-height: 0.75rem;
        width: 2.7rem;
        margin-top: 0.5rem;
      }
    }
    .multiple{
      background-position: unset;
      .mint-cell-wrapper{
        padding: 0;
      .mint-cell-title{
        .my-cell-sub{
          line-height: 1.5rem;
          font-size: 0.6rem;
        }
      }
      }
    }
  }
  .badge-status{
    float: right;
    padding: 0 5px;
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  //
  const NameSpace = 'index';
  const COUNT = config.pageSize;
  //
  let loader = function(...args) {
    let me = this;
    let event = args.pop();
    let list = args.pop();
    let param = args.pop();
    me.getList(Object.assign({
      callback: (data) => {
        me.$refs[list][event](data < COUNT);
      }
    }, param));
  };

  export default {
    name: NameSpace,
    created() {
      loader.call(this, 'pending', 'onBottomLoaded');
    },
    data: () => {
      return {
        selected: 'pending',
        topStatus: '',
        list: [],
        number: []
      };
    },
    computed: {
      ...mapState(NameSpace, ['loginMeg', 'pending', 'valid', 'invalid', 'cusService'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      toSearch() {
        this.$router.push({path: '/search'});
      },
      loadTop() {
        loader.call(this, 'pending', 'onTopLoaded');
      }, // 底部加载
      loadBottom() {
      },
      pendingLoadTop() {
        loader.call(this, 'pending', 'onTopLoaded');
      },  // 待处理下拉
      pendingLoadBottom() {
        loader.call(this, {
          more: true
        }, 'pending', 'onBottomLoaded');
      },  // 待处理上拉
      validLoadTop() {
        loader.call(this, {
          status: '有效'
        }, 'valid', 'onTopLoaded');
      },  // 处理中下拉
      validLoadBottom() {
        loader.call(this, {
          more: true,
          status: '有效'
        }, 'invalid', 'onBottomLoaded');
      },  // 处理中上拉
      invalidLoadTop() {
        loader.call(this, {
          status: '失效'
        }, 'valid', 'onTopLoaded');
      },  // 已完成下拉
      invalidLoadBottom() {
        loader.call(this, {
          more: true,
          status: '有效'
        }, 'valid', 'onBottomLoaded');
      },  // 已完成上拉
      clickAdd() {
        this.$router.push({path: '/addService'});
      },
      toDetail(type, name) {
        this.$router.push({
          name: 'serviceDetail',
          query: {
            type: type,
            id: name
          }
        });
      }
    },
    components: {loadmore, cusCell}
  };
</script>
