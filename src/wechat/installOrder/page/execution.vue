<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content execution">
      <div>
        <div class="lock-line disable">
          <lock-line title="面板"></lock-line>
        </div>
        <cus-field label="数量" tag="数量"
                   placeholder="请输入"
                   v-valid.positiveInteger
                   type="number"
                   v-model="batchNum"></cus-field>
        <cus-field label="到货日期" tag="到货日期"
                   @click.native="open('picker','start_Date')"
                   :value="start_Date"
                   is-link></cus-field>
        <div class="lock-line disable">
          <lock-line title="锁体"></lock-line>
        </div>
        <cus-field label="数量" tag="数量"
                   placeholder="请输入"
                   v-valid.positiveInteger
                   type="number"
                   v-model="batchNum1"></cus-field>
        <cus-field label="到货日期" tag="到货日期"
                   @click.native="open('picker','start_Date1')"
                   :value="start_Date1"
                   is-link></cus-field>
      </div>
      <div class="lock-line disable">
        <lock-line title="执行详情">
          <mt-cell-swipe v-for="(installer, index) in installerList" class="lock-line-cell enable" ref="body" :key=index>
            <div class="co-flex" slot="title" style="text-align: left">提报时间：{{new Date(installer.Created).format('yyyy-MM-dd hh:mm:ss')}}</div>
            <div class="co-flex co-jc" slot="title">提报明细：{{installer.Comments}}</div>
          </mt-cell-swipe>
        </lock-line>
      </div>
      <button-group>
        <mt-button class="single"
                   @click.native="submitFn">提交</mt-button>
      </button-group>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        :startDate="sDate"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChange">
      </mt-datetime-picker>
    </div>
  </div>
</template>
<script type="application/javascript">
  import {mapState} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import buttonGroup from 'public/components/cus-button-group';
  import cusField from 'public/components/cus-field';
  import lockLine from '../components/cusLockLine';
  import api from '../api/api';
  const NameSpace = 'execution';
  Vue.use(vp);
  let today = new Date();
  export default {
    name: NameSpace,
    created() {
      var self = this;
      let param = this.$route.query;
      self.id = param.id;
      self.state = param.state;
      self.getInstallerList();
    },
    data: () => {
      return {
        value: [],
        pickerVisible: today,
        start_Date: '',        // 开始时间
        startDate: '',
        batchNum: '', // 数量
        start_Date1: '',        // 开始时间
        startDate1: '',
        batchNum1: '', // 数量
        installerList: [],
        sDate: today,
        item: '',
        id: '', // 记录新增后的批次ID
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '订单执行',
        timeKey: '',
        options: [
          {
            label: '面板',
            value: '面板'
          },
          {
            label: '锁体',
            value: '锁体'
          }
        ],
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
      ...mapState('detail', ['detailData']),
      // 表单只读
      read() {
        return this.type === 'read';
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      }
    },
    methods: {
      open(picker, key) {
        this.timeKey = key;
        var self = this;
        self.$refs[picker].open();
      },
      handleChange(value) {
        let me = this;
        var key = me.timeKey;
        if (key === 'start_Date') {
          me.start_Date = value.format('yyyy/MM/dd');
          me.startDate = value.format('MM/dd/yyyy'); // 后台存值格式
        } else {
          me.start_Date1 = value.format('yyyy/MM/dd');
          me.startDate1 = value.format('MM/dd/yyyy'); // 后台存值格式
        }
      },
      getInstallerList() { // 订单执行记录
        var self = this;
        self.installerList = [];
        api.get({ // 提交数据
          key: 'getApproval',
          method: 'POST',
          data: {
            'body': {
              'OutputIntObjectName': 'Base UInbox Item History',
              'SearchSpec': '[UInbox Item.Item Object Id]=' + '"' + self.id + '"' + ' AND [UInbox Item.Item Type Name]="KL Install Order Execute"'
            }
          },
          success: function(data) {
            if (data.SiebelMessage['UInbox Item']) {
              self.installerList = KND.Util.toArray(data.SiebelMessage['UInbox Item']['UInbox Item Task']);
            }
          }
        });
      },
      submitFn() {
        var self = this;
        tools.valid.call(this, () => {
          if (self.batchNum || self.batchNum1 || self.start_Date || self.start_Date1) {
            var comment = '';
            if ((self.batchNum && !self.start_Date) || (!self.batchNum && self.start_Date)) {
              Toast('请填写面板的数量与到货日期！');
              return;
            } else {
              comment += '面板，需求数量：' + self.batchNum + '，到货日期：' + self.start_Date + ';';
            }
            if ((self.batchNum1 && !self.start_Date1) || (!self.batchNum1 && self.start_Date1)) {
              Toast('请填写锁体的数量与到货日期！');
              return;
            } else {
              comment += '锁体，需求数量：' + self.batchNum1 + '，到货日期：' + self.start_Date1 + ';';
            }
            if (comment) {
              api.get({ // 提交数据
                key: 'getTaskAdd',
                method: 'POST',
                data: {
                  'body': {
                    'ProcessName': 'KL Install Order Execute Inbox Create Process',
                    'Object Id': self.detailData.Id,
                    'Inbox Comments': comment
                  }
                },
                success: function(data) {
                  if (!data.ERROR) {
                    Toast({
                      message: '提交成功',
                      duration: 5000
                    });
                    KND.Util.back();
                  }
                }
              });
            }
          } else {
            Toast('请填写面板或者锁体信息！');
          }
        });
      }
    },
    components: {buttonGroup, lockLine, cusField}
  };
</script>
<style lang="scss">
  .execution {
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
    .mint-checklist-title {
      font-size: 0.7rem!important;
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

