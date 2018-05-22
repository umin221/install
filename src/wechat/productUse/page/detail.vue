<template>
  <div>
    <div>
      <mt-header fixed title="领用申请详情">
        <fallback slot="left" v-if="option !== 'approval'"></fallback>
        <mt-button slot="right" @click.native="toApprovalsave">审批记录</mt-button>
      </mt-header>

      <div class="mint-content orderForms">
        <div class="detail-title">
          <div class="mt-Detail-title"><span class="name">申请单：</span><span class="val">{{orderEntry['Order Number']}}</span></div>
          <div class="mt-Detail-title"><span class="name">申请领用人：</span><span class="val">{{orderEntry['KL Primary Owner']}}</span></div>
          <div class="mt-Detail-title"><span class="name">工程替代锁所属项目：</span><span class="val">{{orderEntry['KL Install Order Opty Name']}}</span></div>
          <div class="mt-Detail-title"><span class="name">申请领用时间：</span><span class="val">{{toDate(orderEntry['Order Date'])}}</span></div>
          <div class="mt-Detail-title"><span class="name">领用说明：</span><span class="val">{{orderEntry['Description']}}</span></div>
          <div class="mt-Detail-title"><span class="name">状态：</span><span class="val" style="color: #0772c1;">{{orderEntry['Status']}}</span></div>
        </div>
        <div class="detail-content">
          <div class="item"
               v-for="(item, index) in lineItems"
                :key="index">
            <div class="mt-Detail-title">配件编码：{{item.Product}}</div>
            <div class="mt-Detail-title">配件名称：{{item['KL Product Name Join']}}</div>
            <div class="mt-Detail-title">配件描述：{{item['KL Product Description']}}</div>
            <div class="mt-Detail-title" v-if="orderEntry['Status LIC'] !== 'Closed'">申请数量：{{item['Quantity Requested']}}</div>
            <div class="mt-Detail-title" v-if="orderEntry['Status LIC'] === 'Closed'">实际领用/申请数量：{{item['Extended Quantity']}}/{{item['Quantity Requested']}}</div>
          </div>
        </div>
      </div>
      <button-group v-show="is_option && is_but">
        <mt-button class="single"
                   @click.native="submitFn('Rejected')">驳回</mt-button>
        <mt-button class="single"
                   @click.native="submitFn('Approved')">确认</mt-button>
      </button-group>
      <button-group v-if="(orderEntry['Status LIC'] === 'Draft'||orderEntry['Status LIC'] === 'Rejected') && option !== 'approval'">
        <mt-button class="single"
                   @click.native="submitApproval">编辑</mt-button>
      </button-group>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions, mapMutations} from 'vuex';
  import { Toast } from 'mint-ui';
  import api from '../api/api';
  const NameSpace = 'detail';
  //
  export default {
    name: NameSpace,
    created() {
      let me = this;
      let param = this.$route.query;
      me.option = param.option; // 区分从哪跳转到详情页
      me.id = param.Id;
      if (this.option === 'approval') {
        this.is_option = true;
        this.InboxItemId = param.InboxItemId;
        this.InboxTaskId = param.InboxTaskId;
      }
      me.getOrderEntry({
        id: me.id,
        callback: data => {
          // 2018/5/18 只有审批中才需要审批 其他状态没有审批
          // if (data['Status LIC'] === 'Draft' || data['Status LIC'] === 'Rejected' || data['Status LIC'] === 'Awaiting Approval') {
          if (data['Status LIC'] === 'Awaiting Approval') {
            me.is_but = true;
          } else {
            me.is_but = false;
          }
        }
      });
    },
    data: () => {
      return {
        option: '',
        is_option: false,
        is_but: false,
        InboxItemId: '',
        InboxTaskId: '',
        ActionLIC: '',
        id: ''
      };
    },
    computed: {
      ...mapState(NameSpace, ['orderEntry', 'lineItems'])
    },
    methods: {
      ...mapActions(NameSpace, ['getOrderEntry']),
      ...mapActions('add', ['toApproval']),
      ...mapMutations('add', ['selectProduct', 'initSelect', 'setId']),
      toDate(time) {
        if (time) {
          return KND.Util.format(time, 'yyyy-MM-dd hh:mm:ss');
        } else {
          return '';
        }
      },
      toApprovalsave() {
        let me = this;
        console.log(me.orderEntry.Id);
        me.$router.push({
          name: 'approval',
          query: {
            id: me.orderEntry.Id
          }
        });
      },
      submitFn(type) {
        console.log(type);
        let me = this;
        if (type === 'Approved') {
          api.get({
            key: 'setApproval',
            method: 'POST',
            data: {
              'body': {
                'Object Id': me.id,
                'InboxItemId': me.InboxItemId,
                'InboxTaskId': me.InboxTaskId,
                'ActionLIC': type,
                'RequestDesc': '',
                'ProcessName': 'KL Sparts Order Approval Action Main Workflow'
              }
            },
            success: function(data) {
              if (!data.ERROR) {
                Toast('审批成功');
                me.getOrderEntry({
                  id: me.id,
                  callback: data => {
                    // 2018/5/18 只有审批中才需要审批 其他状态没有审批
                    // if (data['Status LIC'] === 'Draft' || data['Status LIC'] === 'Rejected' || data['Status LIC'] === 'Awaiting Approval') {
                    if (data['Status LIC'] === 'Awaiting Approval') {
                      me.is_but = true;
                    } else {
                      me.is_but = false;
                    }
                  }
                });
              }
            }
          });
        } else {
          MessageBox.prompt('请填写驳回原因').then(({ value, action }) => {
            if (value) {
              api.get({
                key: 'setApproval',
                method: 'POST',
                data: {
                  'body': {
                    'Object Id': me.id,
                    'InboxItemId': '1-2BSRCRZL',
                    'InboxTaskId': '1-2BSRCRZM',
                    'ActionLIC': type,
                    'RequestDesc': value,
                    'ProcessName': 'KL Sparts Order Approval Action Main Workflow'
                  }
                },
                success: function(data) {
                  if (!data.ERROR) {
                    Toast('审批成功');
                    me.getOrderEntry({
                      id: me.id,
                      callback: data => {
                        // 2018/5/18 只有审批中才需要审批 其他状态没有审批
                        // if (data['Status LIC'] === 'Draft' || data['Status LIC'] === 'Rejected' || data['Status LIC'] === 'Awaiting Approval') {
                        if (data['Status LIC'] === 'Awaiting Approval') {
                          me.is_but = true;
                        } else {
                          me.is_but = false;
                        }
                      }
                    });
                  }
                }
              });
            } else {
              Toast('请填写驳回原因');
            }
          });
        }
      },
      submitApproval() {
        let me = this;
//        selectProduct initSelect
        me.initSelect();
        me.setId('');
        for (let i = 0; i < me.lineItems.length; i++) {
          me.selectProduct({
            'KL Translated Name': me.lineItems[i]['KL Product Name Join'],
            'Name': me.lineItems[i].Product,
            'num': me.lineItems[i]['Quantity Requested'],
            'KL Product Series Code': me.lineItems[i]['KL Product Series Code'],
            'Id': me.lineItems[i]['Product Id'],
            'lineId': me.lineItems[i]['Id']
          });
        }
        me.$router.push({
          name: 'add',
          query: {
            id: me.id,
            Description: me.orderEntry['Description']
          }
        });
//        let form = {
//          callBack: data => {
//            Toast(data);
//            me.$router.go(-1);
//          }
//        };
//        me.toApproval({id: me.orderEntry.Id, form});
      }
    },
    components: {Toast}
  };
</script>
<style lang="scss">
  .orderForms{
    .detail-title{
      background-color: #ffffff;
      padding: 10px;
      font-size: .75rem;
      line-height: 1.75rem;
      .mt-Detail-title{
        display: flex;
        .name {
          color: #888;
          display: inline-block;
        }
        .val {
          word-break: break-all;
        }
      }

    }
    .detail-content{
      margin-top: 10px;
      background-color: #ffffff;
      padding: 10px;
      .item {
        font-size: .75rem;
        line-height: 1.75rem;
        background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 1%, transparent 0%);
      }
    }
  }

</style>
