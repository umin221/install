/**
* @file 新增计划
* @author  石
* @date  2018/3/16
*/
<template>
  <div id="add-plan">
    <mt-header fixed :title="headTitle">
      <fallback slot="left" @click.native="back"></fallback>
    </mt-header>
      <!--<mt-header fixed :title="headTitle">
        <div class="cus-fallback" slot="left">
           <mt-button @click="back"><i class="xs-icon icon-back"></i></mt-button>
	      </div>
    </mt-header>-->
      <div class="mint-content add-plan">
        <mt-cell title="工作类型" class="borderBottom">
          <span>日常活动</span>
        </mt-cell>
        <mt-cell title="工作描述" class="borderBottom">
          <span>{{desc()}}</span>
        </mt-cell>
         <mt-cell title="计划开始时间" class="borderBottom"><span >{{initDateStart()}}</span></mt-cell>
         <mt-cell title="计划结束时间" class="borderBottom"><span >{{initDateEnd()}}</span></mt-cell>
         <mt-cell title="实际开始时间" is-link class="borderBottom" @click.native='openStartTime'><span>{{initDate()}} {{ACstartPickerValue}}</span></mt-cell>
         <mt-cell title="实际结束时间" is-link @click.native='openEndTime'><span>{{initDate()}} {{ACendPickerValue}}</span></mt-cell>
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
      <mt-datetime-picker
        ref="endPicker"
        type="time"
        @confirm="endPickerConfirm"
        :startHour="startHour"
        :endHour="startPickerHour">
      </mt-datetime-picker>

  </div>
</template>

<script type="es6">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import menuBox from 'public/components/cus-menu.vue';
  import { Cell, Button, DatetimePicker, Toast } from 'mint-ui';

  const NAMESPACE = 'detail';

  export default {
    components: {Cell, buttonGroup, DatetimePicker, menuBox, Button},
    name: 'add',
    data() {
      return {
        headTitle: '更新计划',
        startPickerHour: '00',
        saveBtn: true // 是否显示保存按钮
      };
    },
    created() {
      // 判断是否显示更新按钮
      var yaer = this.$route.query.year;
      var month = this.$route.query.month;
      var day = this.$route.query.day;
      if (month < 10) month = `0${month}`;
      if (day < 10) day = `0${day}`;
      var time = new Date(yaer + '-' + month + '-' + day).getTime();
      var date = new Date();
      var nowTime = new Date(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()).getTime();
      var today = new Date().getHours();
      this.startPickerHour = today;
      console.log(nowTime <= time);
      if (this.currentDayData[this.$route.query.index]['Status INT'] === 'Not Started' && nowTime <= time) {
        this.saveBtn = true;
        this.setACStartPicker('');
        this.setACEndPicker('');
      } else {
        this.setACStartPicker(this.currentDayData[this.$route.query.index]['Started'].replace(/\d+\/\d+\/\d+\s/, ''));
        this.setACEndPicker(this.currentDayData[this.$route.query.index]['Done'].replace(/\d+\/\d+\/\d+\s/, ''));
        this.saveBtn = false;
        this.headTitle = '查看计划';
      }
    },
    computed: {
      ...mapState(NAMESPACE, [
        'workDescDate',
        'allDay',
        'ACstartPickerValue',
        'ACendPickerValue',
        'startHour'
      ]),
      ...mapState('index', ['currentDayData'])
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
      // 返回
      back() {
        console.log('');
        this.$router.push({
          path: '/',
          query: {
            year: this.$route.query.year,
            month: this.$route.query.month,
            day: this.$route.query.day
          }
        });
      },
      // 处理计划开始时间
      initDateStart() {
        var time = this.currentDayData[this.$route.query.index]['Planned'].replace(/\d+\/\d+\/\d+\s/, '');
        return this.$route.query.year + '-' + this.$route.query.month + '-' + this.$route.query.day + ' ' + time;
      },
      // 处理计划结束时间
      initDateEnd() {
        var time = this.currentDayData[this.$route.query.index]['Planned Completion'].replace(/\d+\/\d+\/\d+\s/, '');
        return this.$route.query.year + '-' + this.$route.query.month + '-' + this.$route.query.day + ' ' + time;
      },
      // 格式化年月日
      initDate() {
        return this.$route.query.year + '-' + this.$route.query.month + '-' + this.$route.query.day;
      },
      // 描述字段
      desc() {
        return this.currentDayData[this.$route.query.index]['KL Detail Type'];
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
      endPickerConfirm(date) {
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
      },
      // 更新状态
      handleSave() {
        var self = this;
        var year = this.$route.query.year;
        var month = this.$route.query.month;
        if (month < 10) month = `0${month}`;
        var day = this.$route.query.day;
        if (day < 10) day = `0${day}`;
        var id = '';
        id = this.currentDayData[this.$route.query.index]['Id'];
        this.ACstartPickerValue = this.ACstartPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
          this.setACStartPicker(this.ACstartPickerValue.substr(0, this.ACstartPickerValue.length - 3));
        });
        this.ACendPickerValue = this.ACendPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
          this.setACEndPicker(this.ACendPickerValue.substr(0, this.ACendPickerValue.length - 3));
        });
        if (this.ACstartPickerValue === '') {
          Toast('请选择实际开始时间');
          return;
        }
        if (this.ACendPickerValue === '') {
          Toast('请选择实际结束时间');
          return;
        }
        var StartedTime = month + '/' + day + '/' + year + ' ' + this.ACstartPickerValue + ':00';
        var DoneTime = month + '/' + day + '/' + year + ' ' + this.ACendPickerValue + ':00';
        if (new Date(StartedTime).getTime() > new Date().getTime() || new Date(DoneTime) > new Date().getTime()) {
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
