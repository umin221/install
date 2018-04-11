<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
      <mt-button @click.native="toSaveFn(2)" slot="right" v-text="">保存</mt-button>
    </mt-header>
    <div class="mint-content batch" :class="{'disable': !editable}">
      <div>
        <mt-cell title="批次">
          <span>{{batchCode}}</span>
        </mt-cell>
        <mt-cell title="计划开始日期" @click.native="open('picker')" :value="start_Date" is-link></mt-cell>
        <mt-cell title="计划完成日期" @click.native="open('pickerEnd')" :value="end_Date" is-link></mt-cell>
        <mt-field label="计划数量" placeholder="请输入"
                  :class="heartVisible" v-model="batchNum"></mt-field>
      </div>
      <div class="lock-line">
        <lock-line title="详细计划" @click="addPlanFn('')">
          <mt-cell-swipe v-for="(line, index) in planList" class="lock-line-cell enable" ref="body"
                         @click.native="addPlanFn(line)"
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
      <mt-datetime-picker
        ref="pickerEnd"
        type="date"
        :startDate="eDate"
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
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import lockLine from '../components/cusLockLine';
  import api from '../api/api';
  const NameSpace = 'batch';
  let today = new Date();
  export default {
    name: 'batch',
    created() {
      var self = this;
      let param = this.$route.query;
      self.state = param.state;
      self.type = param.type;
      self.item = param.item;
      if (self.type === 'add') {
        if (self.pcObj.Id) { // 批次页面新增保存有数据
          self.id = self.pcObj.Id;
          self.batchCode = self.pcObj.Id; // 新增保存的ID
          self.start_Date = new Date(self.pcObj.Planned).format('yyyy-MM-dd'); // 开始时间
          self.end_Date = new Date(self.pcObj['Planned Completion']).format('yyyy-MM-dd'); // 结束时间
          self.startDate = new Date(self.start_Date).format('MM/dd/yyyy'); // 后台存值格式
          self.endDate = new Date(self.end_Date).format('MM/dd/yyyy');
          self.batchNum = self.pcObj['KL Install Amount Requested'] || 0; // 数量
          self.getPlanList(self.batchCode);
        }
      } else if (self.type === 'edit') {
        if (self.pcObj.Id) { // 批次页面新增保存有数据
          self.id = self.pcObj.Id;
          self.batchCode = self.pcObj.Id; // 新增保存的ID
          self.start_Date = new Date(self.pcObj.Planned).format('yyyy-MM-dd'); // 开始时间
          self.end_Date = new Date(self.pcObj['Planned Completion']).format('yyyy-MM-dd'); // 结束时间
          self.startDate = new Date(self.start_Date).format('MM/dd/yyyy'); // 后台存值格式
          self.endDate = new Date(self.end_Date).format('MM/dd/yyyy');
          self.batchNum = self.pcObj['KL Install Amount Requested'] || 0; // 数量
          self.getPlanList(self.batchCode);
        } else {
          self.getBatch(self.item.Id);
          self.id = self.item.Id;
          self.batchCode = self.item.Id; // 详情的ID
          self.getPlanList(self.item.Id);
        }
      }
    },
    data: () => {
      return {
        value: '',
        batchCode: '', // 批次
        start_Date: '',        // 开始时间
        startDate: '',
        end_Date: '',        // 结束时间
        endDate: '',
        batchNum: '', // 数量
        pickerVisible: today,
        sDate: today,
        eDate: today,
        planList: [],
        item: '',
        id: '', // 记录新增后的批次ID
        type: 'edit', // add 新增 / edit 编辑 / read 只读
        editable: true,
        titleVal: '新建批次',
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
      ...mapState('detail', ['itemTask']),
      ...mapState(NameSpace, ['pcObj']),
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
      ...mapActions('app', ['getLov']),
      ...mapActions(NameSpace, ['getPcObj']),
      open(picker) {
        var self = this;
        self.eDate = new Date(self.start_Date);
        self.$refs[picker].open();
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
      getPlanList(id) {
        console.log('取详细计划数据');
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
      getBatch(id) {
        var self = this;
        api.get({ // 批次详情
          key: 'findBatchById', // 'findBatchById',
          data: {
            id: id
          },
          success: data => {
            if (!data.ERROR) {
              console.dir(data);
              self.batchCode = data.Id; // 批次
              self.start_Date = new Date(data.Planned).format('yyyy-MM-dd'); // 开始时间
              self.end_Date = new Date(data['Planned Completion']).format('yyyy-MM-dd'); // 结束时间
              self.startDate = new Date(self.start_Date).format('MM/dd/yyyy'); // 后台存值格式
              self.endDate = new Date(self.end_Date).format('MM/dd/yyyy');
              self.batchNum = data['KL Install Amount Requested'] || 0; // 数量
              self.getPcObj(data); // 保存store
            }
          }
        });
      },
      addPlanFn(obj) {
        var self = this;
        if (self.id) { // 有批次直接跳转
          let planType = self.itemTask['KL Detail Type']; // 取统一批次
          this.$router.push({
            name: 'detailPlan',
            query: {
              type: 'add',
              planType: planType,
              id: self.id,
              item: obj
            }
          });
        } else {  // 先保存批次
          this.toSaveFn('1');
        }
      },
      toSaveFn(num) { // num=1 保存并跳转详细计划  num = 2 只是保存 不跳转
        var self = this;
        var aId = '';
        if (self.type === 'add') {
          aId = self.item.Id;
        } else if (self.type === 'edit') {
          aId = self.item['Parent Activity Id'];
        }
        var parma = {
          'Planned': self.startDate,
          'Planned Completion': self.endDate,
          'KL Install Amount Requested': self.batchNum,
          'Id': self.batchCode || '10001',
          'KL Detail Type': self.item['KL Detail Type'],
          'Parent Activity Id': aId
        };
        var Status = '';
        self.getLov({ // 取类型值
          data: {
            'Type': 'EVENT_STATUS',
            'Name': 'Planning'
          },
          success: data => {
            Status = KND.Util.toArray(data.items)[0].Value;
            parma.Status = Status;
            parma['KL Detail Type'] = self.itemTask['KL Detail Type']; // 取默认第一个批次的 类型、Template Id
            parma['Template Id'] = self.itemTask['Template Id'];
            parma['Order Id'] = self.itemTask['Order Id'];
            api.get({ // 提交数据
              key: 'getUPData',
              method: 'PUT',
              data: parma,
              success: function(data) {
                if (!data.ERROR) {
                  self.id = data.items.Id; // 新增批次返回的ID
                  self.batchCode = data.items.Id; // 新增批次返回的ID
                  self.getPcObj(data.items); // 保存store
                  if (num === '1') {
                    let planType = self.itemTask['KL Detail Type']; // 取统一批次
                    self.$router.push({
                      name: 'detailPlan',
                      query: {
                        type: 'add',
                        planType: planType,
                        id: self.batchCode,
                        item: ''
                      }
                    });
                  } else {
                    Toast('保存成功');
                  }
                }
              }
            });
          }
        });
      },
      submitFn() {
        var self = this;
        if (self.planList.length === 0) {
          Toast('详细计划不能为空！');
          return;
        }
        MessageBox({
          title: '提示',
          message: ' 确认提交？一经提交不可修改',
          showCancelButton: true
        }).then(action => {
          if (action === 'confirm') {
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
                if (!data.ERROR) {
                  Toast('提交成功');
                  KND.Util.back();
                }
              }
            });
          }
        });
      }
    },
    components: {buttonGroup, lockLine}
  };
</script>
