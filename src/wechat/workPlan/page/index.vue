/**
* @file 工作计划
* @author  石
* @date  2018/3/16
*/
<template>
  <div id='calendar'>
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
      <mt-button v-show="isShowBtn" slot="right" @click.native="createPlan">
        <i class="xs-icon icon-add"></i>
      </mt-button>
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
        <ul class="days" v-for="(value,index1) in daysUL" :key="index1">
          <li @click="pick(day)" v-for="(day, index) in value" :key="index">
            <!--本月-->
            <div class="dateItem" :class="{'selected': day !== 'spaces' && day.format('yyyy-MM-dd') === selectDate.format('yyyy-MM-dd')}">
              <span v-if="day==='spaces'"></span>
              <span v-else >{{ day.getDate() }}</span>
              <b  :class="[isHavePlan(day,index)]"></b>
           </div>
          </li>
        </ul>
      </div>
      <div class="planList">
        <!--<mt-cell-swipe  v-for="(item, index) in currentDayData" :key="index" ref="body"
          @click.native="toDetail(index)"
          class="planListItem lock-line-cell enable"
          :title="item.Type"
          :label="item['KL Detail Type']"
          :right="operation(item, item.Id, index)">
          <div>
            <p>{{formatDateTime(item.Planned)}} - {{formatDateTime(item['Planned Completion'])}}</p>
            <p class="text">{{item.Status}}</p>
          </div>
        </mt-cell-swipe>-->
        <mt-cell-swipe v-for="(item, index) in currentDayData" ref="body"
                       class="planListItem lock-line-cell enable"
                       @click.native="toDetail(index)"
                       :key=index
                       :right="operation(item, item.Id, index)"
                       is-link>
          <div class="co-flex co-jc" slot="title">
            <span class="co-f1">{{item.Type}}</span>
            <span class="co-f1" >{{formatDateTime(item.Planned)}} - {{formatDateTime(item['Planned Completion'])}}</span>

          </div>
          <div class="co-flex co-jc" slot="title">
            <span class="co-f1">{{item['KL Detail Type']}}</span>
            <span class="co-f1">{{item.Status}}</span>
          </div>
          <div class="co-flex co-jc" slot="title">
            <span class="co-f1">{{item['KL Task Batch Name']}}</span>
            <span class="co-f1"></span>
          </div>
        </mt-cell-swipe>

      </div>
      </div>
      <mt-datetime-picker
        ref="picker"
        v-model="pickerValue"
        type="date"
        :startDate="startDate"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        @confirm="handleConfirm"
        >
      </mt-datetime-picker>
    </div>
  </div>
</template>
<script type="es6">
  import {mapState, mapActions, mapMutations} from 'vuex';

  const NAMESPACE = 'index';
  // 当前时间对象
  const now = new Date();

  // 页面初始化
  let init = function(hook) {
    let me = this;
    let date = me.newYear ? new Date(me.newYear, me.newMonth - 1, me.newDay) : now;
    // 获取当天数据数据
    me.getCurrentDayData(date.format('MM/dd/yyyy'));
    // 第一次进入功能需要获取数据
    if (hook === 'created') {
      // 记录用户点击日期
      me.setSelectDate(date);
      me.initData(date);
      me.startGetData(date);
    }
  };

  export default {
    name: NAMESPACE,
    data() {
      return {
        headTitle: '工作计划',
        days: [], // 用于临时存储数据
        daysUL: [], // 当月所有数据
        params: { // 页面跳转参数
          selectDay: '',
          type: ''
        },
        pickerValue: '', // DatetimePicker组件默认值
        beforeSpaces: [], // 前面需要空几天
        startDate: new Date(new Date(now).setFullYear(now.getFullYear() - 1)), // 日期控件最小时间
        isShowBtn: true, // 是否显示新建按钮
        monthData: [] // 当月所有计划数据
      };
    },
    created() {
      init.call(this, 'created');
    },
    activated() {
      init.call(this);
    },
    computed: {
      ...mapState(NAMESPACE, ['selectDate', 'newYear', 'newMonth', 'newDay', 'currentYear', 'currentMonth', 'currentDay', 'firstWeek', 'listData', 'currentDayData'])
    },
    methods: {
      ...mapActions(NAMESPACE, ['setYear', 'setMonth', 'setDay', 'setWeek', 'getListData', 'setCurrentDayData', 'getCurrentDayData', 'deletePlan']),
      ...mapMutations(NAMESPACE, ['setSelectDate']),
      /**
       * 日期格式化，只返回时分
       * @param {String} time 必填 日期字符串
       * @return {String} 时:分 例 15:30
       */
      formatDateTime(time) {
        return new Date(time).format('hh:mm');
      },
      /**
       * 日期格式化
       * @param {Object} date 必填 日期对象或日期字符串
       * @param {String} format 必填 日期格式 例：yyyy-MM-dd
       * @return {String} 格式化后的日期字符串
       */
      format(date, format) {
        return new Date(date).format(format);
      },
      /**
       * 获取整月数据
       * @param {Date} date 必填 日期对象
       */
      startGetData(date) {
        let me = this;
        let yam = date.format('MM/dd/yyyy');
        let day = date.format('dd');
        let maxDay = me.getcurMonthDays(date);
        // 构造某月查询参数，start 为第一天，end 为最后一天
        let parmas = {'start': yam.replace(`/${day}/`, '/01/'), 'end': yam.replace(`/${day}/`, `/${maxDay}/`)};
        let param = Object.extend(true, {
          callback: (data) => {
            // 当月所有计划数据
            me.monthData = data;
          }
        }, parmas);
        // 获取整月数据
        me.getListData(param);
      },
      /**
       * 新建计划
       */
      createPlan() {
        this.$router.push({
          path: './add'
        });
      },
      /**
       * 计划左滑操作
       */
      operation(item, id, index) {
        // 页面跳转参数
        var params = Object.assign({}, {
          'id': id,
          'index': index,
          callback: data => {
            console.log(data);
          }
        });
        // 如果状态是未开始才有操作按钮
        if (item['Status INT'] === 'Not Started') {
          return [
            {
              content: '编辑',
              style: { background: '#00599f', color: '#fff' },
              handler: () => {
                this.$router.push({
                  path: './edit',
                  query: {
                    index: index
                  }
                });
              }
            },
            {
              content: '删除',
              style: { background: 'red', color: '#fff' },
              handler: () => this.deletePlanBox(params)
            }
          ];
        } else {
          return [];
        }
      },
      /**
       * 删除计划
       */
      deletePlanBox(params) {
        var me = this;
        MessageBox.confirm('你确定删除吗?').then(action => {
          me.deletePlan(params);
        });
      },
      /**
       * 跳转计划详情
       */
      toDetail(index) {
        this.$router.push({
          path: './detail',
          query: {
            index: index
          }
        });
      },
      /**
       * 打开年/月选择面板
       */
      openPicker() {
        // 给定DatetimePicker组件默认值
        this.pickerValue = now;
        this.$refs.picker.$el.lastChild.lastChild.children[2].style.display = 'none'; // 隐藏日选择
        this.$refs.picker.open();
      },
      /**
       * 选择月份
       */
      handleConfirm(date) {
        this.pickPreNext(date.getFullYear(), date.getMonth(), 42);
      },
      /**
       * 初始化日期
       */
      initData(iDate) {
        let me = this;
        const date = new Date(`${iDate.format('yyyy/MM')}/01`);
        // 设置当前查看日期
        me.setDay(iDate.getDate());
        me.setYear(iDate.getFullYear());
        me.setMonth(iDate.getMonth() + 1);
        me.setWeek(date.getDay());
        me.days.length = 0;
        // 没有的日期用 "spaces" 代替
        var beforeSpaces = new Array(me.firstWeek - 1).fill('spaces', 0, me.firstWeek - 1);
        me.beforeSpaces = beforeSpaces;
        beforeSpaces.forEach((item, index) => {
          me.days.push(item);
        });
        // 把当前日期放入数组
        me.days.push(date);
        // 计算满7天存入日历
        me.isSevenDay();
        // 循环当月总天数
        var curMonthDays = me.getcurMonthDays(new Date(me.currentYear, me.currentMonth, 0));
        for (let i = 1; i <= curMonthDays; i++) {
          let d = new Date(date);
          if (i < curMonthDays) {
            // 小于当月最大天数，放入数组
            d.setDate(d.getDate() + i);
            me.days.push(d);
          } else {
            // 不足7天用 "spaces" 代替
            for (let j = me.days.length; j < 7; j++) me.days.push('spaces');
          }
          // 计算满7天存入日历
          me.isSevenDay();
        }
      },
      /**
       * 是否有7天数据，有的话push给 "daysUL"
       * 如果没有7天不在此填充，后续补充空格
       */
      isSevenDay() {
        if (this.days.length % 7 === 0) {
          this.daysUL.push(this.days);
          this.days = [];
        }
      },
      /**
       * 是否当月
       * @param {String} date 必填 日期对象
       * @returns {Blooean} true/false
       */
      isToMonth(date) {
        return now.format('yyyy-MM') === date.format('yyyy-MM');
      },
      /**
       * 获取某月总天数
       * @param {Date} date 必填 日期对象
       * @returns {String} 该月的总天数
       */
      getcurMonthDays(date) {
        return new Date(new Date(new Date(date).setMonth(date.getMonth() + 1)).setDate(0)).getDate();
      },
      /**
       * 页面点击 上一個月&下一个月
       * @param {String} year 必填 年
       * @param {String} month 必填 月
       * @param {String} num 必填 日
       */
      pickPreNext(year, month, num) {
        let me = this;
        const date = new Date(year, month - 1, num);
        // 是否本月
        let toMonth = me.isShowBtn = me.isToMonth(date);
        // 清空月数据
        me.daysUL = [];
        // 清空天数据
        me.setCurrentDayData([]);
        // 初始化日历
        me.initData(date);
        // 如果是当月 获取选择天的数据
        if (toMonth) me.pick(new Date(date.setDate(now.getDate())));
        // 获取整月数据
        me.startGetData(date);
      },
      /**
       * 用户点击日期事件
       * @param {String} day 必填 用户点击的日期对象
       */
      pick(date) {
        let me = this;
        // 点击的为空白区域，视为无效点击
        if (date === 'spaces') return;
        // 记录用户点击日期
        me.setSelectDate(date);
        // 页面跳转参数 记录点击日期
        me.params.selectDay = date.format('yyyy/MM/dd');
        me.setDay(date.getDate());
        me.setYear(date.getFullYear());
        me.setMonth(date.getMonth() + 1);
        // 判断是否可以新建计划
        me.isCreatePlan(date);
        // 清空数据
        me.setCurrentDayData([]);
        // 获取当天的计划
        me.getCurrentDayData(date.format('MM/dd/yyyy'));
      },
      /**
       * 判断是否可以新建计划
       * 未选择日期 或 小于当前日期不可新建
       * @param {String} date 必填 日期对象
       */
      isCreatePlan(date) {
        this.isShowBtn = date && new Date(new Date(date).setDate(date.getDate() + 1)) > now;
      },
      /**
       * 计算某天所有的任务状态
       * @param {String} date 必填 日期对象
       */
      calcDayState(date) {
        let state = '';
        // 当月所有计划数据
        let data = this.monthData;
        if (data) {
          for (var j = 0; j < data.length; j++) {
            // 判断某天是否有计划，并记录所有计划状态
            // 计划开始时间 <= 某天晚时间 && 计划完成时间 >= 某天最早时间
            if (new Date(data[j].Planned) <= new Date(`${date.format('yyyy/MM/dd')} 23:59:59`) && new Date(data[j]['Planned Completion']) >= new Date(`${date.format('yyyy/MM/dd')} 00:00:00`)) {
              state += '/' + data[j]['Status INT'];
            }
          }
        }
        return state;
      },
      /**
       * 日历每天的点颜色标记
       * 红色：某天有未完成的计划
       * 灰色：已完成某天所有计划
       * @param {String} day 必填 日期对象
       */
      isHavePlan(day) {
        let style = 'none';
        // 空白块不需要计算，不显示小点
        if (day === 'spaces') return style;
        // 计算某天所有的任务状态
        let state = this.calcDayState(day);
        // 该天有任务，日历下显示小点
        if (state) {
          // 默认灰点
          style = 'flag';
          // 如果有未完成的计划 展示红点
          if (state.replace(/\/Done/g, '')) style = 'red';
        }
        return style;
      }
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
