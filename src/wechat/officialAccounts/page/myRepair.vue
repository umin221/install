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
        <cus-cell class="multiple"
                  v-for="(item, index) in serviceList"
                  :key="item.Id"
                  :title="'服务单编号:'+ item['SR Number']"
                  @click.native="toDetail(item['SR Number'], item['Id'])"
                  is-link>
          <div slot="after" style="color: #0772c1">{{item['Status']}}</div>
          <div class="mint-cell-sub-title" slot="title">申请日期：{{toDate(item['Created'])}}</div>
          <div class="mint-cell-sub-title" slot="title">产品类型：{{item['KL Product Model']}}</div>
        </cus-cell>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import menuBox from '../../../public/components/cus-menu.vue';
  import cusCell from 'public/components/cus-cell';
  const NAMESPACE = 'myRepair';

  // 用户信息
  let contact = KND.Util.parse(KND.Session.get('Contact'));
  export default {
    name: NAMESPACE,
    created() {
      let me = this;
      me.getServiceList({search: 'KL WeChat Contact Id', value: contact.Id});
    },
    data: () => {
      return {
      };
    },
    computed: {
      ...mapState(NAMESPACE, ['serviceList'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['getServiceList']),
      toDetail(srNumber, Id) {
        let me = this;
        me.$router.push({
          name: 'repairDetail',
          query: {
            srNumber: srNumber,
            srId: Id
          }
        });
      },
      toDate(time) {
        if (time) {
          return KND.Util.format(time, 'yyyy-MM-dd hh:mm:ss');
        } else {
          return '';
        }
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

