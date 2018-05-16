<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content execution">
      <div>
        <cus-field label="数量" tag="数量"
                   placeholder="请输入"
                   v-valid.require.number
                   type="number"
                   v-model="batchNum"></cus-field>
        <cus-field label="发运日期" tag="发运日期"
                   @click.native="open('picker','start_Date')"
                   :value="start_Date"
                   v-valid.require
                   is-link></cus-field>
        <mt-checklist
          title="类型"
          v-model="value"
          :options="options">
        </mt-checklist>
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
      self.state = param.state;
    },
    data: () => {
      return {
        value: [],
        pickerVisible: today,
        start_Date: '',        // 开始时间
        startDate: '',
        batchNum: '', // 数量
        sDate: today,
        item: '',
        id: '', // 记录新增后的批次ID
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '订单执行',
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
      open(picker) {
        var self = this;
        self.$refs[picker].open();
      },
      handleChange(value) {
        let me = this;
        me.start_Date = value.format('yyyy/MM/dd');
        me.startDate = value.format('MM/dd/yyyy'); // 后台存值格式
      },
      submitFn() {
        var self = this;
        tools.valid.call(this, () => {
          if (self.value.length > 0) {
            var comment = self.value.join('/');
            comment = comment + '，需求数量：' + self.batchNum + '，需求日期：' + self.start_Date;
            console.dir(comment);
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
          } else {
            Toast('请选择类型！');
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

