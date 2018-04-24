<template>
    <div>
      <mt-header fixed title="切换用户">
        <fallback slot="left"></fallback>
      </mt-header>

      <div class="mint-content">
        <mt-cell class="multiple"
                 :key="user.userID"
                 v-for="user in list"
                 @click.native="switchFn(user)"
                 is-link>
          <div class="mint-cell-title" slot="title">{{user['userID']}}</div>
          <div class="mint-cell-sub-title" slot="title">{{user['position']}}</div>
        </mt-cell>
      </div>
    </div>
</template>

<script type="es6">
  let NameSpace = 'default';
  export default {
    name: NameSpace,
    data() {
      return {
        list: [{
          userID: '16043202',
          position: '安装主管_张世虎'
        }, {
          userID: '16043218',
          position: '安装主管_谢应发'
        }, {
          userID: '18020016',
          position: '产品安装工程师_刘家军'
        }, {
          userID: '17023092',
          position: '产品安装工程师_刘耀'
        }, {
          userID: '16043215',
          position: '门厂技术主管（代）_胡清秀'
        }, {
          userID: '17053018',
          position: '门厂技术工程师_韦吉辉'
        }, {
          userID: '17080257',
          position: '门厂技术工程师_覃仕权'
        }, {
          userID: '1651',
          position: '部长（代）_郭利勤'
        }, {
          userID: '14083015',
          position: '部长（代）_胡成涛'
        }, {
          userID: '16113009',
          position: '客服主管_袁静'
        }, {
          userID: '1651',
          position: '部长（代）_郭利勤'
        }, {
          userID: '13030172',
          position: '安装支持主管（代）_张长虹'
        }, {
          userID: '15063016',
          position: '安装支持主管（代）_李志勇'
        }, {
          userID: '17023089',
          position: '安装支持专员_刘辉'
        }, {
          userID: '18010047',
          position: '安装支持专员_周振威'
        }, {
          userID: '18010174',
          position: '安装支持专员_刘振伟'
        }, {
          userID: '14080088',
          position: '客服专员_张沙沙'
        }, {
          userID: '17080258',
          position: '客服专员_许壁填'
        }, {
          userID: 'IM01',
          position: '产品安装主管_G40204_00000010'
        }, {
          userID: 'IM02',
          position: '产品安装主管_G40204_00000011'
        }, {
          userID: 'IE01',
          position: '产品安装工程师_G40204_00000001'
        }, {
          userID: 'IE02',
          position: '产品安装工程师_G40204_00000002'
        }, {
          userID: 'DPM01',
          position: '产品安装总监_G40204_00000030'
        }, {
          userID: 'DPM02',
          position: '产品安装部长_G40204_00000020'
        }, {
          userID: 'DM01',
          position: '门厂技术主管_G40204_00000040'
        }, {
          userID: 'DM02',
          position: '门厂技术主管_G40204_00000041'
        }, {
          userID: 'DE01',
          position: '门厂技术工程师_G40204_00000040'
        }, {
          userID: 'DE02',
          position: '门厂技术工程师_G40204_00000041'
        }, {
          userID: '16113009',
          position: '客服主管_G02318_16113009'
        }, {
          userID: '14080088',
          position: '客服专员_G02318_14080088'
        }, {
          userID: 'HQSA01', // 密码 Asdf2017
          position: '总部技术专员_G02318_14080088'
        }]
      };
    },
    methods: {
      switchFn(user) {
        KND.Native.userID = user.userID;
        KND.Util.back();
      }
    }
  };

</script>

<style lang="scss"></style>
