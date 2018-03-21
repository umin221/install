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
        <mt-cell title="工作描述" class="borderBottom">
          <span>{{desc()}}</span>
        </mt-cell>
         <mt-cell title="计划开始时间" class="borderBottom"><span >{{initDateStart()}}</span></mt-cell>
         <mt-cell title="计划结束时间" class="borderBottom"><span >{{initDateEnd()}}</span></mt-cell>
         <mt-cell title="实际开始时间" class="borderBottom"><span  @click='openStartTime'>{{initDate()}} {{startPickerValue}}</span></mt-cell>
         <mt-cell title="实际结束时间" ><span @click='openEndTime'>{{initDate()}} {{endPickerValue}}</span></mt-cell>
              <button-group class="singBtn">
        <mt-button class="submitBtn" type="primary" v-if='saveBtn'
                   @click.native="handleSave">更新</mt-button>
        </button-group>
      </div>
      <mt-datetime-picker
        ref="startPicker"
        type="time"
        @confirm="startPickerConfirm">
      </mt-datetime-picker>
      <mt-datetime-picker
        ref="endPicker"
        type="time"
        @confirm="endPickerConfirm"
        :startHour="startHour">
      </mt-datetime-picker>

  </div>
</template>

<script type="es6">
  import api from '../api/api';
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import menuBox from 'public/components/cus-menu.vue';
  import { Cell, DatetimePicker, Toast } from 'mint-ui';

  const NAMESPACE = 'detail';

  export default {
    components: {Cell, buttonGroup, DatetimePicker, menuBox},
    name: 'add',
    data() {
      return {
        headTitle: '更新计划',
        saveBtn: true // 是否显示保存按钮
      };
    },
    created() {
      // 判断是否显示更新按钮
      if (this.currentDayData[this.$route.query.index]['Status INT'] === 'Not Started') {
        this.saveBtn = true;
      } else {
        this.saveBtn = false;
        this.headTitle = '查看计划';
      }
    },
    computed: {
      ...mapState(NAMESPACE, [
        'workDescDate',
        'allDay',
        'startPickerValue',
        'endPickerValue',
        'startHour'
      ]),
      ...mapState('index', ['currentDayData'])
    },
    methods: {
      ...mapActions(NAMESPACE, [
        'setWorkDesc',
        'setDayAll',
        'setStartPicker',
        'setEndPicker',
        'setStartHour'
      ]),
      ...mapActions('app', ['getLov']),
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
        this.$refs.startPicker.open();
      },
      // 确定开始时间
      startPickerConfirm(date) {
        this.setStartPicker(date);
        // 限制结束时间只能是开始时间之后
        date.replace(/^\d{2}/, (val, index) => {
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
        this.$refs.endPicker.open();
      },
      // 保存
      handleSave() {
        var self = this;
        var year = this.$route.query.year;
        var month = this.$route.query.month;
        if (month < 10) month = `0${month}`;
        var day = this.$route.query.day;
        if (day < 10) day = `0${day}`;
        api.get({
          key: 'add',
          data: {
            'Id': new Date().getTime(), // 对应的id
            'Type': '日常活动', // 工作类型
            'KL Detail Type': this.workDescDate.value, // 工作描述
            'Planned': month + '/' + day + '/' + year + ' ' + this.startPickerValue + ':00', // 计划开始时间
            'Planned Completion': month + '/' + day + '/' + year + ' ' + this.endPickerValue + ':00' // 计划结束时间
          },
          success: data => {
            console.log(data);
            if (data.items.Id) {
              MessageBox('提示', '新建计划成功').then(action => {
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
