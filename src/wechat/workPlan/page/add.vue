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
      <div class="mint-content add-plan">
        <mt-cell title="工作类型" class="borderBottom">
          <span>日常活动</span>
        </mt-cell>
        <mt-cell title="工作描述" is-link  @click.native="tapWorkDescript">
          <span>{{workDescDate.Value}}</span>
        </mt-cell>
      <mt-cell title="全天活动" class="margin10 borderBottom">
          <mt-switch :value="allDay" @change.native="changeSwitch" :disabled="switchDisabled"></mt-switch>
        </mt-cell>
         <mt-cell title="开始时间" class="borderBottom" is-link  @click.native='openStartTime'><span>{{initDate()}} {{startPickerValue}}</span></mt-cell>
         <mt-cell title="结束时间" is-link @click.native='openEndTime'><span>{{initDate()}} {{endPickerValue}}</span></mt-cell>
        <button-group v-if='saveBtn'>
        <mt-button class="single"
                   @click.native="handleSave">保存</mt-button>
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
        headTitle: '新建计划',
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
      // 切换全天
      changeSwitch(val) {
        if (event.target.checked) {
          this.setStartPicker('00:00');
          this.setEndPicker('23:59');
        }
        this.setDayAll(event.target.checked);
      },
      // 获取路由参数 年、月、日
      initDate() {
        return this.$route.query.year + '-' + this.$route.query.month + '-' + this.$route.query.day;
      },
      // 点击选开始时间
      openStartTime() {
        if (this.allDay) {
          Toast('你选择了全天');
          return;
        }
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
        var year = this.$route.query.year;
        var month = this.$route.query.month;
        if (month < 10) month = `0${month}`;
        var day = this.$route.query.day;
        if (day < 10) day = `0${day}`;
        var id = '';
        if (this.$route.path === '/edit') {
          id = this.currentDayData[this.$route.query.index]['Id'];
          this.startPickerValue = this.startPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
            this.setStartPicker(this.startPickerValue.substr(0, this.startPickerValue.length - 3));
          });
          this.endPickerValue = this.endPickerValue.replace(/\d+:\d+:\d+/, (a, b) => {
            this.setEndPicker(this.endPickerValue.substr(0, this.endPickerValue.length - 3));
          });
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
        api.get({
          key: 'add',
          data: {
            'Id': id, // 对应的id
            'Type': '日常活动', // 工作类型
            'KL Detail Type': this.workDescDate.Value, // 工作描述
            'Planned': month + '/' + day + '/' + year + ' ' + this.startPickerValue + ':00', // 计划开始时间
            'Planned Completion': month + '/' + day + '/' + year + ' ' + this.endPickerValue + ':00' // 计划结束时间
          },
          success: data => {
            console.log(data);
            if (data.items.Id) {
              MessageBox('提示', '新建计划成功').then(action => {
                this.setStartPicker('');
                this.setEndPicker('00');
                self.back();
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
