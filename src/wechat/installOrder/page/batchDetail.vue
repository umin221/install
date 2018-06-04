<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left" v-show="!is_option"></fallback>
      <mt-button @click.native="approvalFn" slot="right" v-text="">审批记录</mt-button>
    </mt-header>
    <div class="mint-content batchDetail">
      <div v-show="is_option" class="readonly">
        <mt-field label="申请人" :value="appData['Party Name']"></mt-field>
        <mt-field label="类型" :value="appData['Item Type Display Name']"></mt-field>
        <mt-field label="提交日期" :value="new Date(appDataTask['Start Time']).format('yyyy-MM-dd')"></mt-field>
        <mt-field label="订单详情" class="numCla"><span class="enable" @click="toDetailFn">{{orderId}}</span></mt-field>
      </div>
      <div class="readonly" style="margin-top: 10px">
        <mt-field label="批次">
          <span>{{batchCode}}</span>
        </mt-field>
       <!-- <mt-field label="计划开始日期"  :value="start_Date" v-show="is_plan"></mt-field>
        <mt-field label="计划完成日期" :value="end_Date" v-show="is_plan"></mt-field>-->
        <mt-field label="计划数量" :class="showNum()">
          <span class="enable" @click="editBuildingFn">{{batchNum}}</span>
        </mt-field>
        <mt-field label="完成数量"
                  v-show="!is_plan"
                  is-link>
          <span>{{completeNum}}</span>
        </mt-field>
        <mt-field v-show="is_installer" label="合作伙伴"  :value="companyName"></mt-field>
        <mt-field v-show="is_zs" label="真锁交接日期"  :value="deliveryTime"></mt-field>
      </div>
      <div class="lock-line" v-show="is_installer" :class="{'disable': !editable}">
        <lock-line title="委外安装员">
          <mt-cell-swipe v-for="(installer, index) in installerList" class="lock-line-cell enable" ref="body" :key=index>
            <div class="co-flex co-jc" slot="title">
              <span class="co-f1">{{installer['Last Name']}}/{{installer['KL Outsource Password']}}</span>
              <span class="co-f1">{{installer['Work Phone #']}}</span>
            </div>
          </mt-cell-swipe>
        </lock-line>
      </div>
      <div class="lock-line" v-show="is_plan"  :class="{'disable': !editable}">
        <lock-line title="详细计划">
          <mt-cell-swipe v-for="(line, index) in planList" class="lock-line-cell enable" ref="body"
                         :class="{'active': colorCla(line)}"
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
      <attach ioName="KL Action Attachment" ref="attach"
              :attach="attach.list"
              :edit="!read"
              :title="attach.title"
              v-show="is_installer || is_attach">
      </attach>
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
        orderId: '', // 订单详情ID
        InboxItemId: '', // 审批id
        InboxTaskId: '', // 审批id
        option: '', // 区分从哪跳转到详情页
        is_User: false, // 是否负责人
        is_plan: true, // 是否显示详细计划
        is_option: false, // 是否审批
        is_but: false, // 判断是否显示按钮   1.审批时 2.没有审批过
        is_show: false, // 是否显示委外、附件    只有替代锁 真锁 才会显示
        start_Date: '',        // 开始时间
        end_Date: '',        // 结束时间
        is_installer: false, // 是否替代锁、真锁批次 显示委外联系人
        is_attach: false, // 工程移交显示附件
        companyName: '', // 合作伙伴名称
        is_zs: false, // 是否真锁批次 显示交接日期
        deliveryTime: '', // 交接日期
        batchNum: 0, // 数量
        completeNum: 0, // 完成数量
        planList: [],
        installerList: [],
        detailData: {}, // 详细信息
        appData: {}, // 审批信息头
        appDataTask: {}, // 审批信息子任务信息
        id: '',
        item: '',
        editable: false,
        active: 'tab-container',
        attach: { // 附件
          list: [],
          edit: false,
          title: '附件'
        }
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
      showNum() {
        var self = this;
        if (self.detailData['KL Detail Type LIC'] === 'Lock Installation Batch' && self.detailData['KL Delivery Sales Type'] === '工程' && self.is_User && self.detailData['Calculated Activity Status'] !== 'Completed') {
          return 'numCla';
        }
      },
      colorCla(item) {
        var self = this;
        var is_date = false;
        if (self.is_User && (self.detailData['Calculated Activity Status'] === 'In Progress' || self.detailData['Calculated Activity Status'] === 'Approved') && !item['Started']) { // 判断是否可以编辑完成时间 审批通过、进行中 && 当前负责人&& 完成时间为空才能修改
          is_date = true;
        }
        return is_date;
      },
      addPlanList(item) {
        var self = this;
        var is_date = false;
        if (self.is_User && (self.detailData['Calculated Activity Status'] === 'In Progress' || self.detailData['Calculated Activity Status'] === 'Approved') && !item['Started']) { // 判断是否可以编辑完成时间 审批通过、进行中 && 当前负责人&& 完成时间为空才能修改
          is_date = true;
        }
        self.$router.push({
          name: 'detailPlan',
          query: {
            type: 'read',
            is_date: is_date,
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
            self.detailData = data;
            if (userInfo['Id'] === self.detailData['Primary Owner Id']) {
              self.is_User = true;
            }
            if (data['KL Detail Type LIC'] === 'Trompil Batch Summary' ||
              data['KL Detail Type LIC'] === 'Lock Body Install Summary' ||
              data['KL Detail Type LIC'] === 'Door Hanging Acc Summary' ||
              data['KL Detail Type LIC'] === 'Substitution Lock Inst Summary' ||
              data['KL Detail Type LIC'] === 'Subst Lock Trans Summary' ||
              data['KL Detail Type LIC'] === 'Lock Installation Summary' ||
              data['KL Detail Type LIC'] === 'Check Before Trans Summary' ||
              data['KL Detail Type LIC'] === 'Transfer Summary') { // 汇总详情不需要获取详细计划数据 也不需要显示
              self.is_plan = false;
              self.titleVal = '汇总详情';
            } else {
              self.getPlanList(id);
              if (data['KL Delivery Sales Type'] === '工程') { // 区分工程还是零星  工程
                if (data['KL Detail Type LIC'] === 'Substitution Lock Inst Batch' ||
                  data['KL Detail Type LIC'] === 'Lock Installation Batch') { // 替代锁批次=Substitution Lock Inst Batch、真锁=Lock Installation Batch获取为外人员 显示合作伙伴
                  self.is_installer = true;
                  self.getInstallerList(id);
                  self.queryMedias({ // 附件查询
                    data: {
                      'IOName': 'KL Action Attachment',
                      'SearchSpec': {
                        'Action Attachment.Activity Id': id
                      }
                    },
                    success: data => {
                      self.attach.list = KND.Util.toArray(data['SiebelMessage']['Action Attachment']);
                    }
                  });
                  self.companyName = data['KL Partner Name'];
                  if (data['KL Detail Type LIC'] === 'Lock Installation Batch') { // 真锁
                    self.is_zs = true;
                    if (data['KL Delivery Time']) {
                      self.deliveryTime = new Date(data['KL Delivery Time']).format('yyyy-MM-dd') || ''; // 结束时间
                    }
                  }
                } else if (data['KL Detail Type LIC'] === 'Transfer Batch') { // 工程真锁移交=Transfer Batch、 现象需要显示附件
                  console.dir('工程移交详情查附件');
                  self.queryMedias({ // 附件查询
                    data: {
                      'IOName': 'KL Action Attachment',
                      'SearchSpec': {
                        'Action Attachment.Activity Id': id
                      }
                    },
                    success: data => {
                      self.attach.list = KND.Util.toArray(data['SiebelMessage']['Action Attachment']);
                      if (self.attach.list.length > 0) {
                        self.is_attach = true;
                      }
                    }
                  });
                }
              }
            }
            self.batchCode = data.Id; // 批次
            if (data.Planned) {
              self.start_Date = new Date(data.Planned).format('yyyy-MM-dd'); // 开始时间
            }
            if (data['Planned Completion']) {
              self.end_Date = new Date(data['Planned Completion']).format('yyyy-MM-dd') || ''; // 结束时间
            }
            self.batchNum = data['KL Install Amount Requested'] || 0; // 数量
            self.completeNum = data['KL Completed Install Amount'] || 0; // 完成数量
            /*
            * 根据类型判断是否可以审批
            * 审批中=Approval in Process
            * 关闭中=Closing
            * 可以审批
            * */
            if (data['Calculated Activity Status'] === 'Approval in Process' || data['Calculated Activity Status'] === 'Closing') {
              self.is_but = true;
            } else {
              self.is_but = false;
            }
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
      getInstallerList(id) { // 联系人
        var self = this;
        self.installerList = [];
        api.get({ // 提交数据
          key: 'getInstaller',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base KL Installation Task',
              'PrimaryRowId': id
            }
          },
          success: function(data) {
            self.installerList = KND.Util.toArray(data.SiebelMessage['KL Installation Task']['Contact']);
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
        self.is_option = true; // 是否审批
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
          }
        });
      },
      submitFn(type) {
        var self = this;
        if (type === 'Approved') {
          api.get({
            key: 'setApproval',
            method: 'POST',
            data: {
              'body': {
                'Object Id': self.id,
                'InboxItemId': self.InboxItemId,
                'InboxTaskId': self.InboxTaskId,
                'ActionLIC': type,
                'KL Request Description': '',
                'ProcessName': 'KL Install Task Approval Action Main Workflow'
              }
            },
            success: function(data) {
              if (!data.ERROR) {
                Toast('审批成功');
                self.getBatch(self.id);
                self.getAppData();
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
                    'Object Id': self.id,
                    'InboxItemId': self.InboxItemId,
                    'InboxTaskId': self.InboxTaskId,
                    'ActionLIC': type,
                    'KL Request Description': value,
                    'ProcessName': 'KL Install Task Approval Action Main Workflow'
                  }
                },
                success: function(data) {
                  if (!data.ERROR) {
                    Toast('审批成功');
                    self.getBatch(self.id);
                    self.getAppData();
                  }
                }
              });
            } else {
              Toast('请填写驳回原因');
            }
          });
        }
      },
      /**
       * 编辑楼栋信息
       */
      editBuildingFn() {
        var self = this;
        if (self.is_option) { // 审批中不能查看楼栋编辑
          return;
        }
        if (self.detailData['KL Detail Type LIC'] === 'Lock Installation Batch' && self.detailData['KL Delivery Sales Type'] === '工程' && self.is_User && self.detailData['Calculated Activity Status'] !== 'Completed') {
          let id = this.$route.query.Id;
          this.$router.push({
            path: 'assets',
            query: {
              TaskId: id,
              mode: 'edit'
            }
          });
          // 标记楼栋资产刷新
          KND.Session.set('refreshAssets', true);
        }
      }
    },
    components: {buttonGroup, lockLine}
  };
</script>
