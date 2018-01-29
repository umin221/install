<template>
  <div>
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
      <mt-button slot="right" icon="more">
      </mt-button>
    </mt-header>
    <div class="mint-content">
      <mt-navbar v-model="active">
        <mt-tab-item v-for="tab in tabList" :id="tab.id" :key="tab.id">{{tab.name}}</mt-tab-item>
      </mt-navbar>
      <mt-tab-container v-model="active" :swipeable="true">
        <mt-tab-container-item id="tab-container1">
          <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
            <mt-cell v-for="item in list" @click.native="getList" :key="item.sevrs" >
              <div>
                <div>{{item.sevrs}}:{{item.savrsNo}}<span>{{item.store}}</span></div>
                <div>{{item.date}}:{{item.dates}}</div>
                <div>{{item.type}}:{{item.types}}</div>
                <div style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;width:100%;">{{item.addr}}:{{item.addrs}}</div>
              </div>
            </mt-cell>
          </mt-loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container2">
          <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
            <mt-cell v-for="item in list" @click.native="getList"  :key="item.sevrs">
              <div>
                <div>{{item.sevrs}}:{{item.savrsNo}}<span>{{item.store}}</span></div>
                <div>{{item.date}}:{{item.dates}}</div>
                <div>{{item.type}}:{{item.types}}</div>
                <div style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;width:100%;">{{item.addr}}:{{item.addrs}}</div>
              </div>
            </mt-cell>
          </mt-loadmore>
        </mt-tab-container-item>
        <mt-tab-container-item id="tab-container3">
          <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange" ref="loadmore">
            <mt-cell v-for="item in list" @click.native="getList" :key="item.sevrs">
              <div>
                <div>{{item.sevrs}}:{{item.savrsNo}}<span>{{item.store}}</span></div>
                <div>{{item.date}}:{{item.dates}}</div>
                <div>{{item.type}}:{{item.types}}</div>
                <div style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;width:100%;">{{item.addr}}:{{item.addrs}}</div>
              </div>
            </mt-cell>
          </mt-loadmore>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
  </div>
</template>
<script type="application/javascript">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      api.get({
        key: 'getList',
        callback: function(data) {
          console.log(data);
        }
      });
    },
    data: () => {
      return {
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
      handleTopChange(status) {
        console.log(status);
      },
      loadTop() {
        console.log(this);
        this.$refs.loadmore.onTopLoaded();
      }
    }
  };
</script>
