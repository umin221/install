<!--交接单详情-->
<template>
  <div>
    <!--header-->
    <mt-header fixed title="安装交接单详情">
      <fallback slot="left"></fallback>
      <!--<mt-button slot="right"-->
                 <!--@click.native="$router.push('close')"-->
                 <!--v-show="!readonly && !isCompleted">关闭</mt-button>-->
    </mt-header>

    <!--detail-->
    <div class="mint-content">
      <div class="readonly narrow-form">
        <cus-field label="合同编号" v-model="form['Agree Number']"></cus-field>
        <cus-field label="工程名称" v-model="form['Opportunity Name']" isLink></cus-field>
        <cus-field label="项目地址" v-model="form['Address']" isLink></cus-field>

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

      <div v-show="isManager && !isCompleted">
        <mt-cell title="销售方式"
                 :value="form['Sales Type']"></mt-cell>
        <mt-cell title="指派安装工程师"
                 v-show="!isTeam"
                 :value="select['KL Employee Full Name']"
                 @click.native="toEngineer"
                 is-link></mt-cell>
      </div>

      <attach ioName="KL Agreement Attachment IO" title="合同附件" ref="attach"
              :attach="form['KL Agreement Attachment']"
              :edit="false">
      </attach>

      <div class="install-order" v-show="!isPending">
        <title-group>安装订单</title-group>
        <mt-cell-swipe class="multiple"
                       @click.native="toOrderFn(item)"
                       v-for="(item, index) in orders"
                       :right="readonly || isCompleted ? [] : [{
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
    <button-group v-show="!isTeam && !isCompleted">
      <mt-button type="primary" v-show="isPending" @click.native="$router.push('reject')">驳回</mt-button>
      <mt-button v-show="isManager && !isCompleted"  @click.native="assignFn">确认分配</mt-button>
      <mt-button v-show="!isPending && isEngineer" @click.native="generateOrderFn">生成安装订单</mt-button>
    </button-group>
  </div>
</template>

<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';
  import cusField from 'public/components/cus-field';
  import titleGroup from 'public/components/cus-title-group';
  import toggle from 'public/components/cus-toggle';
  import attach from 'public/components/cus-attach';

  const NAMESPACE = 'detail';
  export default {
    name: NAMESPACE,
    components: {cusField, titleGroup, toggle, attach},
    // 初始化
    created() {
      let me = this;
      let param = me.$route.query;
      // 获取详情
      me.findTransferOrderById(param.id);
      // 获取用户&权限
      KND.Native.getUserInfo((info) => {
        config.userInfo = info;
        // 设置用户权限
        me.setAuthority(info['KL Primary Position Type LIC']);
      });
    },
    data: () => {
      return {
        k2v: config.mapp.k2v
      };
    },
    computed: {
      ...mapState('index', ['isTeam', 'isEngineer', 'isManager']),
      ...mapState(NAMESPACE, ['form', 'orders']),
      ...mapState('engineer', ['select']),
      // 未交接交接单
      isPending() {
        return this.form['Status LIC'] === 'Pending Approval';
      },
      // 已完成交接单
      isCompleted() {
        let statusLIC = this.form['Status LIC'];
        return statusLIC === 'Closed' || statusLIC === 'Rejected';
      },
      // 订单只读状态
      readonly() {
        // 查看团队交接单&非安装人员不可操作
        return this.isTeam || !this.isEngineer;
      }
    },
    methods: {
      ...mapActions(NAMESPACE, ['generateOrder', 'findTransferOrderById', 'queryOrdersById', 'addPartner', 'assign', 'delete']),
      ...mapMutations('index', ['setAuthority']),
      // 跳转指派工程师界面
      toEngineer() {
        this.$router.push('engineer');
      },
      // 指派安装工程师
      assignFn() {
        let positionId = this.select['Primary Position Id'];
        if (positionId) {
          this.assign(positionId);
        } else {
          Toast('请选择安装工程师');
        }
      },
      // 生成安装订单
      generateOrderFn(item) {
        let me = this;
        let id = me.form.Id;
        me.generateOrder({
          data: {'Object Id': id},
          success: data => {
            Toast('生成订单成功');
            me.queryOrdersById(id);
          }
        });
      },
      // 跳转到安装订单详情，未提交前未交接单的订单详情，交接后为安装订单的订单详情
      toOrderFn(item) {
        let status = item['Calculated Order Status'];
        // 无状态 或者 状态 为 草稿，已驳回时
        if (!status || status === 'Rejected' || status === 'Draft' || status === 'In Confirming') {
          // 安装订单编辑
          let me = this;
          delete item['Link'];
          // 缓存订单
          KND.Session.remove('order');
          me.$router.push({
            path: 'order',
            query: {
              order: JSON.stringify(item),
              salesType: me.form['Sales Type']
            }
          });
        } else {
          // 跳转安装订单模块
          location.href = '../installOrder/index.html#/detail?id=' + item.Id;
        }
      },
      // 删除安装订单
      deleteFn(item, index) {
        MessageBox.confirm('是否删除订单？', '请确认').then(action => {
          if (item['Status'] === '草稿') {
            this.delete({
              id: item.Id,
              index: index
            });
          } else {
            Toast('非草稿状态不允许删除');
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

  div.cus-field {

    .mint-cell-wrapper {
      .mint-cell-title {
        flex: 1.5;
        width: 80px;
      }
    }
  }

  .install-order {
    .multiple {
      .mint-cell-title {
        font-size: $font-size-small;
      }
    }
  }
</style>
