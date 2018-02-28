<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
      <router-link v-if="!role" to="addService" slot="right">
        <mt-button>
          <i class="xs-icon icon-add"></i>
        </mt-button>
      </router-link>
      <router-link v-if="role" to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </mt-header>
    <div v-if="role === true" class="mint-content indexService">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending">待审批</mt-tab-item>
        <mt-tab-item id="valid">已生效</mt-tab-item>
        <mt-tab-item id="invalid">已失效</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="load" :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" :allLoaded="true">
            <div class="list-content" v-for="(item,index) in list" @click="toDetail(item['SR Number'])" :key="index">
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
          <loadmore ref="load" :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" :allLoaded="true">
            <div class="list-content" v-for="(item,index) in list" @click="toDetail(item['SR Number'])" :key="index">
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
          <loadmore ref="load" :loadTop="loadTop" :loadBottom="loadBottom" :topStatus="topStatus" :allLoaded="true">
            <div class="list-content" v-for="(item,index) in list" @click="toDetail(item['id'])" :key="index">
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
    <div v-else-if="role === false" class="mint-content customService" >
      <loadmore :loadTop="loadTop" ref="load">
        <div class="list-content" v-for="(item,index) in list" @click="toDetail(item['SR Number'],item['Contact Id'])" :key="index">
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
  import api from '../api/api';
  import loadmore from 'public/components/cus-loadmore';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
      let me = this;
      api.get({
        key: 'getList',
        data: {
          'body': {
            'OutputIntObjectName': 'Base KL Service Request Interface BO',
            'SearchSpec': '[Service Request.Owner]="16113009"'
          }
        },
        success: function(data) {
          me.list = data.SiebelMessage['Service Request'];
          console.log(me.list);
        }
      });
    },
    data: () => {
      return {
        selected: 'pending',
        role: false,
        headTitle: '维修工单列表',
        topStatus: '',
        list: [],
        number: []
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      toSearch() {
        this.$router.push({path: '/search'});
      },
      loadTop() {
        let me = this;
        console.log(me.$refs.load);
        me.$refs.load.onTopLoaded();
      }, // 底部加载
      loadBottom() {
        let me = this;
        setTimeout(function() {
          me.$refs.load.onBottomLoaded();
        }, 1000);
      },
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
    components: {
      loadmore
    }
  };
</script>
