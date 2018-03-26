<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div style="line-height: 5rem;text-align: center;background: #ffffff">
          微信名称
      </div>
      <div class="my-personal">
        <div class="personal" @click="toMyDevice">
          <i class="xs-icon icon-device" style="font-size: 1.5rem"></i>
          我的设备
        </div>
        <div class="personal">
          <i class="xs-icon icon-addr" style="font-size: 1.5rem"></i>
          我的地址
        </div>
        <div class="personal">
          <i class="xs-icon icon-call" style="font-size: 1.5rem"></i>
          热线服务
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
      }
    },
    components: {menuBox}
  };
</script>
<style lang="scss">
  .my-personal{
    margin-top: 1.5rem;
    background-color: #ffffff;
    .personal{
      width: 50%;
      float: left;
      text-align: center;
      line-height: 7.5rem;
      border: 1px solid #000000;
      box-sizing: border-box;
      font-size: 0.9rem;
      background-color: #ffffff;
    }
  }
</style>
