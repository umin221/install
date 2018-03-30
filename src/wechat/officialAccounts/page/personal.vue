<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div style="line-height: 5rem;text-align: center;background: #ffffff">
          微信名称
      </div>
      <div class="my-personal">
        <div class="co-flex co-ver co-jsa" @click="toMyDevice">
          <span class="xs-icon icon-device" style="font-size: 1.5rem"></span>
          <span>我的设备</span>
        </div>
        <div class="co-flex co-ver co-jsa" @click="toAddress">
          <span class="xs-icon icon-addr" style="font-size: 1.5rem"></span>
          <span>我的地址</span>
        </div>
        <div class="co-flex co-ver co-jsa" @click="callService">
          <span class="xs-icon icon-call" style="font-size: 1.5rem"></span>
          <span>热线服务</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
//  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from 'public/components/cus-menu';
  const NameSpace = 'personal';
  export default {
    name: NameSpace,
    created() {
    },
    data: () => {
      return {
      };
    },
    computed: {
//      ...mapState(NameSpace, [''])
    },
    methods: {
//      ...mapActions(NameSpace, ['']),
//      ...mapMutations(NameSpace, []),
      submit() {
        this.$router.push('myRepair');
      },
      toMyDevice() {
        this.$router.push('myDevice');
      },
      toAddress() {
        this.$router.push('address');
      },
      callService() {
        this.$router.push('hotTelephone');
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  .my-personal{
    margin-top: 1.5rem;
    background-color: #ffffff;
    div{
      display: inline-flex;
      width: 49%;
      height: 6rem;
      font-size: $font-size-default;
      text-align: center;
      padding: 10px 0;
      border-bottom: 1px solid #eaeaea;
      border-right: 1px solid #eaeaea;
      box-sizing: border-box;
    }
  }
</style>
