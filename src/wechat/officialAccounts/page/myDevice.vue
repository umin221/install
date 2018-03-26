<template>
  <div style="background-color: #ebebeb;">
    <div class="mint-content">
      <div class="myDevice">
        <cus-cell class="myDeviceList" @click.native="toDetail" is-link>
          <div class="mint-cell-sub-title" slot="title">产品序列号：WX201706010001001</div>
          <div class="mint-cell-sub-title" slot="title">产品类型：智能锁</div>
          <div class="mint-cell-sub-title" slot="title">产品型号：s1000</div>
        </cus-cell>
      </div>
      <button-group>
        <mt-button class="single" @click.native="addDevice">添加</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
//  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu.vue';
  import cusCell from 'public/components/cus-cell';
  const NameSpace = 'myDevice';
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
//      ...mapMutations(NameSpace, [''])
      toDetail() {
        this.$router.push('deviceDetail');
      },
      addDevice() {
        this.$router.push('addDevice');
      }
    },
    components: {menuBox, cusCell}
  };
</script>
<style lang="scss">
  .myDeviceList{
    div{
      line-height: 1.5rem;
    }
  }
</style>
