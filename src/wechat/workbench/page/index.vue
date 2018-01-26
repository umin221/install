<template>
  <div>
    <mt-header fixed title="工作台">
    </mt-header>

    <mt-cell title="标题文字" is-link>
      <span style="color: green">这里是元素</span>
    </mt-cell>
    <mt-cell  v-for="(item, index) in listObj" :title="item.vul"  @click.native="getList" is-link>
      <img slot="icon" src="" width="24" height="24">
    </mt-cell>
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
        listObj: [
          {'id': 1, 'vul': '工作计划'},
          {'id': 1, 'vul': '安装打卡'},
          {'id': 1, 'vul': '安装交接单'},
          {'id': 1, 'vul': '安装订单'},
          {'id': 1, 'vul': '维修工单'},
          {'id': 1, 'vul': '维修订单'},
          {'id': 1, 'vul': '我的配件'},
          {'id': 1, 'vul': '配件领用'},
          {'id': 1, 'vul': '配件退入'},
          {'id': 1, 'vul': '委外人员管理'}
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapActions(NameSpace, ['getList'])
    }
  };
</script>
<style>
  .list-img {
    color: #A2BBFC;
  }
</style>
