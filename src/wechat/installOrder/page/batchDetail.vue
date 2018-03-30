<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
      <mt-button @click.native="approvalFn" slot="right" v-text="">审批记录</mt-button>
    </mt-header>
    <div class="mint-content batchDetail">
      <div v-show="is_option" class="readonly">
        <mt-field label="申请人" :value="appData['Party Name']"></mt-field>
        <mt-field label="类型" :value="appData['Item Type Display Name']"></mt-field>
        <mt-field label="提交日期" :value="appDataTask['Start Time']"></mt-field>
        <mt-field label="订单详情" @click.native="toDetailFn" :value="orderId"></mt-field>
      </div>
      <div class="readonly" style="margin-top: 10px">
        <mt-field label="批次">
          <span>{{batchCode}}</span>
        </mt-field>
        <mt-field label="计划开始日期"  :value="start_Date"></mt-field>
        <mt-field label="计划完成日期" :value="end_Date"></mt-field>
        <mt-field label="计划开孔数量"
                   :value="batchNum"></mt-field>
      </div>
      <div class="lock-line" v-show="is_plan"  :class="{'disable': !editable}">
        <lock-line title="详细计划">
          <mt-cell-swipe v-for="(line, index) in planList" class="lock-line-cell enable" ref="body"
                         @click.native="addPlanList(line)"
                         :key=index
                         is-link>
            <div class="co-flex co-jc" slot="title">
            <span class="co-f1">{{line.Description}}</span>
            <span class="co-f1">{{line['KL Detail Type']}}</span>
          </div>
            <div class="co-flex co-jc" slot="title">
              <span class="co-f1" >{{new Date(line.Planned).format('yyyy-MM-dd hh:mm:ss')}}</span>
              <span class="co-f1">{{new Date(line['Planned Completion']).format('yyyy-MM-dd hh:mm:ss')}}</span>
            </div>
          </mt-cell-swipe>
        </lock-line>
      </div>
      <button-group v-show="is_option && is_but">
        <mt-button class="single"
                   @click.native="submitFn('Rejected')">驳回</mt-button>
        <mt-button class="single"
                   @click.native="submitFn('Approved')">确认</mt-button>
      </button-group>
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
  .disable .cus-lock.icon-add-circle:before {
    color: white!important;
  }
</style>
<script type="application/javascript">
  import {mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import lockLine from '../components/cusLockLine';
  import api from '../api/api';
  export default {
    name: 'batchDetail',
    created() {
      var self = this;
      let param = this.$route.query;
      this.id = param.Id;
      this.option = param.option; // 区分从哪跳转到详情页
      if (this.option === 'approval') {
        this.is_option = true; // 是否审批
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
    },
    data: () => {
      return {
        value: '',
        batchCode: '', // 批次
        orderId: '', // 订单详情ID
        InboxItemId: '', // 审批id
        InboxTaskId: '', // 审批id
        option: '', // 区分从哪跳转到详情页
        is_plan: true, // 是否显示详细计划
        is_option: false, // 是否审批
        is_but: true, // 判断是否显示按钮   1.审批时 2.没有审批过
        is_show: false, // 是否显示委外、附件    只有替代锁 真锁 才会显示
        start_Date: '',        // 开始时间
        end_Date: '',        // 结束时间
        batchNum: 0, // 数量
        planList: [],
        appData: {}, // 审批信息头
        appDataTask: {}, // 审批信息子任务信息
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
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      }
    },
    methods: {
      ...mapActions('app', ['getLov']),
      addPlanList(item) {
        this.$router.push({
          name: 'detailPlan',
          query: {
            type: 'read',
            item: item
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
            if (data['KL Detail Type LIC'] === 'Trompil Batch Summary' ||
              data['KL Detail Type LIC'] === 'Lock Body Install Summary' ||
              data['KL Detail Type LIC'] === 'Door Hanging Acc Batch' ||
              data['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
              data['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
              data['KL Detail Type LIC'] === 'Lock Installation Summary' ||
              data['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
              data['KL Detail Type LIC'] === 'Transfer Summary') { // 汇总详情不需要获取详细计划数据 也不需要显示
              self.is_plan = false;
              self.titleVal = '汇总详情';
            } else {
              self.getPlanList(id);
            }
            self.batchCode = data.Id; // 批次
            if (data.Planned) {
              self.start_Date = new Date(data.Planned).format('yyyy-MM-dd'); // 开始时间
            }
            if (data['Planned Completion']) {
              self.end_Date = new Date(data['Planned Completion']).format('yyyy-MM-dd') || ''; // 结束时间
            }
            self.batchNum = data['KL Install Amount Requested'] || 0; // 数量
          }
        });
      },
      getPlanList(id) {
        var self = this;
        self.planList = [];
        api.get({ // 提交数据
          key: 'getPlan',
          method: 'GET',
          data: {
            id: id
          },
          success: function(data) {
            if (data.items) {
              self.planList = data.items;
            } else {
              self.planList = KND.Util.toArray(data);
            }
          }
        });
      },
      toDetailFn() {
        var self = this;
        this.$router.push({
          name: 'detail',
          query: {
            id: self.orderId
          }
        });
      },
      getAppData() {
        var self = this;
        api.get({
          key: 'getAppData',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base UInbox Item History',
              'SearchSpec': '[UInbox Item.Id]=' + "'" + self.InboxItemId + "'" + ' AND [UInbox Item Task.Id]=' + "'" + self.InboxTaskId + "'"
            }
          },
          success: function(data) {
            console.dir(data.SiebelMessage);
            self.appData = data.SiebelMessage['UInbox Item'];
            self.appDataTask = self.appData['UInbox Item Task'];
            var lov = [];
            self.getLov({ // 取类型值
              data: {
                'Type': 'UINBOX_ITEM_STATUS_TYPE'
              },
              success: data => {
                lov = KND.Util.toArray(data.items);
                var lov_date = [];
                for (var i = 0; i < lov.length; i++) {
                  if (lov[i].Value !== 'Approving') {
                    lov_date.push(lov[i]);
                  }
                }
                if (lov_date) {
                  var Status = self.appData.Action; // 取状态判断是否已审批
                  for (var j = 0; j < lov_date.length; j++) {
                    if (lov_date[j].Value === Status) {
                      self.is_but = false;
                    }
                  }
                }
              }
            });
            console.dir(self.appData);
          }
        });
      },
      submitFn(type) {
        var self = this;
        if (type === 'Approved') {
        } else {
        }
        api.get({
          key: 'setApproval',
          method: 'POST',
          data: {
            'body': {
              'Object Id': self.id,
              'InboxItemId': self.InboxItemId,
              'InboxTaskId': self.InboxTaskId,
              'ActionLIC': type,
              'KL Request Description': '测试',
              'ProcessName': 'KL Install Task Approval Action Main Workflow'
            }
          },
          success: function(data) {
            if (!data.ERROR) {
              Toast('提交成功');
              KND.Util.back();
            }
          }
        });
      }
    },
    components: {buttonGroup, lockLine}
  };
</script>
