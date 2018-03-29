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
        <empty v-show="!serviceList.length"></empty>
        <cus-cell class="myRepairList"
                  v-for="(item, index) in serviceList"
                  :key="item.Id"
                  @click.native="toDetail(item['SR Number'])"
                  is-link>
          <div class="mint-cell-sub-title" slot="title">服务单编号：{{item['SR Number']}}</div>
          <div class="mint-cell-sub-title" slot="title">申请日期：{{item['Created']}}</div>
          <div class="mint-cell-sub-title" slot="title">产品类型：{{item['KL Product Model']}}</div>
        </cus-cell>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import menuBox from '../../../public/components/cus-menu.vue';
  import cusCell from 'public/components/cus-cell';
  const NameSpace = 'myRepair';
  export default {
    name: NameSpace,
    created() {
      let me = this;
//      me.ContactId = me.$route.query.ContactId;
      me.getContact(function(data) {
        if (data) {
          me.getServiceList({search: 'Contact Id', value: data.Id});
        }
      });
    },
    data: () => {
      return {
      };
    },
    computed: {
      ...mapState(NameSpace, ['serviceList'])
    },
    methods: {
      ...mapActions(NameSpace, ['getServiceList']),
      ...mapActions('address', ['getContact']),
      ...mapMutations(NameSpace, ['']),
      toDetail(srNumber) {
        let me = this;
        me.$router.push({
          name: 'repairDetail',
          query: {
            srNumber: srNumber
          }
        });
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
