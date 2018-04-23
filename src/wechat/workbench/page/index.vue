<template>
  <div>
    <mt-header fixed title="安装及售后服务">
      <router-link to="switch" slot="right">
        <mt-button>切换用户</mt-button>
      </router-link>
    </mt-header>

    <div class="mint-content">
      <div class="workbench">
        <div class="co-flex co-ver co-jsa"
             @click="getUrl(item.id)"
             v-for="(item, index) in listObj"
             :key="index">
          <span class="xs-icon" :class="item.icon"></span>
          <span v-text="item.vul"></span>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="es6">
  import {mapState} from 'vuex';

  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created: () => {
      KND.Native.getUserInfo((userInfo) => {
        console.log(userInfo);
      });
    },
    data: () => {
      return {
        active: 'tab-container1',
        listObj: [
          // {'id': 'demo', 'vul': 'demo', 'icon': 'demo'},
          {'id': 'workPlan', 'vul': '工作计划', 'icon': 'plan'},
          {'id': 'transferOrder', 'vul': '安装交接单', 'icon': 'transfer'},
          {'id': 'installOrder', 'vul': '安装订单', 'icon': 'install'},
          {'id': 'serviceOrder', 'vul': '维修工单', 'icon': 'service'},
          {'id': 'orderForms', 'vul': '维修订单', 'icon': 'forms'},
          {'id': 'myProduct', 'vul': '我的配件'},
          {'id': 'productUse', 'vul': '配件领用', 'icon': 'use'},
//          {'id': 1, 'vul': '配件退入'},
          {'id': 'outsourcing', 'vul': '委外人员管理', 'icon': 'out'}
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      getUrl(id) {
        let join = '&';
        let search = location.search;
        if (!search.length) join = '?';
        document.location.href = (`../${id}/index.html${search}${join}timestamp=${new Date().getTime()}`);
      }
    }
  };
</script>

<style lang="scss">
  .workbench {
    background-color: #fff;

    div {
      display: inline-flex;
      width: 33%;
      height: 4rem;
      font-size: $font-size-default;
      text-align: center;
      padding: 10px 0;
      border-bottom: 1px solid #eaeaea;
      border-right: 1px solid #eaeaea;

      span.xs-icon {

        &:before {
          content: '\A176';
          font-size: 1.4rem;
          color: #4e9cf2;
        }

        &.plan:before {
          content: '\A170';
          color: #4e9cf2;
        }

        &.transfer:before {
          content: '\A172';
          color: #ffae48;
        }

        &.install:before {
          content: '\A173';
          color: #5bd47b;
        }

        &.service:before {
          content: '\A174';
          color: #ffae48;
        }

        &.forms:before {
          content: '\A175';
          color: #46c0e6;
        }

        &.out:before {
          content: '\A185';
          color: #46c0e6;
        }

        &.plan:before {
          content: '\A170';
          color: #4e9cf2;
        }

        &.Product:before {
          content: '\A170';
          color: #4e9cf2;
        }

        &.use:before {
          content: '\A178';
          color: #5bd47b;
        }
      }
    }
  }
</style>
