<template>
  <div style="background-color: #ebebeb;">
    <mt-header fixed title="维修工单列表">
      <fallback slot="left"></fallback>
      <router-link v-if="role === 'custom'" to="addService" slot="right">
        <mt-button>
          <i class="xs-icon icon-add"></i>
        </mt-button>
      </router-link>
      <router-link v-else-if ="role === 'install'" to="search" slot="right">
        <mt-button >
          <i class="xs-icon icon-search"></i>
        </mt-button>
      </router-link>
    </mt-header>

    <div v-if="role === 'install'" class="mint-content indexService">
      <mt-navbar v-model="selected">
        <mt-tab-item id="pending"
                     @click.native="!pending.length && loadBottomFn({status:'待处理', list:'pending'})">待处理</mt-tab-item>
        <mt-tab-item id="process"
                     @click.native="!process.length && loadBottomFn({status:'处理中', list:'process'})">处理中</mt-tab-item>
        <mt-tab-item id="completed"
                     @click.native="!completed.length && loadBottomFn({status:'已完成', list:'completed'})">已完成</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="selected">
        <mt-tab-container-item id="pending">
          <loadmore ref="pending"
                    @loadTop="loadTopFn"
                    @loadBottom="loadBottomFn"
                    :auto-fill="true"
                    :param="{status:'待处理', list:'pending'}"
                    :topStatus="topStatus" :allLoaded="true">
            <div class="list-content" v-for="(item,index) in pending" @click="toDetail(item['SR Number'],item['Id'])" :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}
                <mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge>
              </div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">
                  申请时间: {{toDate(item.Created)}}
                </div>
                <div class="my-cell-sub" slot="title">
                  优先级: {{item.Priority}}
                </div>
                <div class="my-cell-sub" slot="title">
                  地址:{{item['KL Province']}} {{item['KL City']}} {{item['KL Town']}} {{item['KL Address']}} {{item['KL Building']}} {{item['KL Floor']}} {{item['KL Room']}}
                </div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="process">
          <loadmore ref="process"
                    @loadTop="loadTopFn"
                    @loadBottom="loadBottomFn"
                    :param="{status:'处理中', list:'process'}"
                    :topStatus="topStatus"
                    :allLoaded="true">
            <div class="list-content" v-for="(item,index) in process" @click="toDetail(item['SR Number'],item['Id'])" :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}
                <mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge>
              </div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">
                  申请时间: {{toDate(item.Created)}}
                </div>
                <div class="my-cell-sub" slot="title">
                  优先级: {{item.Priority}}
                </div>
                <div class="my-cell-sub" slot="title">
                  地址:{{item['KL Province']}} {{item['KL City']}} {{item['KL Town']}} {{item['KL Address']}} {{item['KL Building']}} {{item['KL Floor']}} {{item['KL Room']}}
                </div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>

        <mt-tab-container-item id="completed">
          <loadmore ref="completed"
                    @loadTop="loadTopFn"
                    @loadBottom="loadBottomFn"
                    :param="{status:'已完成', list:'completed'}"
                    :topStatus="topStatus"
                    :allLoaded="true">
            <div class="list-content" v-for="(item,index) in completed" @click="toDetail(item['SR Number'], item['Id'])" :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}
                <mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge>
              </div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">
                  申请时间: {{toDate(item.Created)}}
                </div>
                <div class="my-cell-sub" slot="title">
                  优先级: {{item.Priority}}
                </div>
                <div class="my-cell-sub" slot="title">
                  地址:{{item['KL Province']}} {{item['KL City']}} {{item['KL Town']}} {{item['KL Address']}} {{item['KL Building']}} {{item['KL Floor']}} {{item['KL Room']}}
                </div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <div v-else-if="role === 'custom'" class="mint-content customService" >
      <mt-navbar v-model="cusSelected">
        <mt-tab-item id="cusPending"
                     @click.native="!cusPending.length && loadBottomFn({status:'待处理', list:'cusPending'})">待处理</mt-tab-item>
        <mt-tab-item id="cusProcess"
                     @click.native="!cusProcess.length && loadBottomFn({status:'已分配', list:'cusProcess'})">已分配</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="cusSelected">
        <mt-tab-container-item id="cusPending">
          <loadmore @loadTop="loadTopFn"
                    @loadBottom="loadBottomFn"
                    :param="{status:'待处理', list:'cusPending'}"
                    ref="cusPending">
            <div class="list-content"
                 v-for="(item,index) in cusPending"
                 @click="toDetail(item['SR Number'],item['Id'])"
                 :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}
                <mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge>
              </div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">
                  申请时间: {{toDate(item.Created)}}
                </div>
                <div class="my-cell-sub" slot="title">
                  优先级: {{item.Priority}}
                </div>
                <div class="my-cell-sub" slot="title">
                  地址:{{item['KL Province']}} {{item['KL City']}} {{item['KL Town']}} {{item['KL Address']}} {{item['KL Building']}} {{item['KL Floor']}} {{item['KL Room']}}
                </div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="cusProcess">
          <loadmore @loadTop="loadTopFn"
                    @loadBottom="loadBottomFn"
                    :param="{status:'已分配', list:'cusProcess'}"
                    ref="cusProcess">
            <div class="list-content"
                 v-for="(item,index) in cusProcess"
                 @click="toDetail(item['SR Number'],item['Id'])"
                 :key="index">
              <div class="my-title" slot="title">服务单编号:{{item['SR Number']}}
                <mt-badge class="badge-status" size="small">{{item.Status}}</mt-badge>
              </div>
              <mt-cell class="multiple" is-link>
                <div class="my-cell-sub" slot="title">
                  申请时间: {{toDate(item.Created)}}
                </div>
                <div class="my-cell-sub" slot="title">
                  优先级: {{item.Priority}}
                </div>
                <div class="my-cell-sub" slot="title">
                  地址:{{item['KL Province']}} {{item['KL City']}} {{item['KL Town']}} {{item['KL Address']}} {{item['KL Building']}} {{item['KL Floor']}} {{item['KL Room']}}
                </div>
              </mt-cell>
            </div>
          </loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <div v-else-if="role === 'other'" class="mint-content customService" >
      <empty></empty>
    </div>
  </div>
</template>
<script type="application/javascript">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import loadmore from 'public/components/cus-loadmore';
  import cusCell from 'public/components/cus-cell';
  import cusHeader from 'public/components/cus-header';
  //
  const NameSpace = 'index';
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
    name: NameSpace,
    created() {
      let me = this;
//      loader.call(this, 'pending', 'onTopLoaded');
      KND.Native.getUserInfo((info) => {
        let role = info['KL Primary Position Type LIC'];
        let status = '';
        let list = '';
        if (role === 'Field Service Manager' || role === 'Field Service Engineer') {
          role = 'install';
          status = '待处理';
          list = 'pending';
        } else if (role === 'Agent Manager' || role === 'Agent') {
          role = 'custom';
          status = '待处理';
          list = 'cusPending';
        } else {
          role = 'install';
          status = '待处理';
          list = 'pending';
        }
        me.setManager({
          role: role,
          owner: info['Emp #']
        });
        me.loadTopFn({status: status, list: list});
      });
      me.getLoginMeg();
    },
    activated() {
      let me = this;
      let list = KND.Session.get('reOrder');
      if (list) me.loadTopFn({status: '待处理', list: list});
      KND.Session.remove('reOrder');
    },
    data: () => {
      return {
        selected: 'pending',
        cusSelected: 'cusPending',
        topStatus: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['loginMeg', 'pending', 'process', 'completed', 'cusPending', 'cusProcess', 'role'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList', 'getLoginMeg']),
      ...mapMutations(NameSpace, ['setManager', 'setLoginMeg']),
      toSearch() {
        this.$router.push({path: '/search'});
      },
      toDate(time) {
        if (time) {
          return KND.Util.format(time, 'yyyy-MM-dd hh:mm:ss');
        } else {
          return '';
        }
      },
      loadTopFn(param) {
//        type = type || 'pending';
//        loader.call(this, type, 'onTopLoaded');

        loader.call(this, {
          data: {
            'Status': param.status
          }
        }, param.list, 'onTopLoaded');
      }, // 底部加载
      loadBottomFn(param) {
//        type = type || 'pending';
//        loader.call(this, type, 'onBottomLoaded');
        loader.call(this, {
          data: {
            'Status': param.status
          },
          more: true
        }, param.list, 'onBottomLoaded');
      },
      clickAdd() {
//        this.$router.push({path: '/addService'});
      },
      toDetail(type, srId) {
        this.$router.push({
          name: 'serviceDetail',
          query: {
            type: type,
            srId: srId
          }
        });
      }
    },
    components: {loadmore, cusCell, cusHeader}
  };
</script>
<style lang="scss">
  .indexService,.customService{
    .mint-loadmore{
      .mint-loadmore-content{
        padding: 0 0.5rem;
        .mint-cell{
          height: 5rem;
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
        margin-top: 0.5rem;
        width: 3rem;
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
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            width: 93%;
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
