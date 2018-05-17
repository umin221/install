<template>
  <div>
    <mt-header fixed title="公众号">
      <fallback slot="left"></fallback>
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
  import {mapState, mapMutations} from 'vuex';
  const NameSpace = 'index';
  export default {
    name: NameSpace,
    created() {
      let openId = KND.Util.getParam('openid');
      console.log(openId);
    },
    mounted() {
      Indicator.close();
    },
    data: () => {
      return {
        active: 'tab-container1',
        listObj: [
          {'id': 'submitService', 'vul': '我要报修', 'icon': 'demo'},
          {'id': 'myRepair', 'vul': '我的报修', 'icon': 'plan'},
          {'id': 'personal', 'vul': '个人中心', 'icon': 'transfer'},
          {'id': 'repairPolicy', 'vul': '报修政策', 'icon': 'install'},
          {'id': 'engineer', 'vul': '工程师通道', 'icon': 'service'},
          {'id': 'telValidate', 'vul': '电话报修', 'icon': 'service'}
        ]
      };
    },
    computed: {
      ...mapState(NameSpace, ['value'])
    },
    methods: {
      ...mapMutations('telValidate', ['clObj']),
      getUrl(id) {
        var self = this;
        if (id === 'telValidate') {
          self.clObj();
        }
        this.$router.push(id);
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
      }
    }
  }
</style>
