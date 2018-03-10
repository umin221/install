<!--交接单详情-->
<template>
  <div>
    <!--header-->
    <mt-header fixed title="安装交接单详情">
      <fallback slot="left"></fallback>
      <mt-button slot="right"
        @click.native="closeFn">关闭</mt-button>
    </mt-header>

    <!--detail-->
    <div class="mint-content">
      <div class="readonly narrow-form">
        <cus-field label="合同编号" v-model="form['Agree Number']"></cus-field>
        <cus-field label="工程" v-model="form['Lead Name']"></cus-field>
        <cus-field label="安装数量" type="tel" v-model="form['Main Phone Number']"></cus-field>
        <cus-field label="项目地址" v-model="form['Address']"></cus-field>

        <toggle>
          <cus-field label="面板型号" v-model="form['Primary Address Street']"></cus-field>
          <cus-field label="锁体型号" v-model="form['Primary Address Street']"></cus-field>
          <cus-field label="甲方联系人电话" v-model="form['Primary Address Street']"></cus-field>
          <cus-field label="门厂是否安装锁体" v-model="form['HBS Check Box 1']"></cus-field>
          <cus-field label="门厂名称" v-model="form['Partner Name']"></cus-field>
          <cus-field label="门厂联系人" v-model="form['Partner Contact Name']"></cus-field>
          <cus-field label="门厂技术员" v-model="form['Door Factory Engineer']"></cus-field>
          <cus-field label="开孔方式" v-model="form['Hole Type']"></cus-field>
          <cus-field label="是否安装替代锁" v-model="form['HBS Check Box 2']"></cus-field>
          <cus-field label="是否销售审批" v-model="form['Need Approval Flag']"></cus-field>
        </toggle>
      </div>

      <div>
        <mt-cell title="销售方式"
                 :value="form['Sales Type']"></mt-cell>
        <mt-cell title="指派安装工程师"
                 :value="select['Last Name']"
                 @click.native="toEngineer"
                 is-link></mt-cell>
      </div>

      <div>
        <title-group>安装订单</title-group>
        <mt-cell class="multiple"
                  v-for="item in order"
                  :key="item.code"
                  @click.native="toDetailFn(item)"
                  is-link>
          <div class="mint-cell-title" slot="title">订单编号: {{item['code']}}</div>
          <div class="mint-cell-sub-title" slot="title">安装数量: {{item['number']}}</div>
        </mt-cell>
      </div>
    </div>

    <!--buttons-->
    <button-group>
      <mt-button @click.native="rejectFn">驳回</mt-button>
      <mt-button type="primary"
        @click.native="confirmFn">确认分配</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusField from 'public/components/cus-field';
  import titleGroup from 'public/components/cus-title-group';
  import buttonGroup from 'public/components/cus-button-group';
  import toggle from 'public/components/cus-toggle';

  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    components: {cusField, titleGroup, buttonGroup, toggle},
    // 初始化
    created() {
      let param = this.$route.query;
      // 获取详情
      if (param.id) {
        this.findTransferOrderById(param.id);
      }
    },
    // data: () => {
    // },
    computed: {
      ...mapState(NAMESPACE, ['form', 'order']),
      ...mapState('engineer', ['select'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['findTransferOrderById', 'addPartner', 'update']),
      toEngineer() {
        this.$router.push('engineer');
      },
      // Close order
      closeFn() {
        console.log('close order');
      },
      // Reject order
      rejectFn() {
        this.$router.push('reject');
      },
      // Confirm allocation transfer order
      confirmFn() {
        this.update({
          data: {
            'Status': '已交接'
          }
        });
      }
    }
  };
</script>

<style lang="scss">

  .narrow-form {
    padding-bottom: 10px;
  }

  .mint-cell {
    .mint-cell-title {
      flex: 1;
      width: 70px;
      color: $gray-minor;
    }

    .mint-cell-value {
      color: $black-base;
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }
</style>
