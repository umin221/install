<template>
  <div>
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
      <mt-button v-if="role === true" icon="more" slot="right" @click.native="clickAdd"></mt-button>
      <mt-button v-else icon="search" slot="right"></mt-button>
    </mt-header>
    <div v-if="role === true" class="mint-content indexService">
      <mt-navbar v-model="active">
        <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
      </mt-navbar>
      <loadmore :loadTop="loadTop" ref="load">
        <mt-tab-container v-model="active" :swipeable="true">
          <mt-tab-container-item v-for="tabItem in tabList" :key="tabItem.id" :id="tabItem.id">
            <mt-cell v-for="item in list" to="serviceDetail" :key="item.sevrs" is-link>
              <div>
                <div class="listContent">{{item.sevrs}}:{{item.savrsNo}}<span>{{item.store}}</span></div>
                <div class="listContent">{{item.date}}:{{item.dates}}</div>
                <div class="listContent">{{item.type}}:{{item.types}}</div>
                <div class="listContent" style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;width:80%;">{{item.addr}}:{{item.addrs}}</div>
              </div>
            </mt-cell>
          </mt-tab-container-item>
        </mt-tab-container>
      </loadmore>
    </div>
    <div v-else-if="role === false" class="mint-content customService" >
      <loadmore :loadTop="loadTop" ref="load">
        <mt-cell v-for="item in list" :to="{path:'/serviceDetail',query:{name:name,age:age}}" :key="item.sevrs" is-link>
          <div>
            <div class="listContent">{{item.sevrs}}:{{item.savrsNo}}<span>{{item.store}}</span></div>
            <div class="listContent">{{item.date}}:{{item.dates}}</div>
            <div class="listContent">{{item.type}}:{{item.types}}</div>
            <div class="listContent" style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;width:80%;">{{item.addr}}:{{item.addrs}}</div>
          </div>
        </mt-cell>
      </loadmore>
    </div>
  </div>
</template>
<style lang="scss">
  @mixin disFlex (){
    display: flex;
    justify-content:center;
    align-items: center;
  }
  .indexService{
    .mint-tab-container{
      .mint-tab-container-wrap{
        .mint-tab-container-item{
          .mint-loadmore{
            .mint-loadmore-content{
              .mint-cell{
                height: 4rem;
                @include disFlex();
                .address{
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow:ellipsis;
                  width:80%;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
<script type="application/javascript">
  import {mapState, mapActions} from 'vuex';
  import loadmore from 'public/components/cus-loadmore';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    data: () => {
      return {
        name: '名字',
        age: 11,
        role: true,
        active: 'tab-container1',
        headTitle: '维修工单列表',
        tabList: [
          {name: '待处理', id: 'tab-container1'},
          {name: '处理中', id: 'tab-container2'},
          {name: '已完成', id: 'tab-container3'}
        ],
        list: [
          {store: '未分配', sevrs: '服务编号', date: '申请日期', type: '产品类型', addr: '地址', savrsNo: 'AZ201706010001001', dates: '2018-1-26 14:00', types: '密码锁', addrs: '广东省，深圳市，南山区，科技园，联想大厦12楼'},
          {store: '未分配', sevrs: '服务编号', date: '申请日期', type: '产品类型', addr: '地址', savrsNo: 'AZ201706010001001', dates: '2018-1-26 14:00', types: '密码锁', addrs: '广东省，深圳市，南山区，科技园，联想大厦12楼'},
          {store: '未分配', sevrs: '服务编号', date: '申请日期', type: '产品类型', addr: '地址', savrsNo: 'AZ201706010001001', dates: '2018-1-26 14:00', types: '密码锁', addrs: '广东省，深圳市，南山区，科技园，联想大厦12楼'},
          {store: '未分配', sevrs: '服务编号', date: '申请日期', type: '产品类型', addr: '地址', savrsNo: 'AZ201706010001001', dates: '2018-1-26 14:00', types: '密码锁', addrs: '广东省，深圳市，南山区，科技园，联想大厦12楼'},
          {store: '未分配', sevrs: '服务编号', date: '申请日期', type: '产品类型', addr: '地址', savrsNo: 'AZ201706010001001', dates: '2018-1-26 14:00', types: '密码锁', addrs: '广东省，深圳市，南山区，科技园，联想大厦12楼'},
          {store: '未分配', sevrs: '服务编号', date: '申请日期', type: '产品类型', addr: '地址', savrsNo: 'AZ201706010001001', dates: '2018-1-26 14:00', types: '密码锁', addrs: '广东省，深圳市，南山区，科技园，联想大厦12楼'}
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList']),
      loadTop(value) {
        let _self = this;
        console.log(_self);
        _self.$refs.load.onTopLoaded();
      },
      clickAdd() {
        this.$router.push({path: '/addService'});
      }
    },
    components: {
      loadmore
    }
  };
</script>
