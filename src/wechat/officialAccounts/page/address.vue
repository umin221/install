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
      <div class="addressC">
        <cus-cell class="addressT">
          <div class="mint-cell-sub-title" slot="title">姓名：张三</div>
          <div class="mint-cell-sub-title" slot="title">电话：18688889999</div>
          <div class="mint-cell-sub-title" slot="title">地址：xxxxxxxxxxxxxxxxxx小区xxx号</div>
        </cus-cell>
        <div class="editDetail">
          <input type="checkbox" value="默认">
          <mt-badge class="xs-icon icon-delete" style="color: #ffffff;" type="error">删除</mt-badge>
          <mt-badge class="xs-icon icon-edit" type="success">编辑</mt-badge>
        </div>
      </div>
      <div class="addressC">
        <cus-cell class="addressT">
          <div class="mint-cell-sub-title" slot="title">姓名：张三</div>
          <div class="mint-cell-sub-title" slot="title">电话：18688889999</div>
          <div class="mint-cell-sub-title" slot="title">地址：xxxxxxxxxxxxxxxxxx小区xxx号</div>
        </cus-cell>
        <div class="editDetail">
          <input type="checkbox" value="默认">
          <mt-badge class="xs-icon icon-delete" style="color: #ffffff;" type="error">删除</mt-badge>
          <mt-badge class="xs-icon icon-edit" type="success">编辑</mt-badge>
        </div>
      </div>
      <button-group>
        <mt-button class="single" @click.native="toAddAddress" >
          <i class="xs-icon icon-add"></i>
          新建地址
        </mt-button>
      </button-group>
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
      toAddAddress() {
        this.$router.push('addAddress');
      }
    },
    components: {menuBox, cusCell}
  };
</script>
<style lang="scss">
  .addressC{
    margin-top: 20px;
    .addressT{
      font-size: $font-size-large;
      div{
        line-height: 1.2rem;
      }
    }
    .editDetail{
      background: #ffffff;
      position: relative;
      margin: -10px 10px;
      span{
        float: right;
      }
    }
  }
</style>
