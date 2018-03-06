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
          userID: 'IM01',
          position: '产品安装主管_G40204_00000010'
        },{
          userID: 'IM02',
          position: '产品安装主管_G40204_00000011'
        },{
          userID: 'IE01',
          position: '产品安装工程师_G40204_00000001'
        },{
          userID: 'IE02',
          position: '产品安装工程师_G40204_00000002'
        },{
          userID: 'DPM01',
          position: '产品安装总监_G40204_00000030'
        },{
          userID: 'DPM02',
          position: '产品安装部长_G40204_00000020'
        },{
          userID: 'DM01',
          position: '门厂技术主管_G40204_00000040'
        },{
          userID: 'DM02',
          position: '门厂技术主管_G40204_00000041'
        },{
          userID: 'DE01',
          position: '门厂技术工程师_G40204_00000040'
        },{
          userID: 'DE02',
          position: '门厂技术工程师_G40204_00000041'
        }]
      }
    },
    methods: {
      switchFn(user) {
        KND.Native.userID = user.userID;
        KND.Util.back();
      }
    }
  }

</script>

<style lang="scss"></style>
