<!--交接单详情-->
<template>
  <div>
    <!--header-->
    <mt-header fixed title="安装交接单详情">
      <fallback slot="left"></fallback>
      <mt-button slot="right"
                 @click.native="$router.push('close')"
                 v-show="!isTeam">关闭</mt-button>
    </mt-header>

    <!--detail-->
    <div class="mint-content">
      <div class="readonly narrow-form">
        <cus-field label="合同编号" v-model="form['Agree Number']"></cus-field>
        <cus-field label="工程名称" v-model="form['Opportunity Name']"></cus-field>
        <cus-field label="项目地址" v-model="form['Address']"></cus-field>

        <toggle>
          <cus-field label="门厂名称" v-model="form['Partner Name']"></cus-field>
          <cus-field label="门厂联系人" v-model="form['Partner Contact Name']"></cus-field>
          <cus-field label="门厂技术员" v-model="form['Door Factory Engineer']"></cus-field>
          <cus-field label="开孔方式" v-model="form['Hole Type']"></cus-field>
          <cus-field label="门厂是否安装锁体" v-model="k2v[form['HBS Check Box 1']]"></cus-field>
          <cus-field label="是否安装替代锁" v-model="k2v[form['HBS Check Box 2']]"></cus-field>
          <cus-field label="是否销售审批" v-model="k2v[form['Need Approval Flag']]"></cus-field>
        </toggle>
      </div>

      <div v-show="isPending">
        <mt-cell title="销售方式"
                 :value="form['Sales Type']"></mt-cell>
        <mt-cell title="指派安装工程师"
                 v-show="!isTeam"
                 :value="select['Last Name']"
                 @click.native="toEngineer"
                 is-link></mt-cell>
      </div>

      <div class="install-order" v-show="!isPending">
        <title-group>安装订单</title-group>
        <mt-cell-swipe class="multiple"
                       @click.native="toOrderFn(item)"
                       v-for="(item, index) in orders"
                       :right="isTeam ? [] : [{
                                 content: '删除',
                                 style: { background: 'red', color: '#fff', 'font-size': '15px', 'line-height': '54px' },
                                 handler: () => deleteFn(item, index)
                               }]"
                       :key="item.Id">
          <div class="mint-cell-title co-flex co-jc" slot="title">
            <span class="co-f1">订单编号: {{item['Order Number']}}</span>
            <span>{{item['Status']}}</span>
          </div>
          <div class="mint-cell-sub-title" slot="title">安装数量: {{item['KL Install Amount']}}</div>
        </mt-cell-swipe>
      </div>
    </div>

    <!--buttons-->
    <button-group v-show="!isTeam">
      <mt-button v-show="isPending"
                 @click.native="$router.push('reject')">驳回</mt-button>
      <mt-button v-show="isPending" type="primary"
                 @click.native="assignFn">确认分配</mt-button>
      <mt-button v-show="!isPending" type="primary"
                 @click.native="toOrderFn">新增安装订单</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions} from 'vuex';
  import cusField from 'public/components/cus-field';
  import titleGroup from 'public/components/cus-title-group';
  import toggle from 'public/components/cus-toggle';

  const NAMESPACE = 'detail';

  export default {
    name: NAMESPACE,
    components: {cusField, titleGroup, toggle},
    // 初始化
    created() {
      let me = this;
      let param = me.$route.query;
      // 获取详情
      me.findTransferOrderById(param.id);
    },
    data: () => {
      return {
        k2v: config.mapp.k2v
      };
    },
    computed: {
      ...mapState('index', ['isTeam']),
      ...mapState(NAMESPACE, ['form', 'orders']),
      ...mapState('engineer', ['select']),
      isPending() {
        return this.form['Status'] === '已提交';
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['findTransferOrderById', 'queryOrdersById', 'addPartner', 'assign', 'delete']),
      toEngineer() {
        this.$router.push('engineer');
      },
      // Confirm allocation assign order
      assignFn() {
        let positionId = this.select.Id;
        if (positionId) {
          this.assign(positionId);
        } else {
          Toast('请选择安装工程师');
        }
      },
      // Add Install Order
      toOrderFn(item) {
        let status = item.Status;
        // 无状态 或者 状态 为 草稿，已驳回时
        if (!status || status === '已驳回' || status === '草稿') {
          // 安装订单编辑
          let me = this;
          delete item['Link'];
          // 构造默认参数
          if (!item.Id) {
            let form = me.form;
            item = {
              'Project Id': form.Id,
              'KL Hole Type': form['Hole Type'],
              'KL Delivery Check Box 1': form['HBS Check Box 1'],
              'KL Delivery Check Box 2': form['HBS Check Box 2']
            };
          };
          me.$router.push({
            path: 'order',
            query: {
              order: JSON.stringify(item),
              DFEngineer: me.form['Door Factory Engineer']
            }
          });
        } else {
          // 跳转安装订单模块
          location.href = '../installOrder/index.html#/detail?id=' + item.Id;
        }
      },
      // Delete Install Order
      deleteFn(item, index) {
        if (item['Status'] === '草稿') {
          this.delete({
            id: item.Id,
            index: index
          });
        } else {
          Toast('非草稿状态不允许删除');
        }
      }
    }
  };
</script>

<style lang="scss">

  .narrow-form {
    padding-bottom: 10px;
  }

  div.cus-field {

    .mint-cell-wrapper {
      .mint-cell-title {
        flex: 1.5;
        width: 80px;
      }
    }
  }

  .mint-content {
    margin-bottom: 2.8rem;
  }

  .install-order {
    .multiple {
      .mint-cell-title {
        font-size: $font-size-small;
      }
    }
  }
</style>
