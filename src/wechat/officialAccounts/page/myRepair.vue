<template>
  <div style="background-color: #ebebeb;">
      <!--<div class="addform">-->
        <!--<mt-cell>-->
          <!--<div class="mint-cell-sub-title" slot="title">姓名：张三</div>-->
          <!--<div class="mint-cell-sub-title" slot="title">电话：18688889999</div>-->
          <!--<div class="mint-cell-sub-title" slot="title">地址：xxxxxxxxxxxxxxxxxx小区xxx号</div>-->
        <!--</mt-cell>-->
      <!--</div>-->
    <div class="mint-content">
      <div class="myRepair">
        <cus-cell class="myRepairList" @click.native="toDetail" is-link>
          <div class="mint-cell-sub-title" slot="title">服务单编号：WX201706010001001</div>
          <div class="mint-cell-sub-title" slot="title">申请日期：2017-12-15 14:00</div>
          <div class="mint-cell-sub-title" slot="title">产品类型：智能锁</div>
        </cus-cell>
      </div>
    </div>
  </div>
</template>
<script>
//  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu.vue';
  import cusCell from 'public/components/cus-cell';
  const NameSpace = 'address';
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
        this.$router.push('repairDetail');
      }
    },
    components: {menuBox, cusCell}
  };
</script>
<style lang="scss">
  .myRepairList{
    div{
      line-height: 1.5rem;
    }
  }
</style>
