<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
      <mt-button @click.native="approvalFn" slot="right" v-text="">审批记录</mt-button>
    </mt-header>
    <div class="mint-content batchDetail">
      <div v-show="is_option" class="readonly">
        <mt-field label="申请人" :value="appData['Order Number']"></mt-field>
        <mt-field label="类型" :value="appData['KL Agreement Opportunity Name']"></mt-field>
        <mt-field label="提交日期" :value="appData['KL Delivery Sales Type']"></mt-field>
        <mt-field label="项目详情" :value="appData['KL Delivery Sales Type']" @click.native="toDetailFn">XXXXX</mt-field>
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
      <button-group v-show="is_option">
        <mt-button class="single"
                   @click.native="submitFn">驳回</mt-button>
        <mt-button class="single"
                   @click.native="submitFn">确认</mt-button>
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
        this.getAppData(this.id);
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
        option: '', // 区分从哪跳转到详情页
        is_plan: true, // 是否显示详细计划
        is_option: false, // 是否审批
        is_show: false, // 是否显示委外、附件    只有替代锁 真锁 才会显示
        start_Date: '',        // 开始时间
        end_Date: '',        // 结束时间
        batchNum: 0, // 数量
        planList: [],
        appData: {}, // 审批信息头
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
        // var self =this;
        this.$router.push({
          name: 'detail',
          query: {
            id: '1-2BSEB2W4'
          }
        });
      },
      getAppData(id) {
        var me = this;
        api.get({
          key: 'getDetail',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base UInbox Item History',
              // 'OutputIntObjectName': 'KL Order Sales',
              'SearchSpec': '[Order Entry - Orders.Id]=' + '\'' + id + '\''
              // 'SearchSpec': '[Order Entry - Orders.Id]="1-2BSATYIN"'
            }
          },
          success: function(data) {
            console.dir(data.SiebelMessage);
            me.detailData = data.SiebelMessage['Order Entry - Orders'];
            var taskData = me.detailData['KL Installation Task'];
            if (taskData) {
              me.taskData = KND.Util.toArray(taskData);
              console.dir(me.taskData);
              me.pStatus = me.taskData[0]['Calculated Activity Status'];
              if (me.pStatus !== 'Not Started') { // 未开始时不获取子任务数据
                me.taskDataList = KND.Util.toArray(me.taskData[0]['KL Installation Task']);
              }
            }
            me.taskDataST = KND.Util.toArray(me.detailData['Order Entry - Line Items']);
            console.dir(me.taskDataST);
          }
        });
      }
    },
    components: {buttonGroup, lockLine}
  };
</script>
