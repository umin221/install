<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
      <mt-button @click.native="approvalFn" slot="right" v-text="">审批记录</mt-button>
    </mt-header>
    <div class="mint-content batchDetail">
      <div class="readonly" style="margin-top: 10px">
        <mt-field label="批次">
          <span>{{batchCode}}</span>
        </mt-field>
        <mt-field label="批次名称">
          <span>{{batchName}}</span>
        </mt-field>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .batchDetail {
    .button-cla {
      margin-top: 2.5rem;
      width: 100%;
      text-align: center;
    }
    .active {
      background: #d7ded8!important;
    }
    .numCla .enable {
      color: #0772c1!important;
    }
    .icon-add-circle:before {
      content: ''!important;
    }
    .mint-button--normal {
      display: inline-block;
      padding: 0 12px;
      width: 5rem;
    }
    input {
      text-align: right!important;
    }

    .lock-line {
      margin-top: 10px;

      .lock-line-cell {
        background-color: $bg-light;
      }
      .co-flex {
        line-height: 30px;
      }
    }
  }
</style>
<script type="application/javascript">
  import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import lockLine from '../components/cusLockLine';
  import api from '../api/api';
  let userInfo = {};
  export default {
    name: 'batchDetail',
    created() {
      var self = this;
      let param = this.$route.query;
      this.id = param.Id;
      this.option = param.option; // 区分从哪跳转到详情页
      if (this.option === 'approval') {
        this.orderId = param.OrderId;
        this.InboxItemId = param.InboxItemId;
        this.InboxTaskId = param.InboxTaskId;
        this.getAppData();
      }
      self.titleVal = '批次详情';
      this.getBatch(this.id);
      if (param.type === '') {
        self.is_show = true;
      }
      KND.Native.getUserInfo((info) => {
        userInfo = info;
        console.log(userInfo);
      });
    },
    data: () => {
      return {
        value: '',
        batchCode: '', // 批次
        batchName: '', // 批次名称
        orderId: '', // 订单详情ID
        InboxItemId: '', // 审批id
        InboxTaskId: '', // 审批id
        option: '', // 区分从哪跳转到详情页
        is_User: false, // 是否负责人
        batchNum: 0, // 数量
        planList: [],
        id: '',
        item: '',
        editable: false,
        active: 'tab-container'
      };
    },
    beforeRouteEnter(to, from, next) {
      console.dir(2);
      next(vm => {
        let query = vm.$route.query;
        console.dir(query);
      });
    },
    computed: {
      // 表单只读
      read() {
        return true;
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      }
    },
    methods: {
      ...mapActions('app', ['getLov', 'queryMedias']),
      approvalFn() {
        var self = this;
        this.$router.push({
          name: 'approval',
          query: {
            id: self.id
          }
        });
      },
      getBatch(id) {
        var self = this;
        api.get({ // 批次详情
          key: 'findBatchById', // 'findBatchById',
          data: {
            id: id
          },
          success: data => {
            console.dir(data);
            self.detailData = data;
            if (userInfo['Id'] === self.detailData['Primary Owner Id']) {
              self.is_User = true;
            }
            self.batchCode = data.Id; // 批次
            self.batchName = data['KL Task Batch Name'];
          }
        });
      }
    },
    components: {buttonGroup, lockLine}
  };
</script>
