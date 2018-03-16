<template>
  <div id='calendar'>
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
      <mt-button v-show="isShowBtn" class="xs-icon icon-add" slot="right" @click.native="createPlan"></mt-button>
    </mt-header>
    <div class="date mint-content">
      <div class="calendar-content">
        <!-- 年份 月份 -->
      <div class="month">
        <i class="el-icon-arrow" @click="pickPreNext(currentYear,currentMonth,0)"> < </i>
        <span @click="openPicker">{{ currentYear }} 年 {{ currentMonth }} 月</span>
        <i class="el-icon-arrow" @click="pickPreNext(currentYear,currentMonth,42)"> > </i>
      </div>
      <!-- 星期 -->
      <ul class="weekdays">
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li>六</li>
        <li>日</li>
      </ul>
      <!-- 日期 -->
      <div class="bodyDiv">
        <ul class="days" v-for="(value,index1) in daysUL">
          <li @click="pick(day,index+index1*7)" v-for="(day, index) in value" >
            <!--本月-->
            <div class="dateItem" :class="{'selected':(isSelected[(index+index1*7)] || (new Date(day).getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate() && isSelected.length ==0))}">
              <span v-if="day==='spaces'"></span>
              <span v-else >{{ day.getDate() }}</span>
              <b v-if="day!=='spaces'" class="flag"></b>
           </div>
          </li>
        </ul>
      </div>
      <div class="planList">
        <mt-cell-swipe
          @click.native="toDetail()"
          class="planListItem"
          title="标题文字"
          label="这是一些项目信息"
          :right="[
            {
              content: '删除',
              style: { background: 'red', color: '#fff' },
              handler: () => this.deletePlan()
            }
          ]">
          <div class="status">
            <p>11:30 - 12:35</p>
            <p class="text">已审批</p>
          </div>
          <check-box :checkList="checkList" @change="change"></check-box>
        </mt-cell-swipe>
        <mt-cell-swipe
          @click.native="toDetail()"
          class="planListItem"
          title="标题文字"
          label="这是一些项目信息"
          :right="[
            {
              content: '删除',
              style: { background: 'red', color: '#fff' },
              handler: () => this.deletePlan()
            }
          ]">
          <div class="status">
            <p>11:30 - 12:35</p>
            <p class="text">已审批</p>
          </div>
          <check-box :checkList="checkList" @change="change"></check-box>
        </mt-cell-swipe>
        
      </div>
      </div>
       <button-group class="singBtn">
        <mt-button class="submitBtn" type="primary" 
                   @click.native="handleSubmit">提交</mt-button>
      </button-group>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerValue"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="handleConfirm"
        >
      </mt-datetime-picker>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex';
  import buttonGroup from 'public/components/cus-button-group';
  import checkBox from '../components/checkbox';
  import { DatetimePicker, CellSwipe } from 'mint-ui';

  const NAMESPACE = 'index';

  export default {
    components: {buttonGroup, DatetimePicker, CellSwipe, checkBox},
    name: 'date',
    data() {
      return {
        headTitle: '工作计划',
        days: [],
        daysUL: [],
        params: {
          selectDay: '',
          type: ''
        },
        isSelected: [],
        isBan: [],
        isXiu: [],
        restDays: {
          year: '',
          month: '',
          day: '',
          resttype: '',
          restdate: ''
        },
        restDaysList: [],
        banList: [],
        xiuList: [],
        selectIndex: '',
        pickerValue: '', // DatetimePicker组件默认值
        checkList: [], // 选中项
        beforeSpaces: [], // 前面需要空几天
        isShowBtn: true // 是否显示新建按钮
      };
    },
    created() {
      var date = new Date();
      this.initData(this.formatDate(date.getFullYear(), date.getMonth() + 1, 1), true);
      // 给定DatetimePicker组件默认值
      this.pickerValue = this.currentYear + '-' + this.currentMonth + '-' + this.currentDay;
    },
    computed: {
      ...mapState(NAMESPACE, ['currentYear', 'currentMonth', 'currentDay', 'firstWeek'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['setYear', 'setMonth', 'setDay', 'setWeek']),
      // 新建计划
      createPlan() {
        this.$router.push({
          path: './add',
          query: {
            year: this.currentYear,
            month: this.currentMonth,
            day: this.selectIndex - (this.beforeSpaces.length - 1)
          }
        });
      },
      // 是否选中
      change(val) {
        // 如果是选中就添加到数组中
        if (event.target.checked) {
          this.checkList.push(val);
        }
        this.checkList.forEach((item, index) => {
          if (item === val) {
            // 如果是取消就从数组中删除
            if (!event.target.checked) {
              this.checkList.splice(index, 1);
            }
          }
        });
        console.log(val, event.target.checked);
      },
      // 删除计划
      deletePlan() {
        this.$messagebox('删除成功');
      },
      // 跳转详情
      toDetail(index) {
        this.$router.push('./detail');
      },
      // 提交
      handleSubmit() {
        console.log('new plan');
      },
      // 打开日期面板
      openPicker() {
        this.$refs.picker.$el.lastChild.lastChild.children[2].style.display = 'none'; // 隐藏日选择
        this.$refs.picker.open();
      },
      // 确认日期选择
      handleConfirm(date) {
        this.pickPreNext(date.getFullYear(), date.getMonth(), 42);
      },
      // 格式化日期
      formatDate(year, month, day) {
        const y = year;
        let m = month;
        if (m < 10) m = `0${m}`;
        let d = day;
        if (d < 10) d = `0${d}`;
        return `${y}-${m}-${d}`;
      },
      // 初始化日期
      initData(cur, init) {
        let date = '';
        if (cur) {
          date = new Date(cur);
        } else {
          date = new Date();
        }
        // this.currentDay = date.getDate();
        this.setDay(date.getDate());
        // this.currentYear = date.getFullYear();
        this.setYear(date.getFullYear());
        // this.currentMonth = date.getMonth() + 1;
        this.setMonth(date.getMonth() + 1);
        this.setWeek(date.getDay());
        const str = this.formatDate(this.currentYear, this.currentMonth, 1);
        this.days.length = 0;
        // 没有的日期用 "spaces" 代替
        var beforeSpaces = new Array(this.firstWeek - 1).fill('spaces', 0, this.firstWeek - 1);
        this.beforeSpaces = beforeSpaces;
        beforeSpaces.forEach((item, index) => {
          this.days.push(item);
        });
        // 把当前日期放入数组
        const d = new Date(str);
        this.days.push(d);
        this.isSevenDay();
        // 循环当月总天数
        var curMonthDays = this.getcurMonthDays(this.currentYear, this.currentMonth);
        for (let i = 1; i <= curMonthDays; i += 1) {
          const d = new Date(str);
          if (i < curMonthDays) {
            // 小于当月最大天数，放入数组
            d.setDate(d.getDate() + i);
            this.days.push(d);
          } else {
            // 不足7天用 "spaces" 代替
            for (let j = this.days.length; j < 7; j++) {
              this.days.push('spaces');
            }
          }
          this.isSevenDay();
          var initDay = init ? new Date().getDate() : this.currentDay;
          if (i === initDay && this.isToDay(this.currentYear, this.currentMonth, initDay)) {
            this.selectIndex = this.firstWeek + i - 2;
          }
        }
      },
      setRestOrWork(type) {
        if (this.onlySelect()) {
          this.params.type = type;
        }
      },
      // 是否有7天数据，有的话push给 "daysUL"
      isSevenDay() {
        if (this.days.length % 7 === 0) {
          this.daysUL.push(this.days);
          this.days = [];
        }
      },
      // 是否的当天
      isToDay(year, month, day) {
        var toDate = new Date();
        return toDate.getFullYear() === year && toDate.getMonth() + 1 === month && toDate.getDate() === day;
      },
      // 是否的当月
      isToMonth(year, month) {
        var toDate = new Date();
        var day = toDate.getDate();
        if (toDate.getFullYear() === year && toDate.getMonth() + 1 === month) {
          this.selectIndex = day + this.beforeSpaces.length;
          return true;
        } else {
          return false;
        }
      },
      // 获取当月有多少天
      getcurMonthDays(year, month) {
        var curMonthDays = new Date(year, month, 0).getDate();
        return curMonthDays;
      },
      // 上一個月&下一个月   传入当前年份和月份
      pickPreNext(year, month, num) {
        this.daysUL = [];
        this.isSelected = [];
        this.selectIndex = '';
        const d = new Date(this.formatDate(year, month, 1));
        d.setDate(num);
        if (this.isToMonth(d.getFullYear(), d.getMonth() + 1)) {
          this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1), true);
          // 请求当天的数据
          this.postData();
          this.isShowBtn = true;
        } else {
          this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
          this.isShowBtn = false;
        }
      },
      dealResult(currentYear, currentMonth) {
        this.banList = [];
        this.xiuList = [];
        this.isBan = [];
        this.isXiu = [];
        let zhouji = new Date(this.formatDate(currentYear, currentMonth, 1)).getDay();
        if (zhouji === 0) {
          zhouji = 7;
        }
        for (let i = 0; i < this.restDaysList.length;i++) {
          this.restDays = this.restDaysList[i];
          if (this.restDays.resttype === 'W') {
            let ban = this.restDays.day - 1 + (zhouji - 1);
            this.banList.push(ban);
          }
          if (this.restDays.resttype === 'R') {
            let xiu = this.restDays.day - 1 + (zhouji - 1);
            this.xiuList.push(xiu);
          }
        }
        for (let m = 0; m < 42; m++) {    // banlist 里面放置的都是在日历上处于几号位，而不是工作日的日期，
          let nothave = true;           // 所以得把这些位置号拎出来，给它们于不同的样式
          for (let k = 0; k < this.banList.length; k++) {
            if (m === this.banList[k]) {
              this.isBan.push(true);
              nothave = false;
              break;
            }
          }
          if (nothave) {
            this.isBan.push(false);
          }

        }
        for (let n = 0; n < 42; n++) {   // 同上，来处理休息日
          let nothave = true;
          for (let k = 0; k < this.xiuList.length; k++) {
            if (n === this.xiuList[k]) {
              this.isXiu.push(true);
              nothave = false;
              break;
            }
          }
          if (nothave) {
            this.isXiu.push(false);
          }
        }
      },
      // 数据请求
      postData() {
        console.log('请求数据...');
      },
      // 返回今天
      returnNow() {
        this.daysUL = [];
        this.initData(null);
      },
      // 当前选择日期
      pick(date, index) {
        this.selectIndex = index;
        this.isSelected = [];
        this.params.selectDay = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        console.log(this.params);
        // this.currentYear = date.getFullYear();
        // this.currentMonth = date.getMonth() + 1;
        // this.currentDay = date.getDate();
        this.setDay(date.getDate());
        this.setYear(date.getFullYear());
        this.setMonth(date.getMonth() + 1);
        for (let i = 0; i < 42; i++) {
          if (index === i) {
            this.isSelected.push(true);
            continue;
          }
          this.isSelected.push(false);
        }
        this.isCreatePlan(date);
      },
      // 判断是否可以新建计划，小于当前日期不可新建
      isCreatePlan(date) {
        // 当前年月日
        var nowDate = new Date();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1;
        var day = nowDate.getDate();
        // 点击的年月日数据
        var tapDateTime = new Date(this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate())).getTime();
        var currDate = new Date(this.formatDate(year, month, day)).getTime();
        console.log(currDate, tapDateTime, currDate > tapDateTime);
        if (currDate > tapDateTime && this.selectIndex) {
          this.isShowBtn = false;
        } else {
          this.isShowBtn = true;
        }
      },
      onlySelect() {
        if (this.params.selectDay === '') {
          this.$message({
            message: '请选择日期',
            type: 'warning'
          });
          return false;
        }
        return true;
      }
    },
    mounted() {
    }
  };

</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .picker-items{
    display: block;
  }
  .date {
    color: #333;
    float: left;
    width: 100%;
  }
  .calendar-content{
    background: #fff;
  }
  .button>div{
    margin-top:70px;
  }
  .month {
    font-size: 0.7rem;
    text-align: center;
    width: 100%;
    border-bottom: 1px solid gainsboro;
    line-height: 2rem;
  }
  .weekdays {
    opacity: 0.6;
    display: flex;
    font-size: 0.7rem;
    border-bottom: 1px solid #eee;
    background: #eee;
  }
  .weekdays>li{
    flex: 1;
    font-size: 0.7rem;
    width:2.7rem;
    list-style-type:none;
    text-align: center;
    line-height:  2rem;
    cursor:pointer;
  }
  .bodyDiv{
    border-bottom: 1px solid gainsboro;
  }
  .days {
    display: flex;
  }
  .days>li {
    flex: 1;
    font-size: 0.7rem;
    width:2.7rem;
    list-style-type:none;
    text-align: center;
    line-height:  2rem;
    cursor:pointer;
  }
  .selected{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    color: #fff;
    background-color: #00599f;
  }
  .active {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    color: #fff;
    background-color: #eee;
  }
  i{
    cursor:pointer
  }
  .el-icon-arrow{
    font: 500 20px sans-serif;
    color: #888;
    height: 2rem;
    width: 2rem;
    line-height: 2rem;
    margin: 0 .5rem;
    display: inline-block;
  }
  .other-month {
    color: #EEC591;
  }
  .dateItem{
    position: relative;
    justify-content: center;
    align-items: center;
    padding: 5px;
  }
  b.flag{
    background: #ccc;
    width: 8px;
    height: 8px;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
  }
  b.red{
    background: red;
  }
  .planList{
    font-size: 0.75rem;
    margin-bottom: 2.4rem;
  }
  .planList .planListItem {
    border-bottom: 1px solid #dcdcdc;
  }
  .planList .planListItem .status .text {
    color: #888;
    display: block;
    font-size: 12px;
    margin-top: 6px;
  }
  .submitBtn{
    background: #d9d9d9;
  }
</style>
