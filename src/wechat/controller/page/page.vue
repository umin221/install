<template>
  <div>
    <mt-header fixed title="待办审批中心">
    </mt-header>

    <div class="mint-content">
      <mt-cell  v-for="(item, index) in listObj" :key="index" :title="item.vul"  @click.native="getUrl(item.id)" is-link>
      </mt-cell>
    </div>
  </div>
</template>

<script type="application/javascript">
  import {mapState} from 'vuex';

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      let module = KND.Util.getParam('module');
      let search = location.hash;
      MessageBox('模块', module);
      MessageBox('参数', search);
    },
    data: () => {
      return {
        active: 'tab-container1',
        listObj: [
          {'id': 'demo', 'vul': 'demo'},
          {'id': 'workPlan', 'vul': '工作计划'},
          /* {'id': 1, 'vul': '安装打卡'},*/
          {'id': 'transferOrder', 'vul': '安装交接单'},
          {'id': 'installOrder', 'vul': '安装订单'},
          {'id': 'serviceOrder', 'vul': '维修工单'},
          /* {'id': 1, 'vul': '维修订单'},
          {'id': 1, 'vul': '我的配件'},
          {'id': 1, 'vul': '配件领用'},
          {'id': 1, 'vul': '配件退入'},*/
          {'id': 'outsourcing', 'vul': '委外人员管理'}
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      getUrl(id) {
        let href = '../' + id + '/index.html' + location.search;
        document.location.href = href;
      }
    }
  };
</script>
<style>
  .list-img {
    color: #A2BBFC;
  }
</style>
