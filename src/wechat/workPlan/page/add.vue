<template>
  <div id="add-plan">
      <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
    </mt-header>
      <div class="mint-content add-plan">
        <mt-cell title="工作类型" is-link class="borderBottom" @click.native="tapWorkType">
          <span>{{submitData.workTypeName}}</span>
        </mt-cell>
        <mt-cell title="项目名称" is-link class="borderBottom" @click.native="tapProject">
          <span>{{submitData.projectName}}</span>
        </mt-cell>
        <mt-cell title="工作阶段" is-link class="borderBottom" v-show='isStepShow'>
          <span>{{submitData.workStepName}}</span>
        </mt-cell>
        <mt-cell title="工作描述" is-link v-show='isDescriptShow'>
          <span>{{submitData.workDescriptName}}</span>
        </mt-cell>
        <button-group class="singBtn">
        <mt-button class="submitBtn" type="primary" 
                   @click.native="handleSave">保存</mt-button>
      </button-group>
      <mt-cell title="全天活动" class="margin10 borderBottom">
          <mt-switch v-model="allDay" @change="changeSwitch"></mt-switch>
        </mt-cell>
         <mt-cell title="开始时间" class="borderBottom"><span @click='openStartTime'>{{initDate()}} {{startPickerValue}}</span></mt-cell>
         <mt-cell title="结束时间" @click='openEndTime'><span @click='openEndTime'>{{initDate()}} {{endPickerValue}}</span></mt-cell>
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
      <!--工作类型-->
      <mt-popup position="bottom" v-model="showWorkType">
         <menuBox  
          @my-enter="workTypeEnter"
          @my-cancel="corkTypeCancel" 
          @my-change="workTypeChange" vk='name' :type='"workType"'  :slots="workType"></menuBox>
      </mt-popup>
      <!--项目名称-->
      <mt-popup position="bottom" v-model="showProject">
         <menuBox  
          @my-enter="projectEnter"
          @my-cancel="projectCancel" 
          @my-change="projectChange" vk='name' :type='"project"'  :slots="project"></menuBox>
      </mt-popup>
      <!--工作阶段-->
      <mt-popup position="bottom" v-model="showWorkStep">
         <menuBox  
          @my-enter="workStepEnter"
          @my-cancel="workStepCancel" 
          @my-change="workStepChange" vk='name' :type='"workStep"'  :slots="workStep"></menuBox>
      </mt-popup>
      <!--工作描述-->
      <mt-popup position="bottom" v-model="showWorkDescript">
         <menuBox  
          @my-enter="workDescriptEnter"
          @my-cancel="workDescriptCancel" 
          @my-change="workDescriptChange" vk='name' :type='"workDescript"'  :slots="workDescript"></menuBox>
      </mt-popup>

  </div>
</template>

<script type="es6">
  import buttonGroup from 'public/components/cus-button-group';
  import menuBox from 'public/components/cus-menu.vue';
  import { Cell, DatetimePicker, Toast } from 'mint-ui';
  export default {
    components: {Cell, buttonGroup, DatetimePicker, menuBox},
    name: 'add',
    data() {
      return {
        headTitle: '新建计划',
        allDay: false, // 是否全天
        startPickerValue: '', // 开始时间
        endPickerValue: '',  // 结束时间
        showWorkType: false, // 项目类型是否显示
        showProject: false, // 项目名称是否显示
        showWorkStep: false, // 工作阶段是否显示
        showWorkDescript: false, // 工作描述是否显示
        workType: [ // 工作类型
          {
            flex: 1,
            values: [{
              name: '安装管理',
              id: 1
            },
            {
              name: '项目管理',
              id: 2
            },
            {
              name: '其他',
              id: 3
            }],
            textAlign: 'center'
          }
        ],
        project: [], // 项目数据
        workStep: [], // 工作阶段
        workDescript: [], // 工作描述
        submitData: { // 提交参数
          workTypeName: '请选择',
          projectName: '请选择',
          workStepName: '请选择',
          workDescriptName: '请选择'
        },
        isStepShow: true, // 是否显示工作阶段
        isDescriptShow: true, // 是否显示工作描述
        startHour: '00' // 结束时间的最小可选值
      };
    },
    created() {
    },
    methods: {
      // 切换全天
      changeSwitch() {
        if (this.allDay) {
          this.startPickerValue = '00:00';
          this.endPickerValue = '23:59';
        }
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
        this.startPickerValue = date;
        // 限制结束时间只能是开始时间之后
        date.replace(/^\d{2}/, (val, index) => {
          this.startHour = val;
        });
        // 如果开始时间 > 结束时间，则清空结束时间
        if (date >= this.endPickerValue) {
          this.endPickerValue = '';
        }
      },
      // 确定结束时间
      endPickerConfirm(date) {
        if (this.startPickerValue < date) {
          this.endPickerValue = date;
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
      // 点击工作类型
      tapWorkType() {
        this.showWorkType = true;
      },
      // 点击确定 (工作类型弹窗)
      workTypeEnter(val) {
        this.showWorkType = false;
        this.submitData.workTypeName = val[0].name;
        // 如果工作类型是 "其他" 隐藏 【项目名称】、【工作阶段】 字段
        if (val[0].id === 3) {
          this.isStepShow = false;
          this.isDescriptShow = false;
        } else {
          this.isStepShow = true;
          this.isDescriptShow = true;
        }
        this.getProjectData(val[0].id);
      },
      // 取消工作类型弹窗
      corkTypeCancel() {
        this.showWorkType = false;
      },
      // 修改了工作类型数据
      workTypeChange(val) {
        console.log(val);
      },
      // 点击项目名称
      tapProject() {
        this.showProject = true;
      },
      // 点击确定 (项目名称弹窗)
      projectEnter(val) {
        this.showProject = false;
        this.submitData.projectName = val[0].name;
      },
      // 取消项目名称弹窗
      projectCancel() {
        this.showProject = false;
      },
      // 修改了项目名称数据
      projectChange(val) {
        console.log(val);
      },
      // 点击确定 (工作阶段弹窗)
      workStepEnter(val) {
        this.showWorkStep = false;
        this.submitData.workStepName = val[0].name;
      },
      // 取消工作阶段弹窗
      workStepCancel() {
        this.showWorkStep = false;
      },
      // 修改了工作阶段数据
      workStepChange(val) {
        console.log(val);
      },
      // 点击确定 (工作描述弹窗)
      workDescriptEnter(val) {
        this.showWorkDescript = false;
        this.submitData.workDescriptName = val[0].name;
      },
      // 取消工作描述弹窗
      workDescriptCancel() {
        this.showWorkDescript = false;
      },
      // 修改了工作描述数据
      workDescriptChange(val) {
        console.log(val);
      },
      // 根据工作类型获取项目数据
      getProjectData(id, callback) {
        console.log(id);
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
