<template>
  <div>
    <mt-header fixed :title="titleVal">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="mint-content batch">
      <div :class="{disable: !editable}">
        <cus-field label="计划类型" tag="计划类型"
                   @click.native="showLovFn('KL Detail Type')"
                   :value="planObj['KL Detail Type']"
                   v-valid.require
                   is-link></cus-field>
        <cus-field label="计划开始日期" tag="计划开始日期"
                   @click.native="open('picker','Planned')"
                   :value="Planned"
                   v-valid.require
                   is-link></cus-field>
        <cus-field label="计划完成日期" tag="计划完成日期"
                   @click.native="open('picker', 'PlannedCompletion')"
                   :value="PlannedCompletion"
                   v-valid.require
                   is-link></cus-field>
        <div v-show="is_date || is_detailDate" :class="{enable: is_date}">
          <cus-field label="实际开始日期"  tag="实际开始日期"
                     @click.native="open('picker', 'Started')"
                     v-valid.require
                     :value="Started" is-link></cus-field>
          <cus-field label="实际结束日期" tag="实际结束日期"
                     @click.native="open('picker', 'Done')"
                     v-valid.require
                     :value="Done" is-link></cus-field>
        </div>
        <cus-field label="备注"
                 type="textarea"
                 v-model="planObj['Description']"></cus-field>
      </div>
      <button-group>
        <mt-button class="single"
                   v-show="editable"
                   @click.native="submitFn">保存</mt-button>
        <mt-button class="single"
                   v-show="is_date"
                   @click.native="submitFn">提交</mt-button>
      </button-group>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerVisible"
        :startDate="sDate"
        type="datetime"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        hour-format="{value} 时"
        class="datetime"
        @confirm="handleChangePlan">
      </mt-datetime-picker>
    </div>
    <mt-popup v-model="showBox" position="bottom">
      <menu-box @my-enter="enter"
                @my-cancel="showBox=false"
                :vk="vk"
                :type="lovType"
                :slots="slots"></menu-box>
    </mt-popup>
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
    }
  }
</style>
<script type="application/javascript">
  import {mapActions} from 'vuex';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  import buttonGroup from 'public/components/cus-button-group';
  import lockLine from '../components/cusLockLine';
  import cusField from 'public/components/cus-field';
  import menuBox from 'public/components/cus-menu.vue';
  import api from '../api/api';
  // const NameSpace = 'detailPlan';
  // mapp
  Vue.use(vp);
  let mapp = config.mapp;
  let today = new Date();
  export default {
    name: 'detailPlan',
    created() {
      console.dir(1);
      var self = this;
      let param = this.$route.query;
      self.id = param.id;
      self.planType = param.planType;
      self.type = param.type;
      self.is_date = param.is_date;
      self.planItem = param.item;
      console.dir(self.planItem);
      self.planObj['Id'] = '00001';
      // 获取详情
      if (self.type === 'add') {
        // 取 lov 门材质
        self.getLov({
          data: {
            'Type': 'TODO_TYPE',
            'Parent Value': self.planType
          },
          success: data => {
            mapp.option['KL Detail Type'] = KND.Util.toArray(data.items);
          }
        });
      } else {
        self.titleVal = '详细计划详情';
        self.editable = false;
        if (self.planItem) { // planItem有值的时候显示
          self.planObj['Id'] = self.planItem['Id'];
          self.id = self.planItem['Parent Activity Id'];
          self.planObj['KL Detail Type'] = self.planItem['KL Detail Type'];
          self.planObj['Planned'] = self.planItem['Planned'];
          self.planObj['Planned Completion'] = self.planItem['Planned Completion'];
          self.planObj['Started'] = self.planItem['Started'];
          self.planObj['Done'] = self.planItem['Done'];
          self.planObj['Description'] = self.planItem['Description'];
          self.Planned = new Date(self.planItem['Planned']).format('yyyy-MM-dd hh:mm:ss');
          self.PlannedCompletion = new Date(self.planItem['Planned Completion']).format('yyyy-MM-dd hh:mm:ss');
          if (self.planItem['Started']) {
            self.is_detailDate = true;
            self.Started = new Date(self.planItem['Started']).format('yyyy-MM-dd hh:mm:ss');
          }
          if (self.planItem['Done']) {
            self.Done = new Date(self.planItem['Done']).format('yyyy-MM-dd hh:mm:ss');
          }
        }
        if (!self.planObj['Started']) {
          console.dir('没有完成时间需提交');
        }
      }
    },
    data: () => {
      return {
        value: '',
        pickerVisible: today,
        sDate: today,
        index: '',
        id: '',
        timeKey: '', // 标记什么时间
        planItem: '',
        planType: '',
        editable: true,
        is_detailDate: false, // 显示详情时间
        is_date: false, // 是否可以编辑完成时间
        type: 'add', // add 新增 / edit 编辑 / read 只读
        titleVal: '新建详细计划',
        vk: 'Value',
        planObj: {},
        Planned: '',
        PlannedCompletion: '',
        Started: '',
        Done: '',
        slots: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ],
        showBox: false,
        lovType: '',
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
        return this.type === 'read';
      },
      // * 是否显示
      heartVisible() {
        return this.type === 'read' ? '' : 'require';
      }
    },
    methods: {
      ...mapActions('batch', ['setPlanList']),
      ...mapActions('app', ['getLov']),
      open(picker, key) {
        this.timeKey = key;
        var self = this;
        if (key === 'PlannedCompletion') {
          self.aDate = new Date(self.start_Date);
        }
        self.$refs[picker].open();
      },
      handleChangePlan(value) {
        let self = this;
        var key = self.timeKey;
        if (key === 'Planned') {
          self.Planned = value.format('yyyy-MM-dd hh:mm:ss');
          self.planObj['Planned'] = value.format('MM/dd/yyyy hh:mm:ss');
        } else if (key === 'PlannedCompletion') {
          self.PlannedCompletion = value.format('yyyy-MM-dd hh:mm:ss');
          self.planObj['Planned Completion'] = value.format('MM/dd/yyyy hh:mm:ss');
        } else if (key === 'Started') {
          self.Started = value.format('yyyy-MM-dd hh:mm:ss');
          self.planObj['Started'] = value.format('MM/dd/yyyy hh:mm:ss');
        } else if (key === 'Done') {
          self.Done = value.format('yyyy-MM-dd hh:mm:ss');
          self.planObj['Done'] = value.format('MM/dd/yyyy hh:mm:ss');
        }
      },
      // 选择对话框
      showLovFn(type) {
        this.lovType = type;
        this.showBox = true;
        this.slots[0].values = mapp.option[type];
      },
      // 选择确认
      enter(values, type) {
        console.log(values, type);
        let me = this;
        me.showBox = false;
        // 选择填充
        this.planObj[type] = values[0]['Value'];
      },
      submitFn() {
        var self = this;
        tools.valid.call(this, () => {
          api.get({ // 提交详细计划数据
            key: 'setPlan',
            method: 'PUT',
            data: {
              'Id': self.planObj['Id'], // 新增批次返回的ID
              'Parent Activity Id': self.id,
              'Planned': self.planObj.Planned,
              'KL Detail Type': self.planObj['KL Detail Type'],
              'Planned Completion': self.planObj['Planned Completion'],
              'Started': self.planObj.Started,
              'Done': self.planObj.Done,
              'Description': self.planObj.Description
            },
            success: function(data) {
              Toast('保存成功');
              console.log('保存详细计划');
              KND.Util.back();
            }
          });
        });
      }
    },
    components: {buttonGroup, cusField, menuBox, lockLine}
  };
</script>
