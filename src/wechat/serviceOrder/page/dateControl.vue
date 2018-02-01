<template>
  <div>
    <mt-header fixed :title="headTitle">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="date mint-content">
      <!-- 年份 月份 -->
      <div class="month">
        <i class="el-icon-arrow" @click="pickPre(currentYear,currentMonth)"><</i>
        <span>{{ currentYear }} 年 {{ currentMonth }} 月</span>
        <i class="el-icon-arrow" @click="pickNext(currentYear,currentMonth)">></i>
      </div>
      <!-- 星期 -->
      <ul class="weekdays">
        <li>一</li>
        <li>二</li>
        <li>三</li>
        <li>四</li>
        <li>五</li>
        <li style="color:#0A0A0A">六</li>
        <li style="color:#0A0A0A">日</li>
      </ul>
      <!-- 日期 -->
      <div class="bodyDiv">
        <ul class="days" v-for="(value,index1) in daysUL">
          <li @click="pick(day,index+index1*7)" v-for="(day, index) in value" :class="[{'ban':isBan[index+index1*7]},{'xiu':isXiu[index+index1*7]}]" >
            <!--本月-->
            <span v-if="day.getMonth()+1 != currentMonth" class="other-month" :class="{'selected':isSelected[index+index1*7]}">{{ day.getDate() }}</span>
            <span v-else :class="{'selected':isSelected[index+index1*7]}">
          <!--今天-->
          <span v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()" class="active">{{ day.getDate() }}</span>
          <span v-else>{{ day.getDate() }}</span>
          </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'date',

    data() {
      return {
        headTitle: '工作计划',
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        currentWeek: 1,    // 星期
        firstWeek: 1,
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
        selectIndex: ''
      };
    },

    created() {
      this.initData(null);
    },

    methods: {
      formatDate(year, month, day) {
        const y = year;
        let m = month;
        if (m < 10) m = `0${m}`;
        let d = day;
        if (d < 10) d = `0${d}`;
        return `${y}-${m}-${d}`;
      },

      initData(cur) {
        let date = '';
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

        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 42- this.firstWeek
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
            this.daysUL.push(this.days);
            this.days = [];
          }
        }
      },
      setRestOrWork(type) {
        if (this.onlySelect()) {
          this.params.type = type;
        }
      },
      cancel() {
      },
      // 上一個月   传入当前年份和月份
      pickPre(year, month) {
        this.daysUL = [];
        this.isSelected = [];
        const d = new Date(this.formatDate(year, month, 1));
        d.setDate(0);
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
      },

      // 下一個月   传入当前年份和月份
      pickNext(year, month) {
        this.daysUL = [];
        this.isSelected = [];
        const d = new Date(this.formatDate(year, month, 1));
        d.setDate(42);
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
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
      returnNow() {
        this.daysUL = [];
        this.initData(null);
      },
      // 当前选择日期
      pick(date, index) {
        this.selectIndex = index;
        this.isSelected = [];
        this.params.selectDay = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        console.log(this);
        for (let i = 0; i < 42; i++) {
          if (index === i) {
            this.isSelected.push(true);
            continue;
          }
          this.isSelected.push(false);
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
    }
  };

</script>

<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  .date {
    color: #333;
    float: left;
    width: 100%;
  }
  .button>div{
    margin-top:70px;
  }
  .month {
    font-size: 0.7rem;
    text-align: center;
    width: 100%;
    border-bottom: 1px solid gainsboro;
  }
  .weekdays {
    opacity: 0.6;
    display: flex;
    font-size: 0.7rem;
    border-bottom: 1px solid gainsboro;
  }
  .weekdays>li{
    flex: 1;
    font-size: 0.7rem;
    width:2.7rem;
    list-style-type:none;
    text-align: center;
    margin-top: 5px;
    line-height:  1rem;
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
    margin-top: 5px;
    line-height:  1.7rem;
    cursor:pointer;
  }
  .selected{
    display: inline-block;
    width: 2rem;
    height: 2rem;
    color: #fff;
    background-color: #1E90FF;
  }
  .active {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    color: #fff;
    background-color: #324057;
  }
  i{
    cursor:pointer
  }
  .el-icon-arrow{
    font: 500 20px sans-serif;
    color: #888;
  }
  .other-month {
    color: #EEC591;
  }
</style>
