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
      <!--<mt-header fixed :title="headTitle">
        <div class="cus-fallback" slot="left">
           <mt-button @click="back"><i class="xs-icon icon-back"></i></mt-button>
	      </div>
    </mt-header>-->
      <div class="mint-content add-plan">
        <mt-cell title="工作类型" class="borderBottom">
          <span>{{descType()}}</span>
        </mt-cell>
        <mt-cell title="工作描述" class="borderBottom">
          <span>{{desc()}}</span>
        </mt-cell>
        <mt-cell title="批次名称" class="borderBottom" v-if="descpc()">
          <span>{{descpc()}}</span>
        </mt-cell>
        <mt-cell title="计划开始时间" class="borderBottom"><span >{{initDateStart()}}</span></mt-cell>
        <mt-cell title="计划结束时间" class="borderBottom"><span >{{initDateEnd()}}</span></mt-cell>
         <!--<mt-cell title="实际开始时间" :class="heartVisible" is-link class="borderBottom" @click.native='openStartTime'><span>{{initDate('Start')}} {{ACstartPickerValue}}</span></mt-cell>
         <mt-cell title="实际结束时间" :class="heartVisible" is-link @click.native='openEndTime'><span>{{initDate('End')}} {{ACendPickerValue}}</span></mt-cell>
       --> <cus-field label="实际开始时间"
                   @click.native="openCompletion('pickerEnd', 'Started')"
                      :class="heartVisible"
                   :value="Started" is-link></cus-field>
        <cus-field label="实际结束时间"
                   @click.native="openCompletion('pickerEnd', 'Done')"
                   :class="heartVisible"
                   :value="Done" is-link></cus-field>
        <mt-field label="备注" type="textarea" rows="4" class="disable" :value="description()"></mt-field>
        <button-group>
        <mt-button class="submitBtn" v-if='saveBtn'
                   @click.native="handleSave">更新</mt-button>
        </button-group>
      </div>
      <mt-datetime-picker
        ref="startPicker"
        type="time"
        :endHour="startPickerHour"
        @confirm="startPickerConfirm">
      </mt-datetime-picker>
      <!--<mt-datetime-picker-->
        <!--ref="endPicker"-->
        <!--type="time"-->
        <!--@confirm="endPickerConfirm"-->
        <!--:startHour="startHour"-->
        <!--:endHour="startPickerHour">-->
      <!--</mt-datetime-picker>-->
    <mt-datetime-picker
      ref="pickerEnd"
      v-model="pickerVisibleEnd"
      :endDate="eDate"
      type="datetime"
      year-format="{value}"
      month-format="{value}月"
      date-format="{value}日"
      hour-format="{value}时"
      class="datetime"
      @confirm="handleChangePlan">
    </mt-datetime-picker>

  </div>
</template>

<script type="es6">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import menuBox from 'public/components/cus-menu.vue';
  import cusField from 'public/components/cus-field';
  import { Cell, Button, DatetimePicker, Toast } from 'mint-ui';
  import Vue from 'vue';
  import vp from 'public/plugin/validator';
  Vue.use(vp);

  const NAMESPACE = 'detail';
  let today = new Date();
  export default {
    components: {Cell, buttonGroup, DatetimePicker, menuBox, Button, cusField},
    name: 'add',
    data() {
      return {
        headTitle: '更新计划',
        startPickerHour: '00',
        index: '',
        pickerVisibleEnd: today,
        eDate: today,
        planObj: {},
        Started: '',
        Done: '',
        saveBtn: true // 是否显示保存按钮
      };
    },
    created() {
      // 判断是否显示更新按钮
      this.index = this.$route.query.index;
      var yaer = this.newYear;
      var month = this.newMonth;
      var day = this.newDay;
      if (month < 10) month = `0${month}`;
      if (day < 10) day = `0${day}`;
      var time = new Date(yaer + '/' + month + '/' + day).getTime();
      console.log('=1==' + time);
      var date = new Date();
      var dayeNew = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
      console.log('=1==' + dayeNew);
      var nowTime = new Date(dayeNew).getTime();
      console.log('=2==' + nowTime);
      var today = new Date().getHours();
      this.startPickerHour = today;
      console.log(nowTime <= time);
      if (this.currentDayData[this.index]['Status INT'] === 'Not Started') {
        this.saveBtn = true;
      } else {
        this.Started = new Date(this.currentDayData[this.index]['Started']).format('yyyy-MM-dd hh:mm:ss');
        this.Done = new Date(this.currentDayData[this.index]['Done']).format('yyyy-MM-dd hh:mm:ss');
        this.saveBtn = false;
        this.headTitle = '查看计划';
      }
    },
    computed: {
      ...mapState(NAMESPACE, [
        'workDescDate',
        'allDay',
        'startHour'
      ]),
      ...mapState('index', ['newYear', 'newMonth', 'newDay', 'currentDayData']),
      // * 是否显示
      heartVisible() {
        return this.saveBtn === true ? 'require' : '';
      }
    },
    methods: {
      ...mapActions(NAMESPACE, [
        'setWorkDesc',
        'setDayAll',
        'setStartHour',
        'setACStartPicker',
        'setACEndPicker',
        'setCurrentDayData'
      ]),
      ...mapActions('app', ['getLov']),
      // 处理计划开始时间
      initDateStart() {
        var time = new Date(this.currentDayData[this.index]['Planned']).format('yyyy-MM-dd hh:mm:ss');
        return time;
      },
      // 处理计划结束时间
      initDateEnd() {
        var time = new Date(this.currentDayData[this.index]['Planned Completion']).format('yyyy-MM-dd hh:mm:ss');
        return time;
      },
      openCompletion(picker, key) {
        if (this.saveBtn) {
          this.timeKey = key;
          var self = this;
          console.dir('=====' + today);
          self.pickerVisibleEnd = today;
          self.$refs[picker].open();
        }
      },
      handleChangePlan(value) {
        let self = this;
        var key = self.timeKey;
        if (key === 'Started') {
          self.Started = value.format('yyyy-MM-dd hh:mm:ss');
          self.planObj['Started'] = value.format('MM/dd/yyyy hh:mm:ss');
        } else if (key === 'Done') {
          self.Done = value.format('yyyy-MM-dd hh:mm:ss');
          self.planObj['Done'] = value.format('MM/dd/yyyy hh:mm:ss');
        }
      },
      // 格式化年月日
      initDate(type) {
        var self = this;
        console.dir(self.currentDayData[self.index]);
        if (type === 'Start') { // 实际开始时间
          if (self.currentDayData[self.index]['Started']) {
            return new Date(self.currentDayData[self.index]['Started']).format('yyyy-MM-dd');
          } else {
            if (self.saveBtn) {
              return self.newYear + '-' + self.newMonth + '-' + self.newDay;
            } else {
              return '';
            }
          }
        } else {
          if (self.currentDayData[self.index]['Done']) {
            return new Date(self.currentDayData[self.index]['Done']).format('yyyy-MM-dd');
          } else {
            if (self.saveBtn) {
              return self.newYear + '-' + self.newMonth + '-' + self.newDay;
            } else {
              return '';
            }
          }
        }
      },
      // 描述字段
      descType() {
        return this.currentDayData[this.index]['Type'];
      },
      // 描述字段
      desc() {
        return this.currentDayData[this.index]['KL Detail Type'];
      },
      // 描述字段
      descpc() {
        return this.currentDayData[this.index]['KL Task Batch Name'];
      },
      // 备注字段
      description() {
        return this.currentDayData[this.index]['Description'];
      },
      // 点击选开始时间
      openStartTime() {
        if (this.saveBtn) {
          this.$refs.startPicker.open();
        }
      },
      // 确定开始时间
      startPickerConfirm(date) {
        this.setACStartPicker(date);
        // 限制结束时间只能是开始时间之后
        date.replace(/^\d{2}/, (val, index) => {
          this.setStartHour(val);
        });
        // 如果开始时间 > 结束时间，则清空结束时间
        if (date >= this.ACendPickerValue) {
          this.setACEndPicker('');
        }
      },
      // 确定结束时间
      /* endPickerConfirm(date) {
        if (this.ACstartPickerValue < date) {
          this.setACEndPicker(date);
        } else {
          Toast('结束时间必须大于开始时间');
        }
      },
      // 点击选结束时间
      openEndTime() {
        if (this.saveBtn) {
          this.$refs.endPicker.open();
        }
      },*/
      // 更新状态
      handleSave() {
        var self = this;
        var month = this.newMonth;
        if (month < 10) month = `0${month}`;
        var day = this.newDay;
        if (day < 10) day = `0${day}`;
        var id = '';
        id = this.currentDayData[this.$route.query.index]['Id'];
       /* this.ACstartPickerValue = this.ACstartPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
          this.setACStartPicker(this.ACstartPickerValue.substr(0, this.ACstartPickerValue.length - 3));
        });
        this.ACendPickerValue = this.ACendPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
          this.setACEndPicker(this.ACendPickerValue.substr(0, this.ACendPickerValue.length - 3));
        });
        */
        var StartedTime = self.planObj['Started'];
        var DoneTime = self.planObj['Done'];
        if (!StartedTime) {
          Toast('请选择实际开始时间');
          return;
        }
        if (!DoneTime) {
          Toast('请选择实际结束时间');
          return;
        }
        if (new Date(StartedTime).getTime() > new Date(DoneTime).getTime()) {
          Toast('实际开始时间和实际结束时间都不能大于当前时间');
          return;
        }
        api.get({
          key: 'add',
          data: {
            'Id': id, // 对应的id
            'Type': '日常活动', // 工作类型
            'KL Detail Type': this.currentDayData[this.$route.query.index]['KL Detail Type'], // 工作描述
            'Started': StartedTime, // 实际开始时间
            'Done': DoneTime, // 实际结束时间
            'Planned': this.currentDayData[this.$route.query.index]['Planned'], // 计划开始时间
            'Planned Completion': this.currentDayData[this.$route.query.index]['Planned Completion'] // 计划结束时间
          },
          success: data => {
            if (data.items.Id) {
              MessageBox('提示', '更新计划成功').then(action => {
                this.setACStartPicker('');
                this.setACEndPicker('');
                self.$router.back();
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
