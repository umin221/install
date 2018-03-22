<template>
    <!--头部按钮-->
    <div class="alertDate">
      <div class="headerButton">
        <div class="cancelBtn" @click="cancel">取消</div>
        <div class="enterBtn" @click="enter">确认</div>
      </div>

      <!--选择年月和日期-->
      <div class="dateContent">
        <div class="month">
          <i class="xs-icon icon-back" v-show="leftBunHide" @click="pickPre(currentYear,currentMonth)"></i>
          <span>{{ currentYear }} 年 {{ currentMonth }} 月</span>
          <i class="xs-icon icon-next" @click="pickNext(currentYear,currentMonth)"></i>
        </div>
        <!-- 日期 -->
        <div class="bodyDiv">
          <ul class="weekdays">
            <li>周一</li>
            <li>周二</li>
            <li>周三</li>
            <li>周四</li>
            <li>周五</li>
            <li style="color:darkred">周六</li>
            <li style="color:darkred">周日</li>
          </ul>
          <mt-swipe :auto="0" :show-indicators="false" :speed="50" :continuous="false">
            <mt-swipe-item class="days" v-for="(value,index1) in daysUL" :key="index1">
              <ul>
                <li  v-for="(day, index) in value" :key="index" @click="pick(day,index+index1*7)">
                  <!--本月-->
                  <span v-if="day.getMonth()+1 != currentMonth" class="other-month" :class="{'selected':isSelected[index+index1*7]}">{{ day.getDate() }}</span>
                  <span v-else :class="{'selected':isSelected[index+index1*7]}">
                    <!--今天-->
                    <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active1">{{ day.getDate() }}</span>
                    <span v-else>{{ day.getDate() }}</span>
                  </span>
                </li>
              </ul>
            </mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
      <!--选择时间-->
      <div class="timeTable">
        <table>
          <tr v-for="(Am, index1) in am" :key="index1">
            <td v-for="(time, index) in Am.time" :key="index" @click="selectedTime(index+index1*8,index1,index)" :class="{'selectedT':isTimeSelected[index+index1*8]}">{{time}}</td>
          </tr>
        </table>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'date',
    props: ['showBox2'],
    created() {
      let self = this;
      self.initData(null);
      if (self.daysUL.length === 0) {
        self.initData(null);
      }
      if (this.am.length === 0) {
        self.initTableTime();
      }
    },
    data() {
      return {
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        currentWeek: 1,    // 星期
        firstWeek: 1,
        days: [],
        daysUL: [],
        params: {
          selectDay: '',
          Time1: {
            key: '',
            time: ''
          },
          Time2: {
            key: '',
            time: ''
          },
          type: ''
        },
        leftBunHide: false,
        isSelected: [],
        selectIndex: '',
        initAm: '00:00',
        am: [],
        num: 0,
        isTimeSelected: [],
        isMyDay: false
      };
    },
    methods: {
      cancel() {                    // 日历取消事件
        let self = this;
        self.$emit('my-cancel', this.params);
      },
      enter() {                     // 日历确定
        let self = this;
        if (!self.params.selectDay) {
          self.params.selectDay = self.formatDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
        }
        self.$emit('my-enter', self.params);
        self.params = {
          selectDay: '',
          Time1: {
            key: '',
            time: ''
          },
          Time2: {
            key: '',
            time: ''
          },
          type: ''
        };
      },
      pickPre(year, month) {        // 点击切换上个月
        let self = this;
        let mon = new Date().getMonth() + 1;
        let myYear = new Date().getFullYear();
        self.daysUL = [];
        self.isSelected = [];
        const d = new Date(self.formatDate(year, month, 1));
        d.setDate(0);
        self.initData(self.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        if (mon === self.currentMonth && myYear === self.currentYear) {
          self.leftBunHide = false;
        }
      },
      pickNext(year, month) {     // 点击切换下个月
        let self = this;
        let myMon = new Date().getMonth() + 1;
        self.daysUL = [];
        self.isSelected = [];
        const d = new Date(self.formatDate(year, month, 1));
        d.setDate(42);
        self.initData(self.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
        if (myMon !== self.currentMonth) {
          self.leftBunHide = true;
        }
      },
      pick(date, index) {             // 选择日期
        this.selectIndex = index;
        this.isSelected = [];
        this.params.selectDay = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        console.log(this.params);
        for (let i = 0; i < 42; i++) {
          if (index === i) {
            this.isSelected.push(true);
            continue;
          }
          this.isSelected.push(false);
        }
      },
      formatDate(year, month, day) {
        const y = year;
        let m = month;
        if (m < 10) m = `0${m}`;
        let d = day;
        if (d < 10) d = `0${d}`;
        return `${y}-${m}-${d}`;
      },
      initData(cur) {            // 日历初始化
        let date = '';
        let Year = new Date().getFullYear();
        let Month = new Date().getMonth();
        let Day = new Date().getDate();
        if (cur) {
          date = new Date(cur);
        } else {
          date = new Date();
        }
        this.currentDay = date.getDate();
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth() + 1;
        this.currentWeek = date.getDay();
        date.setDate(1);
        this.firstWeek = date.getDay();
        if (this.firstWeek === 0) {
          this.firstWeek = 7;
        }
        const str = this.formatDate(this.currentYear, this.currentMonth, 1);
        this.days.length = 0;
        for (let i = this.firstWeek - 1; i >= 0; i -= 1) {
          const d = new Date(str);
          d.setDate(d.getDate() - i);
          this.days.push(d);
        }
        if (this.days.length % 7 === 0) {
          this.daysUL.push(this.days);
          this.days = [];
        }
        for (let i = 1; i <= 35 - this.firstWeek; i += 1) {
          const d = new Date(str);
          d.setDate(d.getDate() + i);
          this.days.push(d);
          if (this.days.length % 7 === 0) {
            if (!this.isMyDay) {
              for (let j = 0; j < this.days.length;j++) {
                if (this.days[j].getFullYear() === Year && this.days[j].getMonth() === Month && this.days[j].getDate() === Day) {
                  this.daysUL.push(this.days);
                  this.isMyDay = true;
                } else {
                }
              }
            } else {
              this.daysUL.push(this.days);
            }
            this.days = [];
          }
        }
        console.log(this.daysUL);
      },
      initTableTime() {             // 时间表格初始化
        let arr = [];
        let time = '';
        let obj = {};
        for (let i = 0;i < 6; i++) {
          for (let i = 0;i <= 7;i++) {
            time = this.changeTime(this.initAm);
            arr.push(time);
            this.initAm = time;
          }
          this.initAm = time;
          obj = {time: arr};
          this.am.push(obj);
          obj = {};
          arr = [];
        }
      },
      changeTime(value) {
        let x = '2010-09-28 ' + value;
        console.log(x.replace(/-/g, '/'));
        let time = new Date(x.replace(/-/g, '/'));
        const b = 30;
        time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
        time = time.toString().split(' ')[4].slice(0, 5);
        return time;
      },
      selectedTime(index, index1, index2) {             // 选择时间
        let self = this;
        let seleat = '';
        if (self.num === 2) {
          self.isTimeSelected = [];
          self.num = 0;
          self.params.Time1 = {};
          self.params.Time2 = {};
        }
        if (self.isTimeSelected.length) {
          for (let i = 0; i < 48; i++) {
            if (index === i) {
              self.isTimeSelected[i] = true;
              seleat = Math.floor(index / 8);
              self.num = self.num + 1;
            } else {
              self.isTimeSelected.push(false);
            }
          }
        } else {
          for (let i = 0; i < 48; i++) {
            if (index === i) {
              self.isTimeSelected.push(true);
              seleat = Math.floor(index / 8);
              self.num = self.num + 1;
            } else {
              self.isTimeSelected.push(false);
            }
          }
        }
        if (self.num === 1) {
          self.params.Time1.time = self.am[seleat].time[index - seleat * 8];
          self.params.Time1.key = (index1 + 1) * (index2 + 1);
        } else if (self.num === 2) {
          self.params.Time2.time = self.am[seleat].time[index - seleat * 8];
          self.params.Time2.key = (index1 + 1) * (index2 + 1);
        }
      }
    }
  };
</script>
<style lang="scss">
  *{
    margin: 0;
    padding: 0;
  }
  .mint-popup-1{
    width: 100%;
    height: 22rem;
    background: white;
    .alertDate{
      width: 100%;
      .headerButton{
        height: 2rem;
        line-height: 2rem;
        border-bottom: 1px solid gainsboro;
        div{
          color: darkred;
          font-size: 0.7rem;
        }
        .cancelBtn{
          float: left;
          margin-left: 0.5rem;
        }
        .enterBtn{
          float: right;
          margin-right: 0.5rem;
        }
      }
      .dateContent{
        height: 6rem;
        border-bottom: 1px solid gainsboro;
        .month{
          text-align: center;
          line-height: 2rem;
          font-size: 0.7rem;
          position: relative;
          i{
            position: absolute;
            top: 0;
          }
          .icon-next{
            right: 0.5rem;
          }
          .icon-back{
            left: 0.5rem;
          }
        }
        .weekdays{
          display: flex;
          li{
            flex: 1;
            font-size: 0.7rem;
            width:2.7rem;
            list-style-type:none;
            text-align: center;
            line-height:  2rem;
            cursor:pointer;
          }
        }
        .mint-swipe{
          height: 2rem !important;
          .mint-swipe-items-wrap{
            .days{
              ul{
                display: flex;
                li{
                  flex: 1;
                  font-size: 0.7rem;
                  width:2.7rem;
                  list-style-type:none;
                  text-align: center;
                  line-height:  2rem;
                  cursor:pointer;
                  .other-month {
                    color: #EEC591;
                  }
                  .active1 {
                    display: inline-block;
                    width: 2rem;
                    height: 2rem;
                    color: #fff;
                    background-color: #324057;
                  }
                  .selected{
                    display: inline-block;
                    width: 2rem;
                    height: 2rem;
                    color: #fff;
                    background-color: #1E90FF!important;
                  }
                }
              }
            }
          }
        }
      }
      .timeTable{
        background: gainsboro;
        table{
          width: 100%;
          font-size: 0.7rem;
          margin-top: 0.5rem;
          background: white;
          tr{
            td{
              width: 12.5%;
              height: 2rem;
              text-align: center;
            }
            .selectedT{
              background: gainsboro;
            }
          }
        }
      }
    }
  }
</style>
