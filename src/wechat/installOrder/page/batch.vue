<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content batch">
      <div :class="{'readonly':read}">
        <mt-cell title="批次">
          <span>{{batchCode}}</span>
        </mt-cell>
        <mt-cell title="计划开始日期" @click.native="open('picker')" :value="start_Date" is-link></mt-cell>
        <mt-cell title="计划完成日期" @click.native="open('pickerEnd')" :value="end_Date" is-link></mt-cell>
        <mt-field label="计划开孔数量" placeholder="请输入"
                  :class="heartVisible" v-model="batchNum"></mt-field>
      </div>
      <button-group>
        <mt-button type="primary" class="single"
                   @click.native="submitFn">提交</mt-button>
      </button-group>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChange">
      </mt-datetime-picker>
      <mt-datetime-picker
        ref="pickerEnd"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        class="datetime"
        @confirm="handleChangeEnd">
      </mt-datetime-picker>
    </div>
  </div>
</template>
<style lang="scss">
  .batch {
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
  }
</style>
<script type="application/javascript">
  import {mapState} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import api from '../api/api';
  const NameSpace = 'batch';
  export default {
    name: 'detail',
    created() {
      console.dir(1);
      var self = this;
      self.titleVal = '新建开孔批次';
      let param = this.$route.query;
      this.state = param.state;
      this.type = param.type;
      this.id = param.item.Id;
      this.item = param.item;
      console.dir('=====' + this.id);
      // 获取详情
      if (this.type === 'add') {
        this.start_Date = ''; // 开始时间
        this.end_Date = ''; // 开始时间
        this.batchNum = 0; // 数量
        this.batchCode = '10001'; // 随机默认
      } else {
        this.getBatch(this.item);
      }
    },
    data: () => {
      return {
        value: '',
        batchCode: '', // 批次
        start_Date: new Date(),        // 开始时间
        startDate: null,
        end_Date: new Date(),        // 结束时间
        endDate: null,
        batchNum: 0, // 数量
        pickerVisible: true,
        id: '',
        item: '',
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '新建开孔批次',
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
      ...mapState(NameSpace, ['form']),
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
      open(picker) {
        this.$refs[picker].open();
      },
      handleChange(value) {
        let me = this;
        me.start_Date = value.format('yyyy/MM/dd');
        me.startDate = value.format('MM/dd/yyyy'); // 后台存值格式
      },
      handleChangeEnd(value) {
        let me = this;
        me.end_Date = value.format('yyyy/MM/dd');
        me.endDate = value.format('MM/dd/yyyy');
      },
      getBatch(obj) {
        var self = this;
        api.get({ // 批次详情
          key: 'findBatchById', // 'findBatchById',
          data: {
            id: obj.Id
          },
          success: data => {
            console.dir(data);
            self.batchCode = data.Id; // 批次
            self.start_Date = data.Planned; // 开始时间
            self.end_Date = data['Planned Completion']; // 结束时间
            self.batchNum = data['KL Install Amount Requested'] || 0; // 数量
          }
        });
      },
      submitFn() {
        // pending
        var self = this;
        api.get({ // 更改按钮状态
          key: 'getUPStatus',
          method: 'POST',
          data: {
            'body': {
              'ProcessName': 'KL Install Task Submit For Approval Workflow',
              'RowId': self.id
            }
          },
          success: function(data) {
            api.get({ // 提交数据
              key: 'getUPData',
              method: 'PUT',
              data: {
                'Planned': self.startDate,
                'Planned Completion': self.endDate,
                'KL Install Amount Requested': self.batchNum,
                'Id': self.batchCode,
                'KL Detail Type': self.item['KL Detail Type'],
                'Parent Activity Id': self.item.Id

              },
              success: function(data) {
                history.go(-1);
              }
            });
          }
        });
      }
    },
    components: {buttonGroup}
  };
</script>
