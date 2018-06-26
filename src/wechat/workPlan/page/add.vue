/**
* @file 新增计划
* @author  石
* @date  2018/3/16
*/
<template>
  <div id="add-plan">
      <mt-header fixed :title="headTitle">
        <fallback slot="left"></fallback>
      </mt-header>
      <div class="mint-content add-plan">
        <mt-cell title="工作类型" class="borderBottom">
          <span>日常活动</span>
        </mt-cell>
        <mt-cell title="工作描述" is-link :class="heartVisible"  @click.native="tapWorkDescript">
          <span>{{workDescDate.Value}}</span>
        </mt-cell>
        <mt-cell title="全天活动" class="margin10 borderBottom">
          <mt-switch :value="allDay" @change.native="changeSwitch" :disabled="switchDisabled"></mt-switch>
        </mt-cell>
        <mt-cell title="开始时间" class="borderBottom" :class="heartVisible" is-link  @click.native='openStartTime'><span>{{initDate()}} {{startPickerValue}}</span></mt-cell>
        <mt-cell title="结束时间" :class="heartVisible" is-link @click.native='openEndTime'><span>{{initDate()}} {{endPickerValue}}</span></mt-cell>
        <mt-field label="备注" placeholder="可补充工作描述明细" type="textarea" rows="4" v-model="Description"></mt-field>
        <button-group v-if='saveBtn'>
        <mt-button class="single"
                   @click.native="handleSave">保存</mt-button>
        </button-group>
      </div>
      <mt-datetime-picker
        ref="startPicker"
        type="time"
        class="datetime"
        :startHour="startPickerHour"
        @confirm="startPickerConfirm">
      </mt-datetime-picker>
      <mt-datetime-picker
        ref="endPicker"
        type="time"
        :startHour="startHour"
        @confirm="endPickerConfirm">
      </mt-datetime-picker>
      <!--工作描述-->
      <mt-popup position="bottom" v-model="showWorkDescript">
         <menuBox
          @my-enter="workDescriptEnter"
          @my-cancel="workDescriptCancel"
          vk='Value' :type='"workDescript"'  :slots="workDescript"></menuBox>
      </mt-popup>

  </div>
</template>

<script type="es6">
  import api from '../api/api';
  import {mapState, mapActions, mapMutations} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import menuBox from 'public/components/cus-menu.vue';
  import { Cell, DatetimePicker, Toast } from 'mint-ui';

  const NAMESPACE = 'detail';

  export default {
    components: {Cell, buttonGroup, DatetimePicker, menuBox},
    name: 'add',
    data() {
      return {
        headTitle: '新建计划',
        startPickerHour: 0,
        startPickerMinutes: 0,
        Description: '', // 备注
        newTimes: new Date(), // 当前年月日
        showWorkDescript: false,
        showWorkType: false, // 项目类型是否显示
        workDescript: [
          {flex: 1, values: [], className: 'slot1', textAlign: 'center'}
        ], // 工作描述
        switchDisabled: false, // 是否禁止全天
        saveBtn: true // 是否显示保存按钮
      };
    },
    created() {
      var self = this;
      self.setDayAll(false);
      self.newTimes = self.newTimes.getFullYear() + '-' + (self.newTimes.getMonth() + 1) + '-' + self.newTimes.getDate() ; // 当前年月日
      if (this.$route.path === '/edit') {
        this.headTitle = '编辑计划详情';
        this.setWorkDesc({
          Value: this.currentDayData[this.$route.query.index]['KL Detail Type']
        });
        this.startPickerConfirm(this.currentDayData[this.$route.query.index]['Planned'].replace(/\d+\/\d+\/\d+\s/, ''));
        this.setEndPicker(this.currentDayData[this.$route.query.index]['Planned Completion'].replace(/\d+\/\d+\/\d+\s/, ''));
      }
      // 获取工作描述选项
      this.getLov({
        data: {
          Type: 'TODO_TYPE',
          Parent: 'Daily Activities'
        },
        success: data => {
          self.workDescript[0].values = data.items;
        }
      });
    },
    computed: {
      ...mapState(NAMESPACE, [
        'workDescDate',
        'allDay',
        'startPickerValue',
        'endPickerValue',
        'startHour'
      ]),
      ...mapState('index', ['newYear', 'newMonth', 'newDay', 'currentDayData']),
      // * 是否显示
      heartVisible() {
        return 'require';
      }
    },
    methods: {
      ...mapMutations(NAMESPACE, ['workDesc']),
      ...mapActions(NAMESPACE, [
        'setWorkDesc',
        'setDayAll',
        'setStartPicker',
        'setEndPicker',
        'setStartHour'
      ]),
      ...mapActions('app', ['getLov']),
      // 切换全天
      changeSwitch(val) {
        var self = this;
        if (event.target.checked) {
          var today = new Date().getHours();
          var minutes = new Date().getMinutes();
          console.dir(self.newTimes + ' ' + today + ':' + minutes);
          if (self.newTimes === self.initDate()) { // 选择当前时间以后
            this.setStartPicker(new Date(new Date().setMinutes(new Date().getMinutes() + 1)).format('hh:mm'));
          } else {
            this.setStartPicker('00:00');
          }
          this.setEndPicker('23:59');
        }
        this.setDayAll(event.target.checked);
      },
      // 获取路由参数 年、月、日
      initDate() {
        return this.newYear + '-' + this.newMonth + '-' + this.newDay;
      },
      // 点击选开始时间
      openStartTime() {
        var self = this;
        if (this.allDay) {
          Toast('你选择了全天');
          return;
        }
        var today = new Date().getHours();
        var minutes = new Date().getMinutes();
        console.dir(self.newTimes + ' ' + today + ':' + minutes);
        if (self.newTimes === self.initDate()) { // 选择当前时间以后
          self.startPickerHour = today;
          self.startPickerMinutes = minutes;
        } else {
          self.startPickerHour = 0;
          self.startPickerMinutes = 0;
        }
        this.$refs.startPicker.open();
      },
      // 确定开始时间
      startPickerConfirm(date) {
        var self = this;
        var today = new Date().getHours();
        var minutes = new Date().getMinutes();
        console.dir(self.newTimes + ' ' + today + ':' + minutes);
        if (self.newTimes === self.initDate()) { // 选择当前时间以后
          /* if (date < (today + ':' + minutes)) {
            Toast('开始时间必须大于当前时间');
            return;
          }*/
          var selectToday = parseInt(date.split(':')[0], 10);
          var selectMinutes = parseInt(date.split(':')[1], 10);
          console.dir(selectToday + selectMinutes);
          if (selectToday < today) {
            Toast('开始时间必须大于当前时间');
            return;
          } else if (selectToday === today) {
            if ((minutes + 1) < 10) {
              minutes = '0' + (minutes + 1);
            }
            if (selectMinutes < minutes) {
              Toast('开始时间必须大于当前时间');
              return;
            }
          }
        }
        this.setStartPicker(date);
        // 限制结束时间只能是开始时间之后
        date.replace(/^\d{2}/, (val, index) => {
          val = parseInt(val, 10);
          this.setStartHour(val);
        });
        // 如果开始时间 > 结束时间，则清空结束时间
        if (date >= this.endPickerValue) {
          this.setEndPicker('');
        }
      },
      // 确定结束时间
      endPickerConfirm(date) {
        if (this.startPickerValue < date) {
          this.setEndPicker(date);
        } else {
          Toast('结束时间必须大于开始时间');
        }
      },
      // 点击选结束时间
      openEndTime() {
        if (this.allDay) {
          Toast('你选择了全天');
          return;
        }
        this.$refs.endPicker.open();
      },
      // 点击工作阶段
      tapWorkDescript() {
        this.showWorkDescript = true;
      },
      // 点击确定 (工作描述弹窗)
      workDescriptEnter(val) {
        this.showWorkDescript = false;
        this.setWorkDesc(val[0]);
      },
      // 取消工作描述弹窗
      workDescriptCancel() {
        this.showWorkDescript = false;
      },
      // 根据工作类型获取项目数据
      getProjectData(id, callback) {
        console.log(id);
      },
      // 保存
      handleSave() {
        var self = this;
        var year = this.newYear;
        var month = this.newMonth;
        if (month < 10) month = `0${month}`;
        var day = this.newDay;
        if (day < 10) day = `0${day}`;
        var id = '';
        if (this.$route.path === '/edit') {
          id = this.currentDayData[this.$route.query.index]['Id'];
         /* this.startPickerValue = this.startPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
            this.setStartPicker(this.startPickerValue.substr(0, this.startPickerValue.length - 3));
          });
          this.endPickerValue = this.endPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
            this.setEndPicker(this.endPickerValue.substr(0, this.endPickerValue.length - 3));
          });*/
        } else {
          id = new Date().getTime();
        }
        if (this.workDescDate.Value === '请选择描述') {
          Toast('请选择工作描述');
          return;
        }
        if (this.startPickerValue === '') {
          Toast('请选择计划开始时间');
          return;
        }
        if (this.endPickerValue === '') {
          Toast('请选择计划结束时间');
          return;
        }
        if (this.startPickerValue) {
          var today = new Date().getHours();
          var minutes = new Date().getMinutes();
          console.dir(self.newTimes + ' ' + today + ':' + minutes);
          if (self.newTimes === self.initDate()) { // 选择当前时间以后
            /* if (self.startPickerValue < (today + ':' + (minutes + 1))) {
              Toast('开始时间必须大于当前时间');
              return;
            }*/
            var selectToday = parseInt(self.startPickerValue.split(':')[0], 10);
            var selectMinutes = parseInt(self.startPickerValue.split(':')[1], 10);
            console.dir(selectToday + selectMinutes);
            if (selectToday < today) {
              Toast('开始时间必须大于当前时间');
              return;
            } else if (selectToday === today) {
              if ((minutes + 1) < 10) {
                minutes = '0' + (minutes + 1);
              }
              if (selectMinutes < minutes) {
                Toast('开始时间必须大于当前时间');
                return;
              }
            }
          }
        }
        api.get({
          key: 'add',
          data: {
            'Id': id, // 对应的id
            'Type': '日常活动', // 工作类型
            'Description': this.Description, // 描述
            'KL Detail Type': this.workDescDate.Value, // 工作描述
            'Planned': month + '/' + day + '/' + year + ' ' + this.startPickerValue + ':00', // 计划开始时间
            'Planned Completion': month + '/' + day + '/' + year + ' ' + this.endPickerValue + ':00' // 计划结束时间
          },
          success: data => {
            console.log(data);
            if (data.items.Id) {
              MessageBox('提示', '保存成功').then(action => {
                this.setStartPicker('');
                this.setEndPicker('');
                this.workDesc({ // 工作描述
                  Value: '请选择描述'
                });
                KND.Util.back();
              });
            }
          }
        });
        console.log('save...');
      }
    }
  };
</script>

<style scoped>
 .borderBottom{
   border-bottom: 1px solid #eee;
 }
 .add-plan{
   margin-bottom: 2.4rem;
 }
 .margin10{
   margin-top: 10px;
 }
</style>
